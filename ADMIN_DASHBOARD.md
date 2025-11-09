# 🎯 Admin Dashboard - Reserveringen Beheer

## ✅ Wat is er gemaakt:

### 1. **API Route** (`app/api/reservations/route.ts`)
- **GET**: Haal alle reserveringen op (met filters)
- **POST**: Nieuwe reservering opslaan
- **PATCH**: Status updaten (pending/confirmed/cancelled)
- **DELETE**: Reservering verwijderen

### 2. **Admin Dashboard** (`app/admin/page.tsx`)
Modern dashboard met:
- 📊 **Statistieken**: Totaal, In behandeling, Bevestigd, Vandaag
- 🔍 **Zoeken**: Op naam, email, telefoon
- 🎛️ **Filters**: Status en datum filters
- 📋 **Reserveringen Cards**: Mooie cards met alle details
- ✅ **Status Management**: Bevestigen/annuleren met één klik
- 🗑️ **Verwijderen**: Reserveringen verwijderen
- 🔄 **Auto-refresh**: Elke 30 seconden automatisch vernieuwen

### 3. **Reservation Component Update**
- Reserveringen worden nu automatisch opgeslagen in de database
- Email wordt nog steeds verstuurd via EmailJS

## 🚀 Hoe te gebruiken:

### Stap 1: Ga naar Admin Dashboard

```
http://localhost:3000/admin
```

Of in productie:
```
https://www.massawa-habesha.nl/admin
```

### Stap 2: Bekijk Reserveringen

Alle binnenkomende reserveringen worden automatisch getoond:
- Nieuwste eerst
- Met status badges
- Met alle details (naam, email, telefoon, datum, tijd, gasten, bericht)

### Stap 3: Beheer Reserveringen

**Bevestigen:**
- Klik op "Bevestigen" knop
- Status wordt geupdate naar "Bevestigd"
- Groene badge verschijnt

**Annuleren:**
- Klik op "Annuleren" knop
- Status wordt geupdate naar "Geannuleerd"
- Rode badge verschijnt

**Verwijderen:**
- Klik op prullenbak icoon (rechtsboven)
- Bevestig verwijdering
- Reservering wordt permanent verwijderd

### Stap 4: Filters gebruiken

**Zoeken:**
- Type in zoekbalk: naam, email, of telefoonnummer
- Resultaten filteren automatisch

**Status Filter:**
- Selecteer: Alle, In behandeling, Bevestigd, Geannuleerd
- Alleen reserveringen met die status worden getoond

**Datum Filter:**
- Selecteer een specifieke datum
- Alleen reserveringen voor die datum worden getoond

## 📊 Features:

### Statistieken Dashboard
- **Totaal**: Alle reserveringen
- **In Behandeling**: Pending reserveringen
- **Bevestigd**: Confirmed reserveringen
- **Vandaag**: Reserveringen voor vandaag

### Smart Cards
- **Kleur coding**: 
  - Groen = Bevestigd
  - Amber = In behandeling
  - Rood = Geannuleerd
  - Grijs = Verlopen
- **Hover effects**: Cards liften bij hover
- **Icons**: Duidelijke iconen voor elke info

### Auto-refresh
- Dashboard vernieuwt automatisch elke 30 seconden
- Nieuwe reserveringen verschijnen automatisch
- Handmatig vernieuwen met "Vernieuwen" knop

## ⚠️ Belangrijk voor Productie:

### Database Setup

**Huidige setup**: In-memory storage (verliest data bij server restart)

**Voor productie, gebruik een echte database:**

#### Optie 1: Supabase (Aanbevolen)
```typescript
// Install: npm install @supabase/supabase-js
// Update app/api/reservations/route.ts
```

#### Optie 2: MongoDB
```typescript
// Install: npm install mongodb
// Update app/api/reservations/route.ts
```

#### Optie 3: Vercel Postgres
```typescript
// Gebruik Vercel Postgres
// Update app/api/reservations/route.ts
```

### Security

**BELANGRIJK**: Voeg authenticatie toe voor productie!

```typescript
// In app/admin/page.tsx, voeg toe:
// - Login systeem
// - Password protection
// - Session management
```

## 🎨 Design Features:

- ✅ Modern gradient backgrounds
- ✅ Smooth animations
- ✅ Responsive design (mobile + desktop)
- ✅ Color-coded status badges
- ✅ Hover effects
- ✅ Professional layout
- ✅ Easy to use interface

## 📱 Mobile Friendly:

Het dashboard werkt perfect op:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop
- 🖥️ Large screens

## 🔄 Workflow:

1. **Klant maakt reservering** → Wordt opgeslagen in database
2. **Email wordt verstuurd** → Restaurant ontvangt notificatie
3. **Admin bekijkt dashboard** → Ziet alle reserveringen
4. **Admin bevestigt** → Status wordt geupdate
5. **Klant ontvangt bevestiging** → Via email

## 🎉 Klaar!

Je hebt nu een volledig werkend admin dashboard!

Test het op: `http://localhost:3000/admin`

