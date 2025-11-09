# ✅ Template met Logo Toegevoegd!

## 📋 Gebruik Deze Template in EmailJS:

1. Open: https://dashboard.emailjs.com/
2. Templates → **template_wyyw00j**
3. Kopieer de HELE inhoud van **`EMAILJS_TEMPLATE_PRODUCTION.txt`**
4. Plak in EmailJS template editor
5. **Sla op**

## ✅ Wat is toegevoegd:

### Logo in Header:
Het logo wordt nu automatisch geladen van:
```
https://www.massawa-habesha.nl/images/logo.png
```

**Belangrijk**: Zorg dat dit logo bestand bestaat op je productie website!

## 🖼️ Bestanden om toe te voegen aan productie website:

### Voor Logo:
Upload naar `/public/images/logo.png` (of gebruik bestaande)

### Als je andere afbeeldingen wilt gebruiken:

Vervang regel 15 in de template:

**Huidige template:**
```html
<img src="https://www.massawa-habesha.nl/images/logo.png" ...>
```

**Voor alternatieve afbeelding:**
```html
<img src="https://www.massawa-habesha.nl/images/design-mode/logo.jpeg" ...>
```

Of gebruik de externe URL:
```html
<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.48-2ccaaEf4tUEeVhg1pE6klHQ4dTjkKd.jpeg" ...>
```

## 📝 Extra Features in Deze Template:

- ✅ **Logo in header** (ipv alleen letter "M")
- ✅ **Witte achtergrond** voor leesbaarheid
- ✅ **Donkere tekst** voor mobiel gebruik
- ✅ **Productie URL**: `https://www.massawa-habesha.nl/confirm`
- ✅ **Responsive** design voor alle devices

## 🧪 Test na Deployment:

1. Check dat `/images/logo.png` bestaat op je live website
2. Maak een test reservering
3. Check de email - logo zou moeten zichtbaar zijn!

## 🎨 Als Logo niet laadt:

Als het logo niet zichtbaar is in emails:
1. Upload logo naar een publieke URL (Vercel Blob Storage, Cloudinary, etc.)
2. Gebruik die URL in het template
3. Sla op en test opnieuw


