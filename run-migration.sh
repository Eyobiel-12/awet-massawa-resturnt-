#!/bin/bash

# Supabase Migration Script
# This script runs the SQL migration directly via psql

echo "🚀 Running Supabase Migration..."

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed. Please install PostgreSQL client or use Supabase Dashboard."
    echo "   Alternative: Copy the SQL from supabase-migration.sql and run it in Supabase Dashboard"
    exit 1
fi

# Run the migration
psql "postgres://postgres.hqcstydqswarzfkpfmaa:e7ATieWKoSwN7WA0@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require" -f supabase-migration.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "   Check Supabase Dashboard → Table Editor to verify"
else
    echo "❌ Migration failed. Please check the error above."
    echo "   Alternative: Copy the SQL from supabase-migration.sql and run it in Supabase Dashboard"
fi

