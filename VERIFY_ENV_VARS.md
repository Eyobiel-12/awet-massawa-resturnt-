# ✅ Environment Variables Verificatie

## Supabase Variables

De volgende environment variables zijn correct:

### ✅ NEXT_PUBLIC_SUPABASE_URL
```
https://hqcstydqswarzfkpfmaa.supabase.co
```

### ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3N0eWRxc3dhcnpma3BmbWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg0MjksImV4cCI6MjA3ODI1NDQyOX0.NvENveweuJN0V9DyuUmoTRU-bRZWNM767ULtQfrKrQ0
```

## 📋 Checklist voor Vercel

Zorg dat je deze variabelen hebt toegevoegd in Vercel:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://hqcstydqswarzfkpfmaa.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- [ ] Alle drie environments geselecteerd (Production, Preview, Development)
- [ ] Redeploy uitgevoerd na het toevoegen

## 🧪 Test na Setup

1. Maak een test reservering via je website
2. Check Vercel logs - zou geen "Invalid API key" error moeten geven
3. Check Supabase Dashboard → Table Editor → reservations
4. Je zou de nieuwe reservering moeten zien!

## ✅ Alles Correct!

Als je deze variabelen hebt toegevoegd in Vercel en geredeployed, zou alles moeten werken!

