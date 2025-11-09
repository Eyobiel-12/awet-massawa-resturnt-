# 🚀 Supabase Quick Start Guide

## ✅ Wat is al gedaan:

1. ✅ Supabase client library toegevoegd aan `package.json`
2. ✅ Storage library aangepast voor Supabase (`lib/reservations-storage.ts`)
3. ✅ Supabase client configuratie (`lib/supabase.ts`)
4. ✅ Admin pagina bijgewerkt voor nieuwe veldnamen
5. ✅ SQL migratie bestand aangemaakt (`supabase-migration.sql`)

## 📋 Stappen om te voltooien:

### Stap 1: Installeer Supabase Package

**Probeer eerst:**
```bash
npm install
```

**Als dat niet werkt, probeer:**
```bash
npm install @supabase/supabase-js --force
```

**Of handmatig in `package.json` staat het al, dus run gewoon:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Stap 2: Voeg Environment Variables toe

Maak of update `.env.local` in de root van je project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hqcstydqswarzfkpfmaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3N0eWRxc3dhcnpma3BmbWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg0MjksImV4cCI6MjA3ODI1NDQyOX0.NvENveweuJN0V9DyuUmoTRU-bRZWNM767ULtQfrKrQ0

# EmailJS (als je die nog nodig hebt)
EMAILJS_PRIVATE_KEY=your_key_here

# Admin Password (optioneel)
NEXT_PUBLIC_ADMIN_PASSWORD=massawa2024
```

### Stap 3: Maak Database Tabel aan

1. **Ga naar Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecteer je project: `hqcstydqswarzfkpfmaa`

2. **Open SQL Editor:**
   - Klik op "SQL Editor" in de sidebar
   - Klik op "New Query"

3. **Kopieer en plak de SQL uit `supabase-migration.sql`:**
   - Open het bestand `supabase-migration.sql` in je project
   - Kopieer alle SQL code
   - Plak in Supabase SQL Editor
   - Klik "Run" of druk `Cmd/Ctrl + Enter`

4. **Verifieer:**
   - Ga naar "Table Editor" in de sidebar
   - Je zou nu een `reservations` tabel moeten zien

### Stap 4: Test!

1. **Start de server:**
   ```bash
   npm run dev
   ```

2. **Maak een test reservering:**
   - Ga naar: http://localhost:3000/reservations
   - Vul het formulier in en submit

3. **Check Supabase:**
   - Ga naar Supabase Dashboard → Table Editor → reservations
   - Je zou de nieuwe reservering moeten zien!

4. **Check Admin Dashboard:**
   - Ga naar: http://localhost:3000/admin
   - Login met wachtwoord: `massawa2024`
   - Je zou alle reserveringen moeten zien!

## 🔍 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
- Run: `npm install @supabase/supabase-js`
- Of: `npm install --force`

### "Missing Supabase environment variables"
- Check of `.env.local` bestaat
- Check of de variabelen correct zijn
- Herstart de development server

### "relation 'reservations' does not exist"
- Zorg dat je de SQL migratie hebt uitgevoerd in Supabase
- Check Supabase Dashboard → Table Editor

### "new row violates row-level security policy"
- Check of de RLS policies correct zijn ingesteld
- De SQL in `supabase-migration.sql` zou dit moeten oplossen

### Data verschijnt niet
- Check browser console voor errors
- Check server logs
- Check Supabase Dashboard → Table Editor om te zien of data is opgeslagen

## 📝 Belangrijk:

- ✅ Reserveringen worden nu opgeslagen in Supabase (niet meer in-memory!)
- ✅ Data blijft behouden tussen server restarts
- ✅ Data is toegankelijk vanuit Supabase Dashboard
- ✅ Je kunt queries uitvoeren in Supabase SQL Editor

## 🎉 Klaar!

Je reserveringen worden nu opgeslagen in Supabase en blijven behouden!

