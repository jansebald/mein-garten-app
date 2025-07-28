const API_KEY = '56264ccb35096bfc39b5c7d42544283f';
const CITY = 'Happurg';

document.addEventListener('DOMContentLoaded', () => {
    loadLog();
    fetchWeather();
    updateStats();
    checkReminders();
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