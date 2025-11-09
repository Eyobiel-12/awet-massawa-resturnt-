-- Supabase Migration: Create Reservations Table
-- Run this in your Supabase SQL Editor or via CLI

-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS reservations CASCADE;

-- Create reservations table
CREATE TABLE reservations (
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

-- Create indexes for faster queries
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created_at ON reservations(created_at DESC);
CREATE INDEX idx_reservations_email ON reservations(email);

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow insert access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow update access to reservations" ON reservations;
DROP POLICY IF EXISTS "Allow delete access to reservations" ON reservations;

-- Create policies to allow all operations
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
