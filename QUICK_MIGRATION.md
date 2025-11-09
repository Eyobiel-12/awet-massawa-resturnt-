# ⚡ Quick Migration - Supabase Database Setup

## 🎯 Snelste Methode (2 minuten)

### Stap 1: Open Supabase Dashboard
Ga naar: https://supabase.com/dashboard/project/hqcstydqswarzfkpfmaa/sql/new

### Stap 2: Kopieer SQL
Open het bestand `supabase-migration.sql` en kopieer **ALLE** code.

### Stap 3: Plak en Run
1. Plak de code in de SQL Editor
2. Klik op **Run** (of druk `Cmd/Ctrl + Enter`)

✅ **Klaar!** Je database is nu klaar.

---

## 🔍 Verificatie

Na het runnen, check:
1. Ga naar: https://supabase.com/dashboard/project/hqcstydqswarzfkpfmaa/editor
2. Je zou een `reservations` tabel moeten zien
3. Klik erop om de kolommen te zien

---

## 🧪 Test Nu

1. **Start server:**
   ```bash
   npm run dev
   ```

2. **Maak test reservering:**
   - Ga naar: http://localhost:3000/reservations
   - Vul formulier in en submit

3. **Check database:**
   - Ga naar Supabase Dashboard → Table Editor → reservations
   - Je zou de nieuwe reservering moeten zien!

---

## ⚠️ Als je een Error krijgt

### "syntax error at or near CREATE"
- Zorg dat je **ALLE** SQL code kopieert
- Check of er geen oude code boven de CREATE staat
- De nieuwe SQL file is gefixed en zou moeten werken

### "relation already exists"
- Dit betekent de tabel bestaat al
- De SQL gebruikt `DROP TABLE IF EXISTS` om dit op te lossen
- Run de SQL opnieuw - het zou nu moeten werken

### "permission denied"
- Check of je ingelogd bent in Supabase Dashboard
- Check of je admin rechten hebt

---

## 📝 Environment Variables

Zorg dat je `.env.local` heeft:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hqcstydqswarzfkpfmaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3N0eWRxc3dhcnpma3BmbWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg0MjksImV4cCI6MjA3ODI1NDQyOX0.NvENveweuJN0V9DyuUmoTRU-bRZWNM767ULtQfrKrQ0
```

---

## ✅ Alles Klaar!

Je reserveringen worden nu opgeslagen in Supabase en blijven behouden! 🎉

