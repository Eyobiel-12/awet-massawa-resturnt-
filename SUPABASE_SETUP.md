# 🗄️ Supabase Setup voor Reserveringen

## Database Schema

Maak een tabel aan in je Supabase dashboard met de volgende SQL:

```sql
-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
-- For now, we'll allow all operations from authenticated requests
-- In production, you should restrict this based on your needs

-- Allow read access to all (for admin dashboard)
CREATE POLICY "Allow read access to reservations"
  ON reservations
  FOR SELECT
  USING (true);

-- Allow insert access to all (for reservation form)
CREATE POLICY "Allow insert access to reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Allow update access to all (for admin dashboard)
CREATE POLICY "Allow update access to reservations"
  ON reservations
  FOR UPDATE
  USING (true);

-- Allow delete access to all (for admin dashboard)
CREATE POLICY "Allow delete access to reservations"
  ON reservations
  FOR DELETE
  USING (true);
```

## Stappen om Database aan te maken:

### 1. Ga naar Supabase Dashboard
- Open: https://supabase.com/dashboard
- Selecteer je project: `hqcstydqswarzfkpfmaa`

### 2. Open SQL Editor
- Klik op "SQL Editor" in de sidebar
- Klik op "New Query"

### 3. Voer SQL uit
- Kopieer en plak de SQL hierboven
- Klik op "Run" of druk `Cmd/Ctrl + Enter`

### 4. Verifieer Tabel
- Ga naar "Table Editor" in de sidebar
- Je zou nu een `reservations` tabel moeten zien

## Environment Variables

Voeg deze toe aan je `.env.local` bestand:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hqcstydqswarzfkpfmaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxY3N0eWRxc3dhcnpma3BmbWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg0MjksImV4cCI6MjA3ODI1NDQyOX0.NvENveweuJN0V9DyuUmoTRU-bRZWNM767ULtQfrKrQ0
```

## Security (Optioneel - voor Productie)

Voor betere security, kun je RLS policies aanpassen:

```sql
-- Alleen service role kan alles doen
DROP POLICY IF EXISTS "Allow read access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow insert access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow update access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow delete access to reservations" ON reservations;

-- Of gebruik service role key in API routes (aanbevolen voor productie)
```

Voor productie, gebruik `SUPABASE_SERVICE_ROLE_KEY` in API routes in plaats van anon key.

## Testen

1. Start de development server: `npm run dev`
2. Maak een reservering via het formulier
3. Check Supabase dashboard → Table Editor → reservations
4. Je zou de nieuwe reservering moeten zien!

## Migratie van Bestaande Data

Als je al data hebt in `data/reservations.json`, kun je deze migreren:

```typescript
// Run dit script eenmalig om data te migreren
import { readFileSync } from "fs"
import { supabase } from "./lib/supabase"

const data = JSON.parse(readFileSync("data/reservations.json", "utf-8"))

for (const reservation of data) {
  await supabase.from("reservations").insert({
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    message: reservation.message || "",
    status: reservation.status || "pending",
  })
}
```

## Troubleshooting

### Error: "relation 'reservations' does not exist"
- Zorg dat je de SQL query hebt uitgevoerd in Supabase SQL Editor

### Error: "new row violates row-level security policy"
- Check of RLS policies correct zijn ingesteld
- Of gebruik service role key in API routes

### Data verschijnt niet
- Check Supabase dashboard → Table Editor
- Check browser console voor errors
- Check server logs

