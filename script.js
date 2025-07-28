const API_KEY = '56264ccb35096bfc39b5c7d42544283f';
const CITY = 'Happurg';

document.addEventListener('DOMContentLoaded', () => {
    loadLog();
    fetchWeather();
    updateStats();
    checkReminders();
    registerServiceWorker();
    loadNotificationSettings();
    scheduleMonthlyReminders();
    showTab('weather'); // Standard-Tab
});

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory').value;
    const reminderDate = document.getElementById('reminderDate').value;
    const task = taskInput.value.trim();
    if (task === '') return;

    const date = new Date().toLocaleString('de-DE');
    const logEntry = {
        id: Date.now(),
        text: `${date}: [${taskCategory}] ${task}`,
        category: taskCategory,
        reminder: reminderDate || null
    };

    appendLogEntry(logEntry);
    saveLog(logEntry);
    updateStats();

    if (logEntry.reminder) scheduleReminder(logEntry);
    taskInput.value = '';
    document.getElementById('reminderDate').value = '';
}

function appendLogEntry(logEntry) {
    const logList = document.getElementById('logList');
    const li = document.createElement('li');
    li.dataset.id = logEntry.id;
    li.innerHTML = `
        <span>${logEntry.text}${logEntry.reminder ? ` (Erinnerung: ${logEntry.reminder})` : ''}</span>
        <div>
            <button class="edit-btn" onclick="editTask(${logEntry.id})">Bearbeiten</button>
            <button class="delete-btn" onclick="deleteTask(${logEntry.id})">Löschen</button>
        </div>
    `;
    logList.appendChild(li);
}

function saveLog(logEntry) {
    let logs = JSON.parse(localStorage.getItem('lawnCareLogs')) || [];
    logs.push(logEntry);
    localStorage.setItem('lawnCareLogs', JSON.stringify(logs));
}

function loadLog() {
    const logList = document.getElementById('logList');
    let logs = JSON.parse(localStorage.getItem('lawnCareLogs')) || [];
    logs.forEach(log => appendLogEntry(log));
}

function editTask(id) {
    let logs = JSON.parse(localStorage.getItem('lawnCareLogs')) || [];
    const log = logs.find(l => l.id === id);
    if (!log) return;

    const newText = prompt('Eintrag bearbeiten:', log.text);
    if (newText !== null && newText.trim() !== '') {
        log.text = newText.trim();
        localStorage.setItem('lawnCareLogs', JSON.stringify(logs));
        refreshLogList();
        updateStats();
    }
}

function deleteTask(id) {
    if (confirm('Eintrag wirklich löschen?')) {
        let logs = JSON.parse(localStorage.getItem('lawnCareLogs')) || [];
        logs = logs.filter(l => l.id !== id);
        localStorage.setItem('lawnCareLogs', JSON.stringify(logs));
        refreshLogList();
        updateStats();
    }
}

function refreshLogList() {
    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    loadLog();
}

function fetchWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=de`)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = document.getElementById('weatherInfo');
            weatherInfo.textContent = `${data.weather[0].description}, ${data.main.temp}°C in ${data.name}`;
        })
        .catch(() => {
            document.getElementById('weatherInfo').textContent = 'Wetterdaten konnten nicht geladen werden.';
        });
}

function updateStats() {
    let logs = JSON.parse(localStorage.getItem('lawnCareLogs')) || [];
    const statsInfo = document.getElementById('statsInfo');
    const counts = {
        Düngen: logs.filter(l => l.category === 'Düngen').length,
        Lüften: logs.filter(l => l.category === 'Lüften').length,
        Mähen: logs.filter(l => l.category === 'Mähen').length,
        Sonstiges: logs.filter(l => l.category === 'Sonstiges').length
    };
    const lastEntry = logs.length > 0 ? logs[logs.length - 1].text : 'Noch keine Einträge';
    statsInfo.innerHTML = `
        Düngen: ${counts.Düngen} Mal<br>
        Lüften: ${counts.Lüften} Mal<br>
        Mähen: ${counts.Mähen} Mal<br>
        Sonstiges: ${counts.Sonstiges} Mal<br>
        Letzter Eintrag: ${lastEntry}
    `;
}

function checkReminders() {
    let logs = JSON.parse(localStorage.getItem('lawnCareLogs')) || [];
    logs.forEach(log => {
        if (log.reminder) scheduleReminder(log);
    });
}

function scheduleReminder(log) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const reminderDate = new Date(log.reminder);
        const now = new Date();
        const timeDiff = reminderDate - now;

        if (timeDiff > 0) {
            setTimeout(() => {
                new Notification(`Rasenpflege-Erinnerung: ${log.text}`);
            }, timeDiff);
        }
    } else if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// Service Worker registrieren
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registriert:', registration);
            })
            .catch((error) => {
                console.log('Service Worker Registrierung fehlgeschlagen:', error);
            });
    }
}

// Push-Benachrichtigungen aktivieren
function enablePushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa40HI6DjAM9BQGr0bIgAdTEXPqWlzVGhd5IvKAYQfTckZhPZD08J2ZU9ycD-c')
            });
        }).then((subscription) => {
            console.log('Push-Subscription erstellt:', subscription);
            localStorage.setItem('pushSubscription', JSON.stringify(subscription));
        }).catch((error) => {
            console.error('Push-Subscription fehlgeschlagen:', error);
        });
    }
}

// VAPID Key Konverter
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Monatliche Erinnerungen planen
function scheduleMonthlyReminders() {
    const isEnabled = localStorage.getItem('monthlyReminders') === 'true';
    if (!isEnabled) return;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Wenn wir noch nicht den ersten des Monats hatten, plane für diesen Monat
    let targetDate = now.getDate() === 1 ? firstOfMonth : nextMonth;
    
    const timeUntilReminder = targetDate.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
        setTimeout(() => {
            showMonthlyReminder();
            // Plane nächste Erinnerung für den folgenden Monat
            scheduleMonthlyReminders();
        }, timeUntilReminder);
    }
}

// Monatliche Erinnerung anzeigen
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
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Monatliche Gartenpflege-Erinnerung', {
            body: task,
            icon: '/icon.png',
            tag: 'monthly-reminder'
        });
    }
}

// Benachrichtigungs-Einstellungen laden
function loadNotificationSettings() {
    const enableNotifications = localStorage.getItem('enableNotifications') === 'true';
    const monthlyReminders = localStorage.getItem('monthlyReminders') === 'true';
    
    document.getElementById('enableNotifications').checked = enableNotifications;
    document.getElementById('monthlyReminders').checked = monthlyReminders;
    
    // Event Listener für Checkboxen
    document.getElementById('enableNotifications').addEventListener('change', (e) => {
        localStorage.setItem('enableNotifications', e.target.checked);
        if (e.target.checked) {
            requestNotificationPermission();
        }
    });
    
    document.getElementById('monthlyReminders').addEventListener('change', (e) => {
        localStorage.setItem('monthlyReminders', e.target.checked);
        if (e.target.checked) {
            scheduleMonthlyReminders();
        }
    });
}

// Benachrichtigungsberechtigung anfordern
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                enablePushNotifications();
            }
        });
    }
}

// Test-Benachrichtigung
function testNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Test-Benachrichtigung', {
                body: 'Push-Benachrichtigungen funktionieren! 🌱',
                icon: '/icon.png'
            });
        } else {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification('Test-Benachrichtigung', {
                        body: 'Push-Benachrichtigungen funktionieren! 🌱',
                        icon: '/icon.png'
                    });
                }
            });
        }
    } else {
        alert('Benachrichtigungen werden von diesem Browser nicht unterstützt.');
    }
}