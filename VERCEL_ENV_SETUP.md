# 🔧 Vercel Environment Variables Setup

## ⚠️ Probleem: "Invalid API key"

De error betekent dat de Supabase environment variables niet zijn ingesteld in Vercel.

## ✅ Oplossing: Voeg Environment Variables toe in Vercel

### Stap 1: Ga naar Vercel Dashboard

1. Ga naar: https://vercel.com/dashboard
2. Selecteer je project: **awet-massawa-resturnt**
3. Klik op **Settings** (in de top navigation)
4. Klik op **Environment Variables** (in de sidebar)

### Stap 2: Voeg deze Environment Variables toe

Klik op **Add New** en voeg deze variabelen één voor één toe:

#### 1. Supabase URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://hqcstydqswarzfkpfmaa.supabase.co`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Klik **Save**

#### 2. Supabase Anon Key
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3N0eWRxc3dhcnpma3BmbWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg0MjksImV4cCI6MjA3ODI1NDQyOX0.NvENveweuJN0V9DyuUmoTRU-bRZWNM767ULtQfrKrQ0`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Klik **Save**

#### 3. EmailJS Private Key (als je die hebt)
- **Key**: `EMAILJS_PRIVATE_KEY`
- **Value**: `L9NIAmZizWEoBNL1vkTHO` (of je eigen key)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Klik **Save**

#### 4. Admin Password (optioneel)
- **Key**: `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Value**: `massawa2024` (of je eigen wachtwoord)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Klik **Save**

### Stap 3: Redeploy

Na het toevoegen van alle environment variables:

1. Ga naar **Deployments** tab
2. Klik op de **3 dots** (⋯) naast de laatste deployment
3. Klik op **Redeploy**
4. Selecteer **Use existing Build Cache** (optioneel)
5. Klik **Redeploy**

Of push een nieuwe commit om automatisch te redeployen:

```bash
git commit --allow-empty -m "chore: Trigger redeploy with env vars"
git push origin main
```

## ✅ Verificatie

Na de redeploy:

1. Test een reservering maken via je website
2. Check Vercel logs voor errors
3. Check Supabase Dashboard → Table Editor → reservations
4. Je zou de nieuwe reservering moeten zien!

## 🔍 Troubleshooting

### "Invalid API key" blijft bestaan
- Check of je de **juiste** keys hebt gekopieerd (geen extra spaties)
- Check of je **alle** environments hebt geselecteerd (Production, Preview, Development)
- Wacht 1-2 minuten na het toevoegen en redeploy

### "Missing Supabase environment variables"
- Check of de variabelen zijn toegevoegd
- Check of de namen **exact** kloppen (case-sensitive!)
- Redeploy na het toevoegen

### Data verschijnt niet
- Check Supabase Dashboard → Table Editor
- Check Vercel logs voor errors
- Check of de database tabel bestaat

## 📝 Belangrijk

- ✅ Environment variables zijn **case-sensitive**
- ✅ Gebruik **exact** dezelfde namen als hierboven
- ✅ Selecteer **alle** environments (Production, Preview, Development)
- ✅ **Redeploy** na het toevoegen van variabelen

## 🎉 Klaar!

Na het toevoegen van de environment variables en redeploy zou alles moeten werken!

