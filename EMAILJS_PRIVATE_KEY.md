# 🔑 EmailJS Private Key

## Het Probleem:
Error: **"API calls in strict mode, but no private key was passed"**

Dit betekent dat je EmailJS account in "strict mode" draait en een private key nodig heeft.

## ✅ Oplossing:

### Optie 1: Haal je Private Key op (AANBEVOLEN)

1. Ga naar: https://dashboard.emailjs.com/admin/integration
2. Of ga naar: Account → Security (Security tab)
3. Zoek "Private Key" sectie
4. Kopieer je **Private Key**

### Optie 2: Maak een nieuw Private Key aan

1. In EmailJS Dashboard → Account → Security
2. Scroll naar "API Keys"
3. Klik "Create New Key"
4. Kopieer de **private key** (LET OP: dit krijg je maar 1x te zien!)

### Stap 3: Voeg Private Key toe aan Environment Variables

Maak een `.env.local` bestand in de root van je project:

```bash
# In je terminal:
touch .env.local
```

Plak dit in `.env.local`:
```env
EMAILJS_PRIVATE_KEY=JE_PRIVATE_KEY_HIER
```

**BELANGRIJK**: Vervang `JE_PRIVATE_KEY_HIER` met je echte private key!

### Stap 4: Herstart Development Server

```bash
# Stop de server (Ctrl+C)
npm run dev
```

## ✅ Als je geen Private Key kunt vinden:

### Optie A: Disable Strict Mode (minder veilig)

1. Ga naar: https://dashboard.emailjs.com/admin/integration
2. Zoek naar "Security" of "API Settings"
3. Schakel "Strict Mode" uit

### Optie B: Gebruik Public Key zonder Strict Mode

In `app/api/confirm-reservation/route.ts`, verander:
```typescript
const privateKey = publicKey  // Gebruik public key als fallback
```

Dit werkt alleen als strict mode uit staat!

## 🚨 Security Tip:

**ALTIJD** gebruik `.env.local` voor API keys:
- Voeg `.env.local` toe aan `.gitignore`
- Deel NOOIT je private key publiek!
- In productie, gebruik Vercel/Netlify environment variables

## Test Nu:

Herstart je server en probeer opnieuw!

