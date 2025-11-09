# 🚀 Supabase CLI Setup Guide

## Optie 1: Via Supabase Dashboard (Aanbevolen - Eenvoudigst)

### Stap 1: Voeg Environment Variables toe

Maak/update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hqcstydqswarzfkpfmaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3N0eWRxc3dhcnpma3BmbWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg0MjksImV4cCI6MjA3ODI1NDQyOX0.NvENveweuJN0V9DyuUmoTRU-bRZWNM767ULtQfrKrQ0
```

### Stap 2: Run SQL in Dashboard

1. Ga naar: https://supabase.com/dashboard/project/hqcstydqswarzfkpfmaa
2. Klik op **SQL Editor** in de sidebar
3. Klik op **New Query**
4. Kopieer **ALLE** code uit `supabase-migration.sql`
5. Plak in de SQL Editor
6. Klik **Run** of druk `Cmd/Ctrl + Enter`

✅ Klaar! De tabel is aangemaakt.

---

## Optie 2: Via Supabase CLI (Voor Geavanceerde Gebruikers)

### Stap 1: Login via Browser

Run in je terminal:
```bash
supabase login
```

Dit opent je browser voor authenticatie.

### Stap 2: Link Project

```bash
supabase link --project-ref hqcstydqswarzfkpfmaa
```

Je wordt gevraagd om:
- **Database Password**: `e7ATieWKoSwN7WA0`
- **Region**: Kies de juiste regio (meestal `us-east-1`)

### Stap 3: Run Migration

```bash
supabase db push
```

Of run de SQL direct:
```bash
supabase db execute --file supabase-migration.sql
```

---

## Optie 3: Direct SQL via psql (Als je PostgreSQL client hebt)

```bash
psql "postgres://postgres.hqcstydqswarzfkpfmaa:e7ATieWKoSwN7WA0@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require" -f supabase-migration.sql
```

---

## ✅ Verificatie

Na het runnen van de SQL:

1. Ga naar Supabase Dashboard → **Table Editor**
2. Je zou nu een `reservations` tabel moeten zien
3. De tabel zou deze kolommen moeten hebben:
   - id (UUID)
   - name (TEXT)
   - email (TEXT)
   - phone (TEXT)
   - date (DATE)
   - time (TIME)
   - guests (TEXT)
   - message (TEXT)
   - status (TEXT)
   - created_at (TIMESTAMP)

## 🧪 Test

1. Start je server: `npm run dev`
2. Maak een reservering via: http://localhost:3000/reservations
3. Check Supabase Dashboard → Table Editor → reservations
4. Je zou de nieuwe reservering moeten zien!

## 🔧 Troubleshooting

### Error: "syntax error at or near CREATE"
- Zorg dat je **ALLE** SQL code kopieert (niet alleen een deel)
- Check of er geen oude policies bestaan die conflicteren
- De nieuwe SQL file heeft `DROP TABLE IF EXISTS` en `DROP POLICY IF EXISTS` om dit te voorkomen

### Error: "relation already exists"
- De tabel bestaat al - dit is OK
- De SQL gebruikt `DROP TABLE IF EXISTS` om dit op te lossen
- Of verwijder handmatig de tabel in Supabase Dashboard

### Error: "permission denied"
- Check of je de juiste project hebt geselecteerd
- Check of je admin rechten hebt op het project

