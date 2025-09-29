# EduSync Auth Service

Authentication service for EduSync ERP System.

## Features

- User registration and login
- JWT token-based authentication
- Password encryption with BCrypt
- PostgreSQL database integration
- Spring Security integration
- Eureka service discovery

## API Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "success": true
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "success": true
}
```

### GET /api/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "success": true
}
```

## Configuration

The service uses the following configuration:

- **Port:** 8086
- **Database:** PostgreSQL (edusync_erp)
- **JWT Secret:** Configured in application.yml
- **JWT Expiration:** 24 hours (86400000 ms)

## Building and Running

### Using Docker Compose (Recommended)

```bash
# From the project root
docker-compose up edusync-auth
```

### Manual Build

```bash
# Build the project
mvn clean package

# Run the application
java -jar target/edusync-auth-1.0.0.jar
```

## Database Schema

The service creates a `users` table with the following structure:

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are signed with HMAC SHA-256
- CORS is configured for cross-origin requests
- Input validation is implemented for all endpoints
