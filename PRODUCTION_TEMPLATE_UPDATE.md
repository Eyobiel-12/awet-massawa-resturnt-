# 📝 Update EmailJS Template voor Productie

## Belangrijkste Aanpassing

Je moet de URL in je EmailJS template aanpassen van `localhost` naar je echte domein!

## Stap voor Stap:

### 1. Ga naar EmailJS Dashboard

https://dashboard.emailjs.com/

### 2. Selecteer Template

- Templates → **template_wyyw00j** (de restaurant notificatie template)

### 3. Zoek Deze Regel

In de HTML, zoek naar (ongeveer regel 93):
```html
<a href="http://localhost:3000/confirm?name={{from_name}}...">
```

### 4. Vervang met Productie URL

Als je domein bijvoorbeeld `massawa-restaurant.nl` is:

```html
<a href="https://massawa-restaurant.nl/confirm?name={{from_name}}&email={{from_email}}&date={{date}}&time={{time}}&guests={{guests}}&message={{message}}" 
   style="display: inline-block; background-color: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    ✅ Bevestig Reservering
</a>
```

### 5. Let Op:

- Gebruik **HTTPS** (niet HTTP!)
- Vervang `massawa-restaurant.nl` met JOUW echte domein
- Sla het template op

### 6. Test Direct

Na het opslaan:
- Maak een nieuwe reservering
- Check de email
- De knop link moet nu naar `https://JOUW_DOMEIN.nl/confirm?...` gaan

## Quick Copy-Paste voor Verschillende Scenarios:

### Voor `massawa-restaurant.nl`:
```html
https://massawa-restaurant.nl/confirm
```

### Voor `www.massawa-restaurant.nl`:
```html
https://www.massawa-restaurant.nl/confirm
```

### Voor een subdomain:
```html
https://restaurant.jouwdomain.nl/confirm
```

## Waarschuwing:

**Zonder deze aanpassing werkt de bevestigingsknop NIET in productie!**

De knop zou naar `localhost:3000` linken, wat niet werkt als je website live is.

## Test Checklist:

- [ ] Template is geupdate met productie URL
- [ ] URL begint met `https://`
- [ ] URL eindigt met `/confirm?...`
- [ ] Alle variabelen (name, email, date, etc.) zijn in de URL
- [ ] Template is opgeslagen in EmailJS
- [ ] Test email verstuurd en geklikt
- [ ] Bevestigingspagina laadt correct

## Hulp Nodig?

Als je je domein nog niet weet:
1. Deploy eerst je website
2. Check wat je URL is (bijvoorbeeld via Vercel/Netlify dashboard)
3. Update dan het EmailJS template met de correcte URL

