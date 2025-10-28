# Finale Setup Instructies

## ✅ Wat is Klaar:

1. **API Route**: `/api/confirm-reservation` - Verstuurt bevestigingsmails
2. **Bevestigingspagina**: `/confirm` - Toont status en stuurt email
3. **Email Templates**: HTML templates voor notificatie en bevestiging
4. **Template ID**: `template_99b3wut` is nu geconfigureerd

## 🔧 Wat je moet doen in EmailJS:

### Stap 1: Maak Template aan in EmailJS

1. Ga naar: https://dashboard.emailjs.com/
2. Email Templates → Create New Template
3. Naam: "Klant Bevestiging Reservering"
4. **Template ID**: `template_99b3wut` (BELANGRIJK!)
5. Kopieer de hele HTML uit: `public/customer_confirmation_template.html`

### Stap 2: Configureer Template Variabelen

In EmailJS template editor, configureer deze variabelen:

```
{{to_name}}          → Custom Field (naam van klant)
{{to_email}}         → TO EMAIL FIELD (BELANGRIJK! Dit is het email adres waar de mail naartoe gaat)
{{reservation_date}} → Custom Field
{{reservation_time}} → Custom Field
{{reservation_guests}} → Custom Field
{{reservation_message}} → Custom Field
{{restaurant_name}} → Custom Field
{{restaurant_address}} → Custom Field
{{restaurant_phone}} → Custom Field
{{restaurant_email}} → Custom Field
```

**BELANGRIJK**: 
- `{{to_email}}` moet ingesteld worden als "To Email" field in EmailJS
- Dit is NIET een custom field, maar het speciale email adres field!

### Stap 3: Check Service Configuratie

Ga naar: Email Services → service_t722xgi
- Check dat deze service actief is
- Check dat je email provider (Gmail, etc.) correct is geconfigureerd

### Stap 4: Update Restaurant Notificatie Template

1. Ga naar template: `template_wyyw00j` (de huidige notificatie template)
2. Update de HTML met inhoud uit: `public/confirm_reservation_template.html`
3. **Belangrijk**: Vervang de URL in regel 93:
   - Development: `http://localhost:3000/confirm?...`
   - Productie: `https://JOUW_DOMEIN.nl/confirm?...`

## 🚀 Test Nu:

1. Start server: `npm run dev`
2. Maak een test reservering
3. Check je email inbox voor notificatie
4. Klik op de groene "Bevestig Reservering" knop
5. Je zou nu een bevestigingsmail moeten ontvangen!

## 📧 Email Flow:

```
Klant → Reservering Formulier
  ↓
EmailJS stuurt notificatie naar: massawarestaurant@gmail.com
  ↓
Restaurant email bevat groene knop met link naar /confirm
  ↓
Klik op knop → API route stuurt bevestiging naar klant
  ↓
Klant ontvangt mooie bevestigingsemail ✨
```

## 🐛 Als het niet werkt:

1. **Check Terminal**: Kijk naar de exacte error in je `npm run dev` terminal
2. **Check EmailJS Logs**: Ga naar EmailJS dashboard → Email Logs
3. **Test API direct**: 
   ```bash
   curl "http://localhost:3000/api/confirm-reservation?name=Test&email=TEST@TEST.NL&date=2025-10-31&time=20:00&guests=2"
   ```

## 📝 Belangrijke Notities:

- **Template ID**: Moet exact zijn `template_99b3wut`
- **To Email Field**: `{{to_email}}` moet als "To Email" worden ingesteld
- **Development URL**: `http://localhost:3000`
- **Productie URL**: Vervang met je echte domein

## ✅ Checklist:

- [ ] Template `template_99b3wut` bestaat in EmailJS
- [ ] HTML uit `customer_confirmation_template.html` is geplakt
- [ ] `{{to_email}}` is ingesteld als "To Email" field
- [ ] Andere variabelen zijn als Custom Fields ingesteld
- [ ] Restaurant notificatie template is geupdate
- [ ] Development server draait: `npm run dev`
- [ ] Test reservering gemaakt
- [ ] Bevestigingsknop werkt

