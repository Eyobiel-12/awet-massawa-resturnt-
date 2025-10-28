# 🚀 Productie Update voor massawa-habesha.nl

## ✅ Je Domein
**https://www.massawa-habesha.nl/**

## 📝 Belangrijkste Aanpassing in EmailJS:

### Stap 1: Ga naar EmailJS Dashboard

https://dashboard.emailjs.com/

### Stap 2: Update Restaurant Notificatie Template

Template: **template_wyyw00j** (restaurant notificatie email)

### Stap 3: Zoek Deze Regel in de HTML

```html
<a href="http://localhost:3000/confirm?name={{from_name}}...">
```

### Stap 4: Vervang met Productie URL

```html
<a href="https://www.massawa-habesha.nl/confirm?name={{from_name}}&email={{from_email}}&date={{date}}&time={{time}}&guests={{guests}}&message={{message}}" 
   style="display: inline-block; background-color: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    ✅ Bevestig Reservering
</a>
```

### Stap 5: Save Template

Click "Save" in EmailJS dashboard.

## ✅ Environment Variable voor Productie

### Vercel:
1. Ga naar: https://vercel.com/dashboard
2. Select je project
3. Settings → Environment Variables
4. Add Variable:
   - **Key**: `EMAILJS_PRIVATE_KEY`
   - **Value**: `L9NIAmZizWEoBNL1vkTHO`
   - **Environment**: Production, Preview, Development

### Andere Hosting:
Voeg `EMAILJS_PRIVATE_KEY=L9NIAmZizWEoBNL1vkTHO` toe aan je hosting platform environment variables.

## 🧪 Test na Deployment:

1. Ga naar: https://www.massawa-habesha.nl/reservations
2. Maak een test reservering
3. Check je inbox voor notificatie
4. Klik op groene "Bevestig Reservering" knop
5. Verifieer dat de bevestigingspagina laadt
6. Check of de klant een bevestigingsmail ontvangt

## 📧 Complete Email Flow:

```
1. Klant maakt reservering op: https://www.massawa-habesha.nl/reservations
   ↓
2. EmailJS stuurt notificatie naar: massawarestaurant@gmail.com
   ↓
3. Restaurant email bevat knop: https://www.massawa-habesha.nl/confirm?...
   ↓
4. Restaurant klikt knop → Bevestigingspagina laadt
   ↓
5. API verstuurt bevestigingsmail naar klant
   ↓
6. Klant ontvangt email met al hun reserveringsdetails ✨
```

## ✅ Checklist voor Go-Live:

- [ ] EmailJS template URL is geupdate naar `https://www.massawa-habesha.nl/confirm`
- [ ] Environment variable `EMAILJS_PRIVATE_KEY` is toegevoegd aan hosting platform
- [ ] Website is gedeployed naar productie
- [ ] SSL/HTTPS is actief (Check: https://www.massawa-habesha.nl)
- [ ] Test reservering gemaakt en notificatie ontvangen
- [ ] Bevestigingsknop werkt op productie
- [ ] Klant bevestigingsmail wordt correct ontvangen

## 🎉 Klaar!

Je bevestigingssysteem is nu live op https://www.massawa-habesha.nl/

## 📊 Monitoring:

Check regelmatig:
- EmailJS Dashboard: https://dashboard.emailjs.com/
  - Email History: Welke emails zijn verstuurd
  - Statistics: Usage quota (179/200 requests left)

## 🆘 Als er Problemen zijn:

1. Check SSL: https://www.massawa-habesha.nl/ moet SSL hebben
2. Check EmailJS logs in dashboard
3. Check server logs in je hosting platform
4. Test de API route: `https://www.massawa-habesha.nl/api/confirm-reservation?name=Test&email=...`

