# 🌱 Mein Garten - Rasenpflege Manager

Eine **native iOS/Android-style** Web-App für professionelle Rasenpflege mit Perfect Green Mähroboter-Integration.

## ✨ Modern Native UI Design

![Native UI Design](https://via.placeholder.com/800x400/22c55e/ffffff?text=Moderne+Native+UI)

### 🎨 Design Highlights
- **Glassmorphism Effects** - iOS 15+ inspired backdrop blur
- **Native Bottom Tab Bar** - Smooth transitions & active states  
- **Smooth Animations** - 60fps fade, slide & scale effects
- **Touch Optimized** - Active states mit native press feedback
- **Gradient Background** - Subtle green-emerald-teal verlauf
- **Modern Components** - Rounded corners, soft shadows, blur effects

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

- **Framework**: Next.js 15 mit TypeScript
- **Styling**: Tailwind CSS 3.4 mit Custom Design System
- **UI Pattern**: Native iOS/Android-inspired Components
- **Design**: Glassmorphism, Backdrop Blur, Smooth Animations
- **Icons**: Lucide React
- **API**: OpenWeatherMap
- **Storage**: Browser LocalStorage
- **PWA**: next-pwa mit Workbox - Offline-fähig, installierbar

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

### Umgebungsvariablen

⚠️ **Wichtig**: Niemals API-Keys in Git committen!

1. Kopieren Sie `.env.example` nach `.env.local`:
```bash
cp .env.example .env.local
```

2. Tragen Sie Ihren API-Key ein:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
NEXT_PUBLIC_LOCATION_LAT=49.5181
NEXT_PUBLIC_LOCATION_LON=11.5167
```

3. Kostenlosen API-Key erhalten:
   - Registrieren Sie sich auf [OpenWeatherMap](https://openweathermap.org/api)
   - Wählen Sie den "Free Plan" (60 calls/minute)
   - Kopieren Sie Ihren API-Key in `.env.local`

## 🎨 Design

### Native UI Components
- **Cards**: Glassmorphism mit backdrop blur (default, glass, elevated variants)
- **Buttons**: 6 Variants mit loading states und icons
- **Inputs**: Modern rounded-xl mit focus rings
- **Navigation**: iOS-style Bottom Tab Bar mit blur
- **Animations**: Smooth fade, slide, scale transitions

### Design System
- **Farbpalette**: Green-based (Primary 50-900) mit Teal & Amber accents
- **Shadows**: Soft, medium, strong elevations
- **Border Radius**: 1rem, 1.5rem, 2rem (xl, 2xl, 3xl)
- **Typography**: System fonts (-apple-system, Roboto, Segoe UI)
- **Spacing**: Safe area insets für iOS/Android Notch

### Mobile-First
- **Responsive**: Native mobile patterns
- **Touch-optimiert**: 44x44px min tap targets
- **Safe Areas**: iPhone Notch/Home Indicator Support
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