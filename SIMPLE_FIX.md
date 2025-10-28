# 🔧 Simpele Oplossing

## Wat je moet doen:

### In EmailJS Template Editor:

1. Zoek naar een sectie bovenaan die zegt: **"Email Address"** of **"Send To"** of **"To"**
2. In dat veld, typ of kies: `{{to_email}}`
3. Sla op

## Als je dat niet kunt vinden:

### Optie 1: Gebruik Reply-To veld
- Zoek naar "Reply To" veld
- Zet daar: `{{to_email}}`

### Optie 2: Update je HTML template
In `public/customer_confirmation_template.html`, zoek:
```html
<p style="margin: 8px 0; font-size: 15px;">
    📞 +31 20 123 4567<br>
    ✉️ info@massawa-restaurant.nl
</p>
```

Vervang `info@massawa-restaurant.nl` met:
```html
✉️ {{to_email}}
```

### Optie 3: Gebruik een vaste email (voor testen)
Als niets werkt, gebruik tijdelijk je eigen email:

Open: `public/customer_confirmation_template.html`

Zoek naar:
```html
<p style="margin: 8px 0; font-size: 15px;">
    📞 +31 20 123 4567<br>
    ✉️ info@massawa-restaurant.nl
</p>
```

Vervang met:
```html
<p style="margin: 8px 0; font-size: 15px;">
    📞 +31 20 123 4567<br>
    ✉️ massawarestaurant@gmail.com
</p>
```

En in de API route, zorg dat de email ALTIJD naar het restaurant email gaat:
- Update `app/api/confirm-reservation/route.ts`
- Gebruik een vaste `reply_to` parameter

## Meest Waarschijnlijke Oplossing:

In EmailJS template editor, boven de template preview, moet er een veld zijn voor "Email Address" of "To".

Zet daar simpel: `{{to_email}}` of gewoon een test email adres.

**Dit veld is NIET in de "Template Parameters" lijst, maar als een apart veld bovenaan de template!**

