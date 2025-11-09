# 🔐 Admin Dashboard Setup

## Wachtwoord Beveiliging

Het admin dashboard is nu beveiligd met een wachtwoord.

### Standaard Wachtwoord
**Standaard wachtwoord**: `massawa2024`

### Wachtwoord Wijzigen

#### Optie 1: Environment Variable (Aanbevolen voor Productie)

1. Maak een `.env.local` bestand in de root:
```bash
NEXT_PUBLIC_ADMIN_PASSWORD=jouw_sterk_wachtwoord_hier
```

2. Update `app/admin/login/page.tsx` regel 15:
```typescript
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "massawa2024"
```

#### Optie 2: Direct in Code (Alleen Development)

Update `app/admin/login/page.tsx` regel 15:
```typescript
const ADMIN_PASSWORD = "jouw_nieuwe_wachtwoord"
```

## Toegang tot Admin Dashboard

1. Ga naar: `http://localhost:3000/admin`
2. Je wordt automatisch doorgestuurd naar `/admin/login`
3. Voer het wachtwoord in
4. Je blijft ingelogd voor 24 uur (session)

## Features

### ✅ Wachtwoord Beveiliging
- Login pagina met wachtwoord verificatie
- Session management (24 uur geldig)
- Automatische logout na 24 uur
- Uitlog knop beschikbaar

### ✅ Enhanced UI/UX
- Modern gradient design
- Responsive voor alle schermen (mobile, tablet, desktop)
- Smooth animations en hover effects
- Clean, professionele layout
- Enhanced stat cards met hover effects
- Better color coding en badges

### ✅ Functionaliteit
- Automatische email verzending bij bevestigen
- Zoeken en filteren
- Cards en tabel weergave
- CSV export
- Auto-refresh elke 30 seconden

## Security Tips

1. **Voor Productie**: Gebruik ALTIJD een environment variable voor het wachtwoord
2. **Sterk Wachtwoord**: Gebruik een sterk, uniek wachtwoord
3. **HTTPS**: Zorg dat je site HTTPS gebruikt in productie
4. **Session Timeout**: Huidige timeout is 24 uur - pas aan indien nodig

## Mobile Responsive

Het dashboard is volledig responsive:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## Design Verbeteringen

- Gradient backgrounds
- Backdrop blur effects
- Smooth transitions
- Hover animations
- Enhanced shadows
- Better spacing en typography
- Color-coded status badges
- Modern card designs

