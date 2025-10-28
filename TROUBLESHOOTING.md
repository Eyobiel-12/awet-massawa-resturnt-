# Troubleshooting: "Kon bevestigingsmail niet versturen"

## Probleem
Je ziet de error: "Fout opgetreden - Kon bevestigingsmail niet versturen"

## Oplossingen

### 1. Controleer EmailJS Template ID
✅ **Done**: Template ID is geupdate naar `template_99b3wut`

### 2. Controleer of Template bestaat in EmailJS Dashboard
1. Ga naar https://dashboard.emailjs.com/
2. Klik op "Email Templates"
3. Zoek template met ID: `template_99b3wut`
4. Zorg ervoor dat deze exists en correct geconfigureerd is

### 3. Controleer Template Variabelen
In je EmailJS dashboard, zorg dat je template deze variabelen heeft:
- `{{to_name}}`
- `{{to_email}}` (naar email field)
- `{{reservation_date}}`
- `{{reservation_time}}`
- `{{reservation_guests}}`
- `{{reservation_message}}`
- `{{restaurant_name}}`
- `{{restaurant_address}}`
- `{{restaurant_phone}}`
- `{{restaurant_email}}`

### 4. Check Development Server Console
De error details staan nu in je terminal/server logs. Check:
```bash
# In je terminal waar `npm run dev` draait, zoek naar:
# "EmailJS API error: ..."
# of
# "Error confirming reservation: ..."
```

### 5. Test API Route Handmatig
Test de API route direct via een browser of terminal:

```bash
curl "http://localhost:3000/api/confirm-reservation?name=Test&email=test@test.nl&date=2025-10-31&time=20:00&guests=2&message=Test%20message"
```

Of via browser:
```
http://localhost:3000/api/confirm-reservation?name=Test%20User&email=test@test.nl&date=2025-10-31&time=20:00&guests=2
```

### 6. Herstart Development Server
Soms moet je de server herstarten:
```bash
# Stop de server (Ctrl+C)
# Start opnieuw
npm run dev
```

### 7. Check EmailJS Free Plan Limits
EmailJS heeft limieten op de free plan:
- 200 emails per maand
- Mogelijk zijn je limieten bereikt

Check: https://www.emailjs.com/pricing/

### 8. Check EmailJS Service Configuration
Controleer in EmailJS dashboard:
1. Ga naar "Email Services"
2. Klik op service "service_t722xgi"
3. Controleer dat deze actief is
4. Check de email provider configuratie (Gmail, etc.)

### 9. Common EmailJS Errors

#### Error: "Limit exceeded"
- Je hebt je maandelijkse limiet bereikt
- Upgrade plan of wacht tot volgende maand

#### Error: "Invalid template ID"
- Template bestaat niet
- Check dat template ID correct is: `template_99b3wut`

#### Error: "Invalid service ID"
- Service niet geconfigureerd
- Check service ID: `service_t722xgi`

#### Error: "Invalid public key"
- Public key incorrect
- Check: `2ZQ3WgKUpnfTZho4p`

## Debugging Stappen

1. **Check console voor exacte error**
   - In terminal waar `npm run dev` draait
   - Of in browser console (F12)

2. **Check EmailJS Dashboard**
   - Ga naar "Email Logs"
   - Kijk of er email pogingen zijn
   - Check de error details

3. **Test met simpel email**
   - Gebruik een bekende email address voor testen
   - Bijvoorbeeld je eigen email

4. **Check Network Tab**
   - Open browser DevTools (F12)
   - Ga naar Network tab
   - Klik op de bevestigingsknop
   - Check de API request en response

## Als alles faalt
Als het nog steeds niet werkt, maak dan een screenshot van:
1. De error in je terminal
2. De Network tab response
3. Je EmailJS dashboard

En deel deze voor verdere debugging.

