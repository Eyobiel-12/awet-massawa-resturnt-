# 🚀 Productie Deployment Instructies

## ✅ Het Systeem Werkt Nu!

Zoals je kunt zien in de logs: **"Email verzonden succesvol: OK"**

## 📋 Stappen voor Productie:

### 1. Update EmailJS Template URL

Ga naar EmailJS Dashboard → Templates → `template_wyyw00j` (restaurant notificatie)

Vind deze regel in de template HTML (ongeveer regel 93):
```html
<a href="http://localhost:3000/confirm?name={{from_name}}...">
```

Vervang met je productie URL:
```html
<a href="https://JOUW_DOMEIN.nl/confirm?name={{from_name}}&email={{from_email}}&date={{date}}&time={{time}}&guests={{guests}}&message={{message}}">
```

**Belangrijk**: Vervang `JOUW_DOMEIN.nl` met je echte domein!

### 2. Environment Variables in Productie

Voeg deze environment variable toe aan je hosting platform:

#### Voor Vercel:
1. Ga naar je Vercel project
2. Settings → Environment Variables
3. Voeg toe:
   - **Key**: `EMAILJS_PRIVATE_KEY`
   - **Value**: `L9NIAmZizWEoBNL1vkTHO`
   - **Environment**: Production, Preview, Development

#### Voor Netlify:
1. Ga naar Site Settings → Environment Variables
2. Add Variable:
   - **Key**: `EMAILJS_PRIVATE_KEY`
   - **Value**: `L9NIAmZizWEoBNL1vkTHO`

#### Voor andere hosts:
- Gebruik hun dashboard om environment variables toe te voegen
- Key: `EMAILJS_PRIVATE_KEY`
- Value: `L9NIAmZizWEoBNL1vkTHO`

### 3. Deploy naar Productie

```bash
# Build voor productie
npm run build

# Deploy (afhankelijk van je hosting)
# Vercel: vercel
# Netlify: netlify deploy --prod
# etc.
```

### 4. Check EmailJS Quota

Je hebt: **179 requests left / 200 per maand**

Na productie deployment, check regelmatig je quota!

### 5. Test in Productie

Na deployment:
1. Maak een test reservering op je live website
2. Check dat je de notificatie email ontvangt
3. Klik op de bevestigingsknop
4. Verifieer dat de klant een bevestigingsmail ontvangt

## 🔐 Security Checklist

- [ ] `.env.local` staat in `.gitignore`
- [ ] Private key is NIET in Git commit
- [ ] Environment variable is geconfigureerd in hosting platform
- [ ] EmailJS template heeft het juiste productie URL
- [ ] SSL/HTTPS is actief op productie
- [ ] EmailJS quota wordt gemonitord

## 📧 Email Flow in Productie:

```
1. Klant → Reservering via website
   ↓
2. EmailJS stuurt notificatie naar: massawarestaurant@gmail.com
   ↓
3. Restaurant email bevat groene knop met link naar:
   https://JOUW_DOMEIN.nl/confirm?name=...&email=...&date=...
   ↓
4. Restaurant klikt knop → API route verstuurt bevestiging
   ↓
5. Klant ontvangt prachtige bevestigingsmail ✨
```

## 🛠️ Troubleshooting in Productie

### Emails komen niet aan:
1. Check EmailJS Dashboard → Email Logs
2. Check server logs voor errors
3. Verifieer environment variables
4. Check EmailJS quota

### Bevestigingsknop werkt niet:
1. Check dat de URL in EmailJS template correct is
2. Check dat HTTPS werkt (niet HTTP!)
3. Check browser console voor errors
4. Test de API route direct

### SSL Errors:
1. Zorg dat je hosting provider SSL heeft
2. Check dat alle assets via HTTPS laden
3. Verifieer dat mixed content (HTTP/HTTPS) errors niet voorkomen

## 📊 Monitoring

### Check EmailJS Dashboard:
- Ga naar: https://dashboard.emailjs.com/
- Email History → Kijk welke emails zijn verstuurd
- Statistics → Monitor je usage

### Check Server Logs:
- In Vercel: Project → Logs
- In Netlify: Deploy Logs
- Check voor errors bij `/api/confirm-reservation`

## ✅ Post-Deployment Checklist:

- [ ] SSL/HTTPS is actief
- [ ] Test reservering gemaakt
- [ ] Notificatie email ontvangen
- [ ] Bevestigingsknop werkt
- [ ] Klant bevestigingsmail ontvangen
- [ ] EmailJS quota wordt gemonitord
- [ ] Environment variables zijn correct geconfigureerd

## 🎉 Gefeliciteerd!

Je bevestigingssysteem is nu klaar voor productie!

Voor support: Check EmailJS logs en server logs voor debugging.

