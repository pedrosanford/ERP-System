# EduSync ERP - Authentication Setup Guide

This guide will help you set up and run the EduSync ERP system with working authentication.

## Prerequisites

- Docker and Docker Compose
- Java 17+ (for local development)
- Maven 3.6+ (for local development)
- Node.js 16+ and npm (for frontend development)

## Quick Start

### 1. Start the Backend Services

```bash
# Start PostgreSQL, Redis, Eureka, and all microservices
docker-compose up -d postgres redis eureka

# Wait for services to start (about 30 seconds)
sleep 30

# Start the microservices
docker-compose up -d edusync-auth edusync-gateway edusync-finance edusync-hr edusync-student edusync-sales edusync-academics
```

### 2. Start the Frontend

```bash
# Navigate to frontend directory
cd frontend/edusync-web

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Access the Application

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:8080
- **Auth Service:** http://localhost:8086
- **Eureka Dashboard:** http://localhost:8761

## Authentication Features

### ✅ What's Working

1. **Beautiful Auth Page**
   - Modern, responsive design with Tailwind CSS
   - Centered forms with glassmorphism effects
   - EduSync logo integration
   - Smooth animations and transitions

2. **User Registration**
   - Full name, email, and password validation
   - Password confirmation
   - Real-time error handling
   - Automatic login after registration

3. **User Login**
   - Email and password authentication
   - JWT token generation
   - Secure session management
   - Error handling for invalid credentials

4. **Backend Integration**
   - PostgreSQL database with user table
   - JWT token-based authentication
   - Password encryption with BCrypt
   - Spring Security integration
   - Microservice architecture with Eureka

### 🔧 API Endpoints

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Development

### Building Services Locally

```bash
# Build auth service
cd services/edusync-auth
mvn clean package

# Build other services
cd ../edusync-finance
mvn clean package
# ... repeat for other services
```

### Database Access

```bash
# Connect to PostgreSQL
docker exec -it erp-system-postgres-1 psql -U edusync -d edusync_erp

# View users table
\dt users
SELECT * FROM users;
```

### Frontend Development

```bash
cd frontend/edusync-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   # Check service logs
   docker-compose logs edusync-auth
   docker-compose logs postgres
   ```

2. **Database connection issues**
   ```bash
   # Restart PostgreSQL
   docker-compose restart postgres
   ```

3. **Frontend not connecting to backend**
   - Check that API_URL is set correctly in environment
   - Ensure API Gateway is running on port 8080
   - Verify CORS configuration

4. **Authentication not working**
   - Check auth service logs: `docker-compose logs edusync-auth`
   - Verify JWT secret configuration
   - Check database connection

### Reset Everything

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   (React)       │◄──►│   (Port 8080)   │◄──►│   (Port 8086)   │
│   Port 5173     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   (Port 5432)   │
                       └─────────────────┘
```

## Next Steps

1. **Add more user roles** (Admin, Manager, etc.)
2. **Implement password reset** functionality
3. **Add email verification** for new registrations
4. **Implement user profile management**
5. **Add social login** (Google, GitHub, etc.)

## Support

If you encounter any issues:

1. Check the service logs: `docker-compose logs [service-name]`
2. Verify all services are running: `docker-compose ps`
3. Check database connectivity
4. Ensure all environment variables are set correctly
