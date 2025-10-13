# EduSync ERP System

A comprehensive Educational Resource Planning (ERP) system built with microservices architecture for educational institutions.

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Node.js** (v18+) and **npm** for frontend development
- **Git** for cloning the repository

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ERP-System
```

### 2. Start Backend Services (Docker)
```bash
# Download Docker Desktop
download Docker Desktop
install Maven

# Docker Compose build
docker-compose build

# Start all microservices with Docker Compose
docker-compose up -d

# Check if all services are running
docker-compose ps
```

### 3. Start Frontend (Development Mode)
```bash
# Navigate to frontend directory
cd frontend/edusync-web

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend Application**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## 🏗️ System Architecture

### Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   API Gateway   │    │   Eureka Server │
│   (Port 5173)   │◄──►│   (Port 8080)   │◄──►│   (Port 8761)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │     PostgreSQL DB       │
                    │      (Port 5432)        │
                    └─────────────────────────┘
                                ▲
                                │
        ┌─────────────────────────────────────────────┐
        │              Microservices                 │
        │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
        │  │ Finance │ │    HR   │ │ Student │     │
        │  │ :8081   │ │ :8082   │ │ :8083   │     │
        │  └─────────┘ └─────────┘ └─────────┘     │
        │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
        │  │  Sales │ │Academics│ │  Auth   │     │
        │  │ :8084   │ │ :8085   │ │ :8086   │     │
        │  └─────────┘ └─────────┘ └─────────┘     │
        └─────────────────────────────────────────────┘
```

## 📁 Project Structure

```
ERP-System/
├── services/                          # Backend Microservices
│   ├── edusync-gateway/              # API Gateway (Spring Cloud)
│   ├── edusync-eureka/               # Service Discovery
│   ├── edusync-auth/                 # Authentication Service
│   ├── edusync-finance/              # Financial Management
│   ├── edusync-hr/                   # Human Resources
│   ├── edusync-student/              # Student Management
│   ├── edusync-sales/                # Sales & CRM
│   └── edusync-academics/            # Academic Management
├── frontend/
│   └── edusync-web/                  # React Frontend (TypeScript)
├── docker-compose.yml               # Docker orchestration
└── README.md                        # This file
```

## 🔧 Services Overview

### Core Services

#### 🏦 Finance Service (Port 8081)
- **Transaction Management**: Complete CRUD operations for income/expense tracking
- **Financial Analytics**: Real-time revenue, expenses, profit calculations
- **Multi-Account Support**: Bank accounts, cash accounts, payment methods
- **Budget Management**: Department budgets with spending alerts
- **Payment Processing**: Tuition fees, scholarships, payroll integration

#### 👥 HR Service (Port 8082)
- **Staff Management**: Employee records, positions, departments
- **Attendance Tracking**: Check-in/out times, hours worked
- **Leave Management**: Vacation requests, sick leave, approval workflows
- **Payroll System**: Salary calculations, bonuses, deductions
- **Performance Evaluation**: Staff assessments and goal tracking
- **Document Management**: Employee contracts and files

#### 🎓 Student Service (Port 8083)
- **Student Records**: Personal information, academic history
- **Enrollment Management**: Program enrollment, course registration
- **Academic Performance**: GPA tracking, grade management
- **Attendance Management**: Student attendance tracking
- **Document Management**: Student files, transcripts

#### 💼 Sales Service (Port 8084)
- **Lead Management**: Prospective student tracking
- **Opportunity Management**: Sales deals and conversion tracking
- **Communication Tools**: Email templates and follow-up automation
- **Performance Analytics**: Sales metrics and conversion rates

#### 📚 Academics Service (Port 8085)
- **Program Management**: Degree programs and curriculum design
- **Course Scheduling**: Class timetables and room assignments
- **Grade Management**: Assignment tracking and transcript generation
- **Academic Calendar**: Term management and exam scheduling

#### 🔐 Auth Service (Port 8086)
- **User Authentication**: JWT-based authentication
- **Role-Based Access**: User roles and permissions
- **Security Management**: Password hashing and session management

#### 🌐 API Gateway (Port 8080)
- **Request Routing**: Routes requests to appropriate microservices
- **Load Balancing**: Distributes load across service instances
- **Authentication**: Validates JWT tokens
- **Rate Limiting**: Prevents API abuse

## 🗄️ Database

### PostgreSQL Database
- **Database**: `edusync_erp`
- **User**: `edusync`
- **Password**: `password`
- **Port**: `5432`

### Key Tables
- `users` - User authentication and roles
- `staff` - Employee records and HR data
- `students` - Student information and academic records
- `departments` - Organizational structure
- `transactions` - Financial transactions
- `attendance` - Staff and student attendance
- `payroll` - Salary and payment records

## 🚀 Development Workflow

### Backend Development
```bash
# View logs for specific service
docker-compose logs edusync-finance -f

# Restart specific service after code changes
docker-compose restart edusync-finance

# Rebuild and restart service
docker-compose build edusync-finance
docker-compose up edusync-finance -d
```

### Frontend Development
```bash
# Navigate to frontend
cd frontend/edusync-web

# Install new dependencies
npm install <package-name>

# Run development server with hot reload
npm run dev

# Build for production
npm run build
```

## 🧪 Testing the System

### 1. Check Service Health
```bash
# Check all services are running
docker-compose ps

# Test API Gateway
curl http://localhost:8080/actuator/health

# Test Eureka Dashboard
curl http://localhost:8761
```

### 2. Test API Endpoints
```bash
# Get HR statistics
curl http://localhost:8080/api/hr/stats

# Get student data
curl http://localhost:8080/api/student/students

# Get finance statistics
curl http://localhost:8080/api/finance/stats
```

### 3. Access Frontend
- Open browser: http://localhost:5173
- Navigate through different modules
- Test user authentication and data display

## 🔧 Configuration

### Environment Variables
All services use Docker environment variables for configuration:
- Database connection strings
- Service discovery URLs
- Port configurations

### Service Ports
- **Frontend**: 5173
- **Gateway**: 8080
- **Eureka**: 8761
- **Finance**: 8081
- **HR**: 8082
- **Student**: 8083
- **Sales**: 8084
- **Academics**: 8085
- **Auth**: 8086
- **PostgreSQL**: 5432

## 🛠️ Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs

# Restart all services
docker-compose down
docker-compose up -d
```

#### Database Connection Issues
```bash
# Check PostgreSQL container
docker-compose logs postgres

# Connect to database
docker exec -it erp-system-postgres-1 psql -U edusync -d edusync_erp
```

#### Frontend Not Loading
```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Check frontend logs
cd frontend/edusync-web
npm run dev
```

### Reset Everything
```bash
# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## 📊 Monitoring

### Service Discovery
- **Eureka Dashboard**: http://localhost:8761
- View all registered services
- Monitor service health

### Application Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs edusync-finance -f
docker-compose logs edusync-hr -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Documentation

- [Database Schema](DATABASE_SCHEMA.md)
- [Finance Module](FINANCE_MODULE_IMPLEMENTATION.md)
- [HR Module](HR_MODULE_IMPLEMENTATION.md)
- [Quick Commands](QUICK_COMMANDS.md)

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs`
3. Ensure all prerequisites are installed
4. Try resetting the system: `docker-compose down -v && docker-compose up -d`

---

**Ready to get started?** Follow the Quick Start guide above to have the entire system running in minutes! 🚀
