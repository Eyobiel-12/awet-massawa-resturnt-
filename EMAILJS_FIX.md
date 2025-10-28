# 🚨 BELANGRIJK: EmailJS Template Fix

## Probleem
Je krijgt error: **"422 The recipients address is corrupted"**

Dit komt omdat er **GEEN "To Email" veld** is in je template!

## ✅ Oplossing in 3 stappen:

### Stap 1: Voeg "To Email" veld toe in EmailJS

1. In je EmailJS template editor (template_99b3wut)
2. Scroll naar beneden naar "Content" of "Template Settings"
3. Zoek naar een sectie die zegt "To Email" of "Recipient Email"
4. Voeg een nieuw veld toe met:
   - **Field Name**: `to_email`
   - **Type**: **"To Email"** (NIET Custom Field!)
   - **Value**: `{{to_email}}`

### Stap 2: Update Template Parameters

In je template parameters sectie, zorg dat je hebt:

```
Template Parameters:
├── to_name          → Custom Field → {{to_name}}
├── to_email         → TO EMAIL FIELD → {{to_email}} ⚠️ BELANGRIJK!
├── reservation_date → Custom Field → {{reservation_date}}
├── reservation_time → Custom Field → {{reservation_time}}
├── reservation_guests → Custom Field → {{reservation_guests}}
└── reservation_message → Custom Field → {{reservation_message}}

Linked Template Parameters:
├── from_name
├── from_email
├── phone
├── date
├── time
├── guests
└── message
```

### Stap 3: Test Opnieuw

Klik op "Test template" knop in EmailJS
- Je zou geen error moeten krijgen
- Check dat het "To Email" veld correct is ingesteld

## 📋 Alternatief: Gebruik Service Email

Als je "To Email" niet kunt vinden, kun je ook:

1. Ga naar "Email Services" → service_t722xgi
2. Controleer dat er een "default from email" is ingesteld
3. In je template HTML, gebruik een hardcoded email:
   - Zoek regel waar `{{restaurant_email}}` staat
   - Vervang met `massawarestaurant@gmail.com` (of je eigen restaurant email)

## 🔍 Waar vind je "To Email" veld?

In EmailJS template editor, zoek naar:
- Settings tab
- Of een sectie met "Send To" / "Recipient"
- Of kijk in de template HTML voor een speciale `to-email` veld

Het is NIET in de "Template Parameters" lijst, maar als een apart veld bovenaan of in de settings!

## Test direct in EmailJS:

Gebruik deze test data:
- `to_name`: Test Klant
- `to_email`: **JOUW_EMAIL@TEST.NL** (om test emails te ontvangen)
- `reservation_date`: 2025-10-31
- `reservation_time`: 20:00
- `reservation_guests`: 2
- `reservation_message`: Test bericht

Als "To Email" correct is ingesteld, zou je een test email moeten ontvangen!

