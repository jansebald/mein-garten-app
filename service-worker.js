// Service Worker für Push-Benachrichtigungen und PWA-Funktionalität
const CACHE_NAME = 'mein-garten-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Aktivierung
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Handler für Caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Push Event Handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Zeit für die Gartenpflege!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'garten-erinnerung',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'App öffnen',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Später erinnern',
        icon: '/icon-192.png'
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
        icon: '/icon-192.png'
      });
    }, 7 * 24 * 60 * 60 * 1000); // 7 Tage
  }
});

// Background Sync für monatliche Erinnerungen
self.addEventListener('sync', (event) => {
  if (event.tag === 'monthly-reminder') {
    event.waitUntil(
      showMonthlyReminder()
    );
  }
});

function showMonthlyReminder() {
  const gardenTasks = {
    0: 'Januar: Plane das Gartenjahr, bestelle Samen und überprüfe Gartengeräte',
    1: 'Februar: Bereite Beete vor, schneide Obstbäume und plane neue Pflanzungen',
    2: 'März: Erste Düngung des Rasens, beginne mit der Aussaat, lüfte den Rasen',
    3: 'April: Setze Pflanzen um, beginne regelmäßiges Mähen, bekämpfe Unkraut',
    4: 'Mai: Pflanze Sommerblumen, mulche Beete, gieße regelmäßig',
    5: 'Juni: Zweite Rasendüngung, beschneide Hecken, ernte erste Früchte',
    6: 'Juli: Intensives Gießen, Schädlingskontrolle, regelmäßiges Mähen',
    7: 'August: Ernte und Konservierung, Pflege von Kübelpflanzen',
    8: 'September: Dritte Rasendüngung, Herbstpflanzungen, Kompost anlegen',
    9: 'Oktober: Laub sammeln, Winterschutz vorbereiten, letzte Ernte',
    10: 'November: Gartengeräte winterfest machen, Kübelpflanzen einräumen',
    11: 'Dezember: Garten winterfest machen, Jahresplanung für nächstes Jahr'
  };

  const currentMonth = new Date().getMonth();
  const task = gardenTasks[currentMonth];

  return self.registration.showNotification('Monatliche Gartenpflege', {
    body: task,
    icon: '/icon-192.png',
    tag: 'monthly-garden-task'
  });
}