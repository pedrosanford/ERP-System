#!/bin/bash
echo "Stopping all services..."
docker-compose down

echo "Starting PostgreSQL..."
docker-compose up -d postgres

echo "Waiting for PostgreSQL to start..."
sleep 30

echo "Importing data..."
docker exec -i erp-system-postgres-1 psql -U edusync -d edusync_erp < database_export.sql

echo "Starting all services..."
docker-compose up -d

echo "Data import completed!"
