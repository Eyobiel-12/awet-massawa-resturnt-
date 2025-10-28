# Test Instructies - Bevestigingssysteem

## Stap 1: Start Development Server

```bash
npm run dev
```

## Stap 2: Test de Reservering Flow

1. **Ga naar**: http://localhost:3000/reservations
2. **Vul het formulier in**:
   - Naam: Test Klant
   - Email: je eigen email (om te testen)
   - Telefoon: 0612345678
   - Datum: een toekomstige datum
   - Tijd: tussen 17:00 - 22:00
   - Aantal gasten: 2
   - Bericht: Test reservering
3. **Klik op "Confirm Reservation"**

## Stap 3: Controleer Email Inbox

Je zou twee emails moeten ontvangen:
1. **Notificatie email naar het restaurant** (massawarestaurant@gmail.com)
2. **Bevestigingsemail naar de klant** (jouw test email)

In de notificatie email zit een groene knop "✅ Bevestig Reservering"

## Stap 4: Test de Bevestigingsknop

1. **Klik op de groene knop** in de notificatie email
2. Je wordt doorgestuurd naar een bevestigingspagina
3. De pagina toont "✅ Succesvol!" als het werkt
4. Je ontvangt nu de bevestigingsemail op je test email adres

## Stap 5: Als er Errors zijn

### Check Terminal Logs

Kijk in de terminal waar `npm run dev` draait voor:
- "Email verzonden succesvol:" → het werkt!
- "EmailJS API error:" → er is een probleem

### Common Errors

**Error: "Invalid template ID"**
- Template `template_99b3wut` bestaat niet in EmailJS dashboard
- Maak deze aan in EmailJS

**Error: "Missing to_email"**
- Template moet `{{to_email}}` variable hebben
- Configureer deze in EmailJS dashboard

**Error: "Limit exceeded"**
- EmailJS free plan limiet bereikt
- Upgrade je plan of wacht tot volgende maand

## Debugging

Als het niet werkt, test de API route direct:

```bash
curl "http://localhost:3000/api/confirm-reservation?name=Test&email=JE_EMAIL@test.nl&date=2025-10-31&time=20:00&guests=2&message=Test"
```

Check wat de response is in je terminal.

