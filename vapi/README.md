# Massawa Vapi Assistant Setup

Complete configuratie voor de Vapi voice assistant voor Massawa reserveringen.

## 📋 Setup Instructies

### 1. Importeer de Configuratie

1. Ga naar je Vapi dashboard → **Assistants** → **massawa**
2. Klik op **Assistant Configuration** → **JSON Format**
3. Kopieer de inhoud van `assistant-config.json`
4. Plak het in Vapi's JSON editor
5. Klik **Save**

### 2. Configureer de Custom Function

De `submitReservation` function is al geconfigureerd in de JSON, maar controleer:

- **Server URL**: `https://www.massawa-habesha.nl/api/retell-webhook`
- **Server URL Secret**: `key_f69285ccb6bd6226aa2ce5c68302`

**Let op:** Je moet de Server URL Secret ook handmatig instellen in Vapi:
1. Ga naar **Tools** → **Custom Functions**
2. Klik op `submitReservation`
3. Zet **Server URL Secret** op: `key_f69285ccb6bd6226aa2ce5c68302`

### 3. Voice Configuratie

De huidige voice is "Elliot" (Engels). Voor Nederlands:

1. Ga naar **VOICE** sectie
2. Kies een Nederlandse voice (bijv. "Nina" of "Liam" met language: nl-NL)
3. Of gebruik een custom voice met Nederlandse accent

### 4. Test de Assistant

1. Klik op **Test** in Vapi dashboard
2. Bel het testnummer of gebruik de widget
3. Test de volledige flow:
   - Name → Email → Phone → Party Size → Date → Time → Special Requests
   - Controleer of de webhook wordt aangeroepen
   - Verifieer dat de reservering in Supabase verschijnt

## 🔧 Belangrijke Instellingen

### System Prompt
De complete prompt staat in `model.messages[0].content`. Deze bevat:
- Warme, gastvrije tone
- Nederlandse-first, Engels fallback
- Alle business rules (openingstijden, max 10 personen, etc.)
- Fallback logica

### Custom Function Parameters
De `submitReservation` function verwacht:
- `name` (string, required)
- `email` (string, required)
- `phone` (string, required)
- `party_size` (integer, 1-10, required)
- `date` (string, YYYY-MM-DD, required)
- `time` (string, HH:MM, required)
- `special_requests` (string, optional)
- `language` (string, optional, default: nl-NL)

### Webhook Response
De webhook retourneert:
```json
{
  "status": "confirmed" | "full" | "closed" | "past_date" | "outside_hours" | "requires_handoff",
  "message": "Reservering bevestigd voor...",
  "reservation_id": "uuid",
  "dining_window_minutes": 90
}
```

De assistant moet reageren op `status`:
- `confirmed` → Bedank de gast en bevestig email
- Andere status → Lees `message` en bied alternatieven

## 📞 Phone Number Setup

1. Ga naar **PAYG** → **Phone Numbers**
2. Koop of koppel een Nederlands nummer
3. Wijs de "massawa" assistant toe aan het nummer

## 🧪 Testing

Test cases staan in `../retell/test-cases.md` - deze zijn ook bruikbaar voor Vapi.

## 🔄 Verschillen met Retell

- **Vapi gebruikt functions** in plaats van nodes
- **Structured outputs** voor data extraction
- **Analysis** voor call summaries
- **Geen visuele flow builder** - alles via JSON/config

## 🐛 Troubleshooting

### Function wordt niet aangeroepen
- Check of alle required fields zijn verzameld
- Check Server URL Secret in Vapi dashboard
- Check webhook logs in Vercel

### 400 Error van webhook
- Check of datum/tijd geldig zijn (niet maandag, niet verleden, 17:00-21:30)
- Check of party_size tussen 1-10 is
- Check webhook logs voor exacte error

### Geen Nederlandse voice
- Wijzig voice configuratie naar Nederlandse voice
- Of gebruik custom voice met language: nl-NL

## 📝 Notes

- Dezelfde webhook (`/api/retell-webhook`) wordt gebruikt voor zowel Retell als Vapi
- De webhook accepteert beide formaten
- Alle reserveringen komen in Supabase met `source: "retell"` of `source: "vapi"`






