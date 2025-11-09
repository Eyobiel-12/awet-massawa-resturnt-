# 💾 Data Opslag - Reserveringen

## Probleem Opgelost ✅

**Voorheen**: Reserveringen werden opgeslagen in-memory en gingen verloren bij:
- Server restart
- Page refresh (in sommige gevallen)
- Deployment updates

**Nu**: Reserveringen worden opgeslagen in een JSON bestand (`data/reservations.json`) en blijven behouden!

## Hoe het werkt

1. **Data Directory**: Alle reserveringen worden opgeslagen in `/data/reservations.json`
2. **Automatisch Aanmaken**: De directory en file worden automatisch aangemaakt als ze niet bestaan
3. **Persistent**: Data blijft behouden tussen server restarts
4. **Git Ignored**: Het data bestand staat in `.gitignore` (wordt niet gecommit)

## Bestandsstructuur

```
massawa-restaurant/
├── data/
│   └── reservations.json  ← Hier worden reserveringen opgeslagen
├── lib/
│   └── reservations-storage.ts  ← Storage functies
└── app/
    └── api/
        └── reservations/
            └── route.ts  ← API endpoints
```

## API Endpoints

### GET `/api/reservations`
Haalt alle reserveringen op (met optionele filters)

**Query Parameters**:
- `status` - Filter op status (pending, confirmed, cancelled)
- `date` - Filter op specifieke datum
- `search` - Zoek in naam, email, telefoon, bericht

### POST `/api/reservations`
Maakt een nieuwe reservering aan

**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+31 6 12345678",
  "date": "2024-12-25",
  "time": "19:00",
  "guests": "4",
  "message": "Window seat please"
}
```

### PATCH `/api/reservations`
Update de status van een reservering

**Body**:
```json
{
  "id": "res_1234567890_abc123",
  "status": "confirmed"
}
```

### DELETE `/api/reservations?id=res_1234567890_abc123`
Verwijdert een reservering

## Data Format

```json
[
  {
    "id": "res_1234567890_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+31 6 12345678",
    "date": "2024-12-25",
    "time": "19:00",
    "guests": "4",
    "message": "Window seat please",
    "status": "pending",
    "createdAt": "2024-12-20T10:30:00.000Z"
  }
]
```

## Backup & Migratie

### Backup maken:
```bash
cp data/reservations.json data/reservations.backup.json
```

### Data herstellen:
```bash
cp data/reservations.backup.json data/reservations.json
```

## Voor Productie

⚠️ **Belangrijk**: Voor productie, overweeg een echte database:

### Opties:
1. **Supabase** (PostgreSQL) - Gratis tier beschikbaar
2. **MongoDB Atlas** - Gratis tier beschikbaar
3. **Vercel Postgres** - Als je op Vercel host
4. **PlanetScale** - MySQL, gratis tier

### Migratie naar Database:
1. Installeer database client library
2. Update `lib/reservations-storage.ts` om database te gebruiken
3. Migreer bestaande data uit `reservations.json`

## Troubleshooting

### Data verdwijnt nog steeds?
- Check of `data/reservations.json` bestaat
- Check file permissions (moet schrijfbaar zijn)
- Check server logs voor errors

### File niet aangemaakt?
- Check of de server schrijfrechten heeft
- Check console voor errors
- Maak handmatig `data/` directory aan

### Data corrupt?
- Check `reservations.json` format (moet geldig JSON zijn)
- Maak backup en reset file
- Check server logs

## Testen

1. Maak een reservering via het formulier
2. Check `data/reservations.json` - zou de reservering moeten bevatten
3. Restart de server
4. Check admin dashboard - reservering zou nog steeds zichtbaar moeten zijn!

