#!/bin/bash

echo "🚀 Starting EduSync ERP System with Authentication..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📦 Starting infrastructure services (PostgreSQL, Redis, Eureka)..."
docker-compose up -d postgres redis eureka

echo "⏳ Waiting for infrastructure services to start..."
sleep 30

echo "🔐 Starting authentication service..."
docker-compose up -d edusync-auth

echo "🌐 Starting API Gateway..."
docker-compose up -d edusync-gateway

echo "💰 Starting other microservices..."
docker-compose up -d edusync-finance edusync-hr edusync-student edusync-sales edusync-academics

echo "⏳ Waiting for all services to start..."
sleep 20

echo "✅ Backend services are starting up!"
echo ""
echo "🌐 Access points:"
echo "   • Frontend: http://localhost:5173"
echo "   • API Gateway: http://localhost:8080"
echo "   • Auth Service: http://localhost:8086"
echo "   • Eureka Dashboard: http://localhost:8761"
echo ""
echo "📝 To start the frontend:"
echo "   cd frontend/edusync-web"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "🔍 To check service status:"
echo "   docker-compose ps"
echo ""
echo "📋 To view logs:"
echo "   docker-compose logs edusync-auth"
echo "   docker-compose logs edusync-gateway"
echo ""
echo "🎉 System is ready! Open http://localhost:5173 to test authentication."
