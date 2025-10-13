# EduSync ERP System

A comprehensive Educational Resource Planning (ERP) system built with microservices architecture.

## 🚀 Quick Start

### For New Team Members
See [SETUP_FOR_COLLEAGUES.md](./SETUP_FOR_COLLEAGUES.md) for detailed setup instructions.

### Quick Setup
```bash
# 1. Start backend services
./start-auth-system.sh

# 2. Start frontend
cd frontend/edusync-web
npm install
npm run dev

# 3. Start backend
download Docker Desktop
install Maven
docker-compose build
docker-compose up -d
```

### Access Points
- **Frontend:** http://localhost:5173
- **Auth Service:** http://localhost:8086
- **API Gateway:** http://localhost:8080
- **Eureka Dashboard:** http://localhost:8761

## Project Structure

```
edusync-erp/
├── services/
│   ├── edusync-gateway/      # API Gateway
│   ├── edusync-finance/      # Billing, payments, financial reporting
│   ├── edusync-hr/           # Staff records, payroll, recruitment  
│   └── edusync-student/      # Student management, enrollment, grades
├── shared/
│   ├── edusync-common/       # Shared utilities and types
│   └── edusync-config/       # Configuration management
├── frontend/
│   └── edusync-web/          # React web application
└── infrastructure/           # Deployment configurations
```

## Services

### edusync-gateway
- API Gateway for routing requests to microservices
- Authentication and authorization
- Rate limiting and request validation

### edusync-finance
- Billing and invoicing
- Payment processing
- Financial reporting and analytics
- Budget management

### edusync-hr
- Staff records and profiles
- Payroll management
- Recruitment and onboarding
- Performance tracking

### edusync-student
- Student enrollment and registration
- Academic records and grades
- Course management
- Student communication

## Getting Started

1. Clone the repository
2. Install dependencies for each service:
   ```bash
   cd services/edusync-gateway && npm install
   cd ../edusync-finance && npm install
   cd ../edusync-hr && npm install
   cd ../edusync-student && npm install
   cd ../../shared/edusync-common && npm install
   cd ../edusync-config && npm install
   cd ../../frontend/edusync-web && npm install
   ```

3. Start all services using Docker Compose:
   ```bash
   docker-compose up
   ```

## Development

Each service can be developed independently. Use the following commands:

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run build` - Build for production

## API Endpoints

- Gateway: http://localhost:3000
- Finance Service: http://localhost:3001
- HR Service: http://localhost:3002
- Student Service: http://localhost:3003
- Web Frontend: http://localhost:3004
