# ERP System - Quick Commands

## 🚀 System Startup

### Backend (Docker Compose)
Backend runs **separately** and works in the background:

```bash
# Start all microservices
docker-compose up -d

# Check status
docker-compose ps

# Stop all
docker-compose down
```

### Frontend (React + Vite)
Frontend runs **separately** in development mode:

```bash
# Navigate to frontend folder
cd frontend/edusync-web

# Start dev server (http://localhost:5173)
npm run dev

# Stop: Ctrl+C or Cmd+C
```

**⚠️ IMPORTANT:** Backend and Frontend are **two different processes**!
- Backend: `docker-compose up -d` (ports 8080-8086)
- Frontend: `npm run dev` (port 5173)

---

### Staff Members
```bash
# All staff members
curl -s http://localhost:8080/api/hr/staff | jq

# Only active staff
curl -s http://localhost:8080/api/hr/staff/active | jq

# By ID
curl -s http://localhost:8080/api/hr/staff/1 | jq

# HR statistics
curl -s http://localhost:8080/api/hr/stats | jq
```

### Students
```bash
# All students
curl -s http://localhost:8080/api/student/students | jq

# By ID
curl -s http://localhost:8080/api/student/students/1 | jq

# By status
curl -s http://localhost:8080/api/student/students/status/ACTIVE | jq

# Student statistics
curl -s http://localhost:8080/api/student/stats | jq
```

### Departments
```bash
# All departments
curl -s http://localhost:8080/api/hr/departments | jq

# Active departments
curl -s http://localhost:8080/api/hr/departments/active | jq
```

### Finance Transactions 💰
```bash
# All transactions
curl -s http://localhost:8080/api/finance/transactions | jq

# Recent transactions
curl -s http://localhost:8080/api/finance/transactions/recent | jq

# By type (INCOME or EXPENSE)
curl -s http://localhost:8080/api/finance/transactions/type/INCOME | jq
curl -s http://localhost:8080/api/finance/transactions/type/EXPENSE | jq

# By status (PENDING, COMPLETED, CANCELLED)
curl -s http://localhost:8080/api/finance/transactions/status/COMPLETED | jq

# By category
curl -s "http://localhost:8080/api/finance/transactions/category/Tuition%20Fees" | jq

# By ID
curl -s http://localhost:8080/api/finance/transactions/1 | jq

# Financial statistics
curl -s http://localhost:8080/api/finance/stats | jq
```

**Example statistics output:**
```json
{
  "totalRevenue": 10500.00,
  "monthlyRevenue": 10500.00,
  "revenueGrowth": 100.0,
  "totalExpenses": 3500.00,
  "monthlyExpenses": 3500.00,
  "expenseGrowth": 100.0,
  "netProfit": 7000.00,
  "profitMargin": 66.67,
  "totalBalance": 0,
  "totalTransactions": 4,
  "totalAccounts": 0,
  "activeBudgets": 0
}
```

---

## 🔧 Service Management

### Restart specific service (after code changes)
```bash
# HR Service
docker-compose stop edusync-hr && docker rm -f erp-system-edusync-hr-1
docker-compose build edusync-hr
docker-compose up edusync-hr -d

# Student Service
docker-compose stop edusync-student && docker rm -f erp-system-edusync-student-1
docker-compose build edusync-student
docker-compose up edusync-student -d

# Finance Service
docker-compose stop edusync-finance && docker rm -f erp-system-edusync-finance-1
docker-compose build edusync-finance
docker-compose up edusync-finance -d

# Gateway
docker-compose stop edusync-gateway && docker rm -f erp-system-edusync-gateway-1
docker-compose build edusync-gateway
docker-compose up edusync-gateway -d
```

### View logs
```bash
# HR Service
docker-compose logs edusync-hr --tail=50 -f

# Student Service
docker-compose logs edusync-student --tail=50 -f

# Finance Service
docker-compose logs edusync-finance --tail=50 -f

# Gateway
docker-compose logs edusync-gateway --tail=50 -f

# All services
docker-compose logs --tail=50 -f
```

---

## 🧪 API Testing

### Add Staff Member
```bash
curl -X POST http://localhost:8080/api/hr/staff \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP003",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@edusync.com",
    "phone": "+79001234567",
    "hireDate": "2024-10-05",
    "employmentType": "FULL_TIME",
    "position": "Teacher",
    "departmentId": 1,
    "salary": 80000.00,
    "status": "ACTIVE"
  }' | jq
```

### Add Student
```bash
curl -X POST http://localhost:8080/api/student/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2025002",
    "firstName": "Maria",
    "lastName": "Garcia",
    "email": "maria.garcia@university.edu",
    "phone": "(555) 987-6543",
    "address": "456 University Ave",
    "dateOfBirth": "2006-08-20",
    "enrollmentDate": "2024-09-01",
    "program": "Engineering",
    "currentSemester": 1,
    "gpa": 3.9,
    "attendancePercentage": 98,
    "status": "ACTIVE",
    "feeStatus": "PAID",
    "lastPaymentDate": "2024-09-01"
  }' | jq
```

### Add Transaction (Finance)
```bash
curl -X POST http://localhost:8080/api/finance/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN005",
    "type": "INCOME",
    "amount": 5000,
    "category": "Tuition Fees",
    "subCategory": "Grade 1",
    "date": "2025-10-06",
    "description": "Tuition fee payment for October 2025",
    "status": "COMPLETED",
    "paymentMethod": "Bank Transfer",
    "notes": "Payment received on time"
  }' | jq
```

---

## 🏥 System Health Check

```bash
# Gateway
curl http://localhost:8080/actuator/health

# Eureka (Service Discovery)
curl http://localhost:8761

# Postgres
docker exec erp-system-postgres-1 pg_isready
```

---

## 📁 Database (PostgreSQL)

```bash
# Connect to database
docker exec -it erp-system-postgres-1 psql -U edusync -d edusync_erp

# View tables
\dt

# View staff
SELECT * FROM staff;

# View students
SELECT * FROM students;

# Total users (number)
docker exec erp-system-postgres-1 psql -U edusync -d edusync_erp -c "SELECT COUNT(*) as total_users FROM users;"

# Users details
docker exec erp-system-postgres-1 psql -U edusync -d edusync_erp -c "SELECT id, name, email, role, enabled, created_at FROM users ORDER BY created_at DESC;"

# User roles
docker exec erp-system-postgres-1 psql -U edusync -d edusync_erp -c "SELECT role, COUNT(*) as count, COUNT(CASE WHEN enabled = true THEN 1 END) as enabled_count FROM users GROUP BY role;"

#Exit
\q
```

---

## 🌐 Service Ports

- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:8080
- **Eureka**: http://localhost:8761
- **Finance**: http://localhost:8081
- **HR**: http://localhost:8082
- **Student**: http://localhost:8083
- **Sales**: http://localhost:8084
- **Academics**: http://localhost:8085
- **Auth**: http://localhost:8086
- **PostgreSQL**: localhost:5432

---

## ✅ Quick Check

```bash
# 1. Is backend running?
docker-compose ps

# 2. Is gateway accessible?
curl http://localhost:8080/actuator/health

# 3. Is there data?
curl -s http://localhost:8080/api/hr/staff | jq length
curl -s http://localhost:8080/api/student/students | jq length

# 4. Is frontend working?
# Open browser: http://localhost:5173
```

---

## 🔄 Full System Restart

```bash
# Stop all
docker-compose down

# Remove volumes (WARNING: will delete all data!)
docker-compose down -v

# Start fresh
docker-compose up -d

# Check status
docker-compose ps
```

