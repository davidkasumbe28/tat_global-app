#!/usr/bin/env bash

set -e

MIGRATE_NAME="init"

echo "Delete prisma/migrations"
rm -rf prisma/migrations
echo "Delete prisma/migrations ok" 

echo "Migrate reset"
npx prisma migrate reset 
echo "Migrate reset ok"

echo "Migrate dev $MIGRATE_NAME"
npx prisma migrate dev \-n "$MIGRATE_NAME"
echo "Migrate dev $MIGRATE_NAME ok"

echo "Migrate dev custom"
npx prisma migrate dev --create-only --name custom
echo "Migrate custom ok"

echo "Add custom sql to prisma/migrations/xxxx_custom/migration.sql"
read -p "Enter the name of the custom migration : " $MIGRATION_FILE
rm -rf prisma/migrations/"$MIGRATION_FILE"/migration.sql
cp prisma/migration.sql prisma/migrations/"$MIGRATION_FILE"/migration.sql
echo "Add custom sql ok"

echo "Generate"
npx prisma generate
echo "Generate ok"

echo "DB seed"
npx prisma db seed
echo "DB seed ok"

echo "END"