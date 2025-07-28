'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { smartNotificationService } from '@/lib/smartNotifications';

interface NotificationSettingsProps {}

export const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [monthlyReminders, setMonthlyReminders] = useState(false);
  const [smartNotifications, setSmartNotifications] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const enabledSetting = localStorage.getItem('notifications-enabled') === 'true';
    const monthlySetting = localStorage.getItem('monthly-reminders') === 'true';
    const smartSetting = localStorage.getItem('smart-notifications') === 'true';
    
    setNotificationsEnabled(enabledSetting);
    setMonthlyReminders(monthlySetting);
    setSmartNotifications(smartSetting);

    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Register service worker if not already registered
    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Dieser Browser unterstützt keine Benachrichtigungen.');
      return false;
    }

    setLoading(true);
    
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        return true;
      } else {
        alert('Benachrichtigungen wurden nicht erlaubt. Du kannst sie in den Browsereinstellungen aktivieren.');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }

    setNotificationsEnabled(enabled);
    localStorage.setItem('notifications-enabled', enabled.toString());

    if (enabled) {
      scheduleMonthlyReminders();
    }
  };

  const handleMonthlyRemindersToggle = (enabled: boolean) => {
    setMonthlyReminders(enabled);
    localStorage.setItem('monthly-reminders', enabled.toString());

    if (enabled && notificationsEnabled && permission === 'granted') {
      scheduleMonthlyReminders();
    }
  };

  const handleSmartNotificationsToggle = (enabled: boolean) => {
    setSmartNotifications(enabled);
    localStorage.setItem('smart-notifications', enabled.toString());

    if (enabled && notificationsEnabled && permission === 'granted') {
      scheduleSmartNotifications();
    }
  };

  const scheduleMonthlyReminders = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeUntilReminder = nextMonth.getTime() - now.getTime();

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        showMonthlyReminder();
        scheduleMonthlyReminders(); // Schedule next month
      }, timeUntilReminder);
    }
  };

  const showMonthlyReminder = () => {
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
    const task = gardenTasks[currentMonth as keyof typeof gardenTasks];

    if (permission === 'granted') {
      new Notification('Monatliche Gartenpflege-Erinnerung', {
        body: task,
        icon: '/manifest.json',
        tag: 'monthly-reminder'
      });
    }
  };

  const testNotification = async () => {
    if (permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }

    new Notification('Test-Benachrichtigung', {
      body: 'Push-Benachrichtigungen funktionieren! 🌱',
      icon: '/icon-192x192.png'
    });
  };

  const testSmartNotification = async () => {
    if (permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }

    const notification = await smartNotificationService.generateWeatherBasedTip();
    if (notification) {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/icon-192x192.png',
        tag: 'smart-test'
      });
    } else {
      new Notification('🌿 Intelligenter Tipp', {
        body: 'Wetterdaten werden geladen...',
        icon: '/icon-192x192.png'
      });
    }
  };

  const scheduleSmartNotifications = () => {
    // Schedule daily checks at 9 AM
    const now = new Date();
    const tomorrow9AM = new Date();
    tomorrow9AM.setDate(now.getDate() + 1);
    tomorrow9AM.setHours(9, 0, 0, 0);
    
    const timeUntilNext9AM = tomorrow9AM.getTime() - now.getTime();
    
    setTimeout(async () => {
      const notification = await smartNotificationService.generateWeatherBasedTip();
      if (notification && permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/icon-192x192.png',
          tag: 'smart-garden-tip'
        });
      }
      // Schedule next day
      scheduleSmartNotifications();
    }, timeUntilNext9AM);
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { icon: CheckCircle, text: 'Erlaubt', color: 'text-green-600' };
      case 'denied':
        return { icon: AlertCircle, text: 'Blockiert', color: 'text-red-600' };
      default:
        return { icon: Bell, text: 'Nicht gesetzt', color: 'text-gray-600' };
    }
  };

  const permissionStatus = getPermissionStatus();
  const PermissionIcon = permissionStatus.icon;

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <BellRing className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Benachrichtigungen</h2>
          </div>

          <div className="space-y-6">
            {/* Permission Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PermissionIcon className={`w-5 h-5 mr-2 ${permissionStatus.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    Browser-Berechtigung: {permissionStatus.text}
                  </span>
                </div>
                {permission !== 'granted' && (
                  <Button
                    size="sm"
                    onClick={requestNotificationPermission}
                    disabled={loading}
                  >
                    {loading ? 'Lädt...' : 'Erlauben'}
                  </Button>
                )}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Push-Benachrichtigungen</h3>
                  <p className="text-sm text-gray-600">
                    Erhalte Benachrichtigungen auch wenn die App geschlossen ist
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => handleNotificationsToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Monatliche Erinnerungen</h3>
                  <p className="text-sm text-gray-600">
                    Automatische Erinnerungen am 1. jeden Monats mit Gartentipps
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={monthlyReminders}
                    onChange={(e) => handleMonthlyRemindersToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    Intelligente Wettertipps
                  </h3>
                  <p className="text-sm text-gray-600">
                    Täglich um 9 Uhr: Kurze Tipps basierend auf Wetter (Düngen, Lüften, etc.)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smartNotifications}
                    onChange={(e) => handleSmartNotificationsToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="pt-4 space-y-3">
              <Button
                onClick={testNotification}
                variant="secondary"
                className="w-full"
                disabled={!notificationsEnabled}
              >
                <Bell className="w-4 h-4 mr-2" />
                Standard-Test senden
              </Button>
              
              <Button
                onClick={testSmartNotification}
                variant="secondary"
                className="w-full"
                disabled={!smartNotifications}
              >
                <Zap className="w-4 h-4 mr-2" />
                Intelligenten Wettertipp testen
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};