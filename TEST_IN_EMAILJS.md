# Test in EmailJS Dashboard

## Test Data voor Template Parameters:

In EmailJS dashboard, klik op "Test It" en gebruik deze test data:

### Template Parameters:
```
to_name: Test Klant
to_email: massawarestaurant@gmail.com  ← Je eigen email om te testen!
reservation_date: 2025-10-31
reservation_time: 20:00
reservation_guests: 2
reservation_message: Dit is een test reservering
email: info@massawa-restaurant.nl
```

### Wat te doen:
1. Klik op de "Test It" knop in EmailJS
2. Vul bovenstaande test data in
3. Bij "to_email", zet: `massawarestaurant@gmail.com` (jouw eigen email)
4. Klik "Send Test Email"

Als je een email ontvangt → het werkt! 🎉
Als niet → check de error message

## Belangrijk:

In het EmailJS scherm zie je:
- **To Email**: `{{to_email}}` ✅ Dit is correct!
- **From Email**: "Use Default Email Address" aangevinkt ✅

Als de test werkt, betekent dit dat het probleem in de API route zit, niet in het template!

## Als test werkt maar API nog steeds faalt:

Het probleem is waarschijnlijk in de API route parameters. Check:
1. Of we `to_email` correct versturen in de API
2. Of de variabele namen matchen met template parameters

