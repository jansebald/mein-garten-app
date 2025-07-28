// Service Worker für Push-Benachrichtigungen und PWA-Funktionalität

const CACHE_NAME = 'garten-pflege-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icon.png'
];

// Installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch Handler für Offline-Funktionalität
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

// Push Event Handler
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Zeit für die Gartenpflege!',
        icon: '/icon.png',
        badge: '/icon.png',
        tag: 'garten-erinnerung',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'App öffnen',
                icon: '/icon.png'
            },
            {
                action: 'dismiss',
                title: 'Später erinnern',
                icon: '/icon.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Gartenpflege Erinnerung', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // Erinnerung für eine Woche später setzen
        setTimeout(() => {
            self.registration.showNotification('Gartenpflege Erinnerung', {
                body: 'Vergiss nicht deine Gartenpflege!',
                icon: '/icon.png'
            });
        }, 7 * 24 * 60 * 60 * 1000); // 7 Tage
    }
});

// Monatliche Erinnerungen planen
function scheduleMonthlyReminders() {
    const gardenTasks = {
        1: 'Januar: Plane das Gartenjahr, bestelle Samen und überprüfe Gartengeräte',
        2: 'Februar: Bereite Beete vor, schneide Obstbäume und plane neue Pflanzungen',
        3: 'März: Erste Düngung des Rasens, beginne mit der Aussaat, lüfte den Rasen',
        4: 'April: Setze Pflanzen um, beginne regelmäßiges Mähen, bekämpfe Unkraut',
        5: 'Mai: Pflanze Sommerblumen, mulche Beete, gieße regelmäßig',
        6: 'Juni: Zweite Rasendüngung, beschneide Hecken, ernte erste Früchte',
        7: 'Juli: Intensives Gießen, Schädlingskontrolle, regelmäßiges Mähen',
        8: 'August: Ernte und Konservierung, Pflege von Kübelpflanzen',
        9: 'September: Dritte Rasendüngung, Herbstpflanzungen, Kompost anlegen',
        10: 'Oktober: Laub sammeln, Winterschutz vorbereiten, letzte Ernte',
        11: 'November: Gartengeräte winterfest machen, Kübelpflanzen einräumen',
        12: 'Dezember: Garten winterfest machen, Jahresplanung für nächstes Jahr'
    };

    const currentMonth = new Date().getMonth() + 1;
    const task = gardenTasks[currentMonth];
    
    return task;
}

// Background Sync für monatliche Erinnerungen
self.addEventListener('sync', (event) => {
    if (event.tag === 'monthly-reminder') {
        event.waitUntil(
            self.registration.showNotification('Monatliche Gartenpflege', {
                body: scheduleMonthlyReminders(),
                icon: '/icon.png',
                tag: 'monthly-garden-task'
            })
        );
    }
});