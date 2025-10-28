# Bevestigingssysteem voor Reserveringen

## Overzicht
Dit systeem stuurt automatisch een bevestigingsmail naar klanten wanneer een reservering wordt goedgekeurd vanuit de notificatie-email.

## Setup Instructies

### 1. EmailJS Templates Aanmaken

Je moet twee nieuwe EmailJS templates aanmaken in je EmailJS dashboard:

#### Template 1: Restaurant Notificatie (Update bestaande template)
- **Template ID**: `template_wyyw00j` (bestaande)
- Gebruik het HTML bestand: `public/confirm_reservation_template.html`
- **Belangrijk**: Vervang `YOUR_DOMAIN.nl` in regel 85 met je eigen domein

#### Template 2: Klant Bevestiging (NIEUW)
- **Template ID**: `template_customer_confirmation`
- Gebruik het HTML bestand: `public/customer_confirmation_template.html`
- Template variabelen:
  - `{{to_name}}` - Klant naam
  - `{{to_email}}` - Klant email
  - `{{reservation_date}}` - Reservering datum
  - `{{reservation_time}}` - Reservering tijd
  - `{{reservation_guests}}` - Aantal gasten
  - `{{reservation_message}}` - Speciale verzoeken

### 2. Bestaande Template Updaten

In je EmailJS dashboard, update de template `template_wyyw00j` met:
- Kopieer de inhoud van `public/confirm_reservation_template.html`
- Vervang `YOUR_DOMAIN.nl` met je echte domein (bijvoorbeeld `massawa-restaurant.nl`)
- Dit zorgt ervoor dat de bevestigingsknop correct werkt

### 3. Hoe het werkt

1. Klant maakt een reservering via de website
2. Jij ontvangt een notificatie-email met alle details
3. In de email staat een groene knop "✅ Bevestig Reservering"
4. Wanneer je op de knop klikt:
   - Je wordt doorgestuurd naar `/confirm?name=...&email=...`
   - Deze pagina stuurt automatisch een bevestigingsmail naar de klant
   - Je ziet een succes/fout melding

### 4. API Route

De API route is beschikbaar op: `/api/confirm-reservation`

**Parameters** (GET):
- `name` - Klant naam
- `email` - Klant email
- `date` - Reservering datum
- `time` - Reservering tijd
- `guests` - Aantal gasten
- `message` - Speciale verzoeken (optioneel)

### 5. Security Notities

- De API route gebruikt GET requests (niet ideaal voor productie)
- Overweeg om POST requests te gebruiken voor betere security
- Je kunt eventueel authenticatie toevoegen om te voorkomen dat iedereen emails kan versturen

## Bestanden Overzicht

- `app/api/confirm-reservation/route.ts` - API route voor het versturen van bevestigingsmails
- `app/confirm/page.tsx` - Bevestigings pagina met UI
- `public/confirm_reservation_template.html` - Restaurant notificatie email template
- `public/customer_confirmation_template.html` - Klant bevestiging email template

## Testing

1. Start je development server: `npm run dev`
2. Maak een test reservering via de website
3. Controleer je email inbox voor de notificatie
4. Klik op de bevestigingsknop in de email
5. Controleer of de klant een bevestigingsmail ontvangt

## Productie Deployment

Vergeet niet om `YOUR_DOMAIN.nl` te vervangen met je echte domein in:
- `public/confirm_reservation_template.html` (regel 85)

## Vervolg Verbeteringen

- Voeg een annuleringsoptie toe
- Voeg authenticatie toe aan de API route
- Maak een admin panel om reserveringen te beheren
- Voeg email templates toe voor verschillende talen
- Implementeer database opslag voor reserveringen

