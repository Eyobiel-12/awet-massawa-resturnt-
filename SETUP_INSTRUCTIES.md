# Bevestigingssysteem Setup - Stap voor Stap

## Stap 1: EmailJS Templates Configureren

### A. Update bestaande Restaurant Notificatie Template

1. Ga naar [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Ga naar "Email Templates"
3. Zoek en selecteer template `template_wyyw00j` (de huidige notificatie template)
4. Klik op "Edit"

5. Kopieer de HTML uit het bestand `public/confirm_reservation_template.html`
6. **Belangrijk**: Vervang `http://localhost:3000` met je productie domein:
   - Bijvoorbeeld: `https://massawa-restaurant.nl`
   - Of: `https://www.massawa-restaurant.nl`

7. Paste de HTML in de template editor
8. Configureer de variabelen:
   - `{{from_name}}` - van: Custom Field
   - `{{from_email}}` - van: Custom Field  
   - `{{phone}}` - van: Custom Field
   - `{{date}}` - van: Custom Field
   - `{{time}}` - van: Custom Field
   - `{{guests}}` - van: Custom Field
   - `{{message}}` - van: Custom Field

9. Sla op

### B. Maak nieuwe Klant Bevestiging Template

1. Klik op "Create New Template"
2. Geef het de naam: "Klant Bevestiging Reservering"
3. Template ID: `template_customer_confirmation`
4. Kopieer de HTML uit `public/customer_confirmation_template.html`
5. Paste in de template editor

6. Configureer de variabelen:
   - `{{to_name}}` - naar: Custom Field
   - `{{to_email}}` - naar: Custom Field
   - `{{reservation_date}}` - Custom Field
   - `{{reservation_time}}` - Custom Field
   - `{{reservation_guests}}` - Custom Field
   - `{{reservation_message}}` - Custom Field
   - `{{restaurant_name}}` - Custom Field
   - `{{restaurant_address}}` - Custom Field
   - `{{restaurant_phone}}` - Custom Field
   - `{{restaurant_email}}` - Custom Field

7. **Onderwerp regel**: "Uw reservering bij Massawa Restaurant is bevestigd"
8. Sla op

## Stap 2: API Route Configuratie

Het systeem is al geconfigureerd met:
- **Service ID**: `service_t722xgi`
- **Public Key**: `2ZQ3WgKUpnfTZho4p`

Deze zijn al in gebruik in `components/reservation.tsx`, dus geen wijzigingen nodig.

## Stap 3: Testen

### Lokaal testen:

1. Start de development server:
```bash
npm run dev
```

2. Maak een test reservering via: `http://localhost:3000/reservations`

3. Controleer je EmailJS logs of email inbox voor de notificatie email

4. Klik op de "✅ Bevestig Reservering" knop in de email

5. Je wordt doorgestuurd naar een bevestigingspagina

6. De klant zou nu een bevestigingsmail moeten ontvangen

### Productie:

1. Vervang `localhost:3000` in de EmailJS template met je productie domein
2. Deploy je code naar productie
3. Test opnieuw

## Stap 4: Email Flow Diagram

```
Klant Website → Reservering Formulier
        ↓
EmailJS verstuurt notificatie naar restaurant
        ↓
Restaurant ontvangt email met groene "Bevestig" knop
        ↓
Restaurant klikt op knop → /confirm pagina
        ↓
API route verzendt bevestiging naar klant
        ↓
Klant ontvangt prachtige bevestigingsmail ✨
```

## Stap 5: Troubleshooting

### Email wordt niet verstuurd

- Check EmailJS logs in het dashboard
- Check browser console voor errors
- Controleer of alle template variabelen correct zijn geconfigureerd

### Bevestigingsknop werkt niet

- Controleer of de URL correct is (geen `localhost` in productie!)
- Check de API route logs
- Test de API route handmatig via browser

### Klant ontvangt geen bevestiging

- Check EmailJS logs
- Controleer of alle parameters correct worden doorgegeven
- Test met een simpel test email adres

## Optionele Verbeteringen

### 1. SSL/HTTPS
Zorg ervoor dat je website SSL heeft in productie (HTTPS)

### 2. Email Templates Aanpassen
Je kunt de HTML templates aanpassen in:
- `public/confirm_reservation_template.html`
- `public/customer_confirmation_template.html`

### 3. Meerdere Talen
Je kunt verschillende email templates maken voor verschillende talen

### 4. Database Integratie
Voeg database opslag toe om reserveringen op te slaan en te tracken:
- Gebruik een API zoals Supabase, Firebase, of een backend server

## Support

Voor vragen of problemen, check:
- EmailJS documentatie: https://docs.emailjs.com/
- Next.js documentatie: https://nextjs.org/docs

