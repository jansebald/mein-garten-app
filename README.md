# 🌱 Mein Garten - Rasenpflege Manager

Eine professionelle Web-App für die Rasenpflege mit Perfect Green Mähroboter-Integration.

![App Screenshot](https://via.placeholder.com/800x400/16a34a/ffffff?text=Mein+Garten+App)

## 🎯 Features

### 📱 **Hauptfunktionen**
- **Garten-Tagebuch** - Düngungen und Aussaaten dokumentieren
- **Wetter-Integration** - Aktuelle Daten für Kulmbach mit Empfehlungen
- **Perfect Green Kalender** - Monatliche Rasenpflege-Pläne
- **Profi-Rechner** - Dünger- und Saatgut-Mengen berechnen

### 🤖 **Perfect Green Mähroboter**
- Automatische Dünge-Erinnerungen nach Kalender
- Mähroboter-Laufzeit Empfehlungen (1-7 Tage/Woche)
- Klingenwechsel-Tracker (1-2x monatlich)
- ProNatura Frühjahr/Herbst Düngeplan
- Temperatur-abhängige Empfehlungen (ab 10°C)

### 🌤️ **Intelligente Wetterintegration**
- Echtzeit-Wetter für Kulmbach, Bayern
- 3-Tage Wettervorhersage
- Wetterbasierte Garten-Empfehlungen
- Bewässerungs-Empfehlungen bei Hitze

## 🚀 Installation & Start

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Lokale Installation
```bash
# Repository klonen
git clone https://github.com/IhrUsername/mein-garten.git
cd mein-garten

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App läuft dann unter `http://localhost:3000`

### Produktions-Build
```bash
npm run build
npm start
```

## 📱 PWA Installation (iPhone/Android)

1. **App im Browser öffnen** (Safari/Chrome)
2. **iPhone**: Safari → Teilen → "Zum Home-Bildschirm"
3. **Android**: Chrome → Menü → "App installieren"

## 🛠️ Technologie

- **Framework**: Next.js 14 mit TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: OpenWeatherMap
- **Storage**: Browser LocalStorage
- **PWA**: Offline-fähig, installierbar

## 📊 Datenstruktur

### Garten-Einträge
- Düngungen (Typ, Menge, Fläche, Notizen)
- Aussaaten (Sorte, Saatmenge, Fläche)
- Mähroboter-Aktivitäten
- Bewässerung und Pflege

### Perfect Green Integration
- Monatlicher Pflegekalender
- ProNatura Düngeplan
- Mähroboter Laufzeiten
- Klingen-Wechselintervalle

## 🌱 Perfect Green Rasenpflege-Plan

| Monat | Düngen | Mähen | Laufzeit | Klingenwechsel |
|-------|--------|-------|----------|----------------|
| März  | ✅ 40g/m² | ✅ | 1-2 Tage | 1x |
| April | ✅ 35g/m² | ✅ | 3-4 Tage | 2x |
| Mai   | ✅ 30g/m² | ✅ | 5-7 Tage | 2x |
| Juni  | ✅ 40g/m² | ✅ | 2-3 Tage | 2x |
| Juli  | ✅ 30g/m² | ✅ | 2-3 Tage | 1x |
| Sep   | ✅ 40g/m² | ✅ | 5-7 Tage | 2x |
| Okt   | ✅ 40g/m² | ✅ | 3-5 Tage | 2x |
| Nov   | ✅ 20g/m² | ✅ | 2-3 Tage | 1x |

## 📍 Standort

Standard-Standort: **Kulmbach, Bayern**
- Koordinaten: 50.1047°N, 11.3563°E
- Zeitzone: MEZ/MESZ

## 🔧 Konfiguration

### Umgebungsvariablen (.env.local)
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key
NEXT_PUBLIC_LOCATION_LAT=50.1047
NEXT_PUBLIC_LOCATION_LON=11.3563
```

## 🎨 Design

- **Farbschema**: Grün-basiert (#16a34a primary, #22c55e secondary)
- **Responsive**: Mobile-first Design
- **Touch-optimiert**: Große Buttons für mobile Nutzung
- **Deutsche Lokalisierung**: Komplett auf Deutsch

## 📝 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📞 Support

Bei Fragen oder Problemen, öffnen Sie bitte ein [Issue](https://github.com/IhrUsername/mein-garten/issues).

---

**Entwickelt mit ❤️ für die perfekte Rasenpflege mit dem Perfect Green Mähroboter System**