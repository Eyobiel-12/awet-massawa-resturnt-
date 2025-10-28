# Quick Fix voor EmailJS Template

## Wat moet je doen in EmailJS Dashboard:

1. **Ga naar EmailJS**: https://dashboard.emailjs.com/
2. **Email Templates** → Selecteer template ID: `template_99b3wut`
3. **Pas deze HTML toe**: kopieer de hele inhoud van `public/customer_confirmation_template.html`
4. **Configureer deze variabelen**:

### Template Parameters in EmailJS:
```
{{to_name}}          → type: Custom Field (naam)
{{to_email}}         → type: To Email (dit is het email adres van de klant!)
{{reservation_date}} → type: Custom Field (datum)
{{reservation_time}} → type: Custom Field (tijd)
{{reservation_guests}} → type: Custom Field (aantal gasten)
{{reservation_message}} → type: Custom Field (bericht)
{{restaurant_name}} → type: Custom Field (restaurant naam)
{{restaurant_address}} → type: Custom Field (restaurant adres)
{{restaurant_phone}} → type: Custom Field (telefoon)
{{restaurant_email}} → type: Custom Field (email)
```

## Test direct:

Na de update, probeer opnieuw:
1. Maak een test reservering
2. Klik op de bevestigingsknop in de email
3. Check of het werkt!

## Als het nog steeds niet werkt:

Check de console (terminal waar npm run dev draait) voor de exacte error.

