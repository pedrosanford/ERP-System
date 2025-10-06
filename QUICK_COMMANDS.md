# ERP System - Quick Commands

## 🚀 Запуск системы

### Backend (Docker Compose)
Backend запускается **отдельно** и работает в фоне:

```bash
# Запустить все микросервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Остановить все
docker-compose down
```

### Frontend (React + Vite)
Frontend запускается **отдельно** в режиме разработки:

```bash
# Перейти в папку frontend
cd frontend/edusync-web

# Запустить dev server (http://localhost:5173)
npm run dev

# Остановить: Ctrl+C или Cmd+C
```

**⚠️ ВАЖНО:** Backend и Frontend - это **два разных процесса**!
- Backend: `docker-compose up -d` (порты 8080-8086)
- Frontend: `npm run dev` (порт 5173)

---

## 🔒 Data Integrity & Referential Checks

**ВАЖНО**: Finance модуль теперь включает проверки целостности данных:
- При создании инвойса для студента, вы можете выбрать только **реальных активных студентов** из базы данных
- При создании транзакции с привязкой к студенту, система проверяет что студент существует и активен
- Это предотвращает создание транзакций для несуществующих студентов (например "John Doe" или "Jane Smith")

**Backend валидация**:
- `FinanceService` использует Feign Client для проверки существования студента перед созданием транзакций
- Только `ACTIVE` студенты могут быть привязаны к финансовым транзакциям

---

## 📊 Просмотр данных через API

### Staff Members
```bash
# Все сотрудники
curl -s http://localhost:8080/api/hr/staff | jq

# Только активные
curl -s http://localhost:8080/api/hr/staff/active | jq

# По ID
curl -s http://localhost:8080/api/hr/staff/1 | jq

# HR статистика
curl -s http://localhost:8080/api/hr/stats | jq
```

### Students
```bash
# Все студенты
curl -s http://localhost:8080/api/student/students | jq

# По ID
curl -s http://localhost:8080/api/student/students/1 | jq

# По статусу
curl -s http://localhost:8080/api/student/students/status/ACTIVE | jq

# Статистика студентов
curl -s http://localhost:8080/api/student/stats | jq
```

### Departments
```bash
# Все отделы
curl -s http://localhost:8080/api/hr/departments | jq

# Активные отделы
curl -s http://localhost:8080/api/hr/departments/active | jq
```

### Finance Transactions 💰
```bash
# Все транзакции
curl -s http://localhost:8080/api/finance/transactions | jq

# Последние транзакции
curl -s http://localhost:8080/api/finance/transactions/recent | jq

# По типу (INCOME или EXPENSE)
curl -s http://localhost:8080/api/finance/transactions/type/INCOME | jq
curl -s http://localhost:8080/api/finance/transactions/type/EXPENSE | jq

# По статусу (PENDING, COMPLETED, CANCELLED)
curl -s http://localhost:8080/api/finance/transactions/status/COMPLETED | jq

# По категории
curl -s "http://localhost:8080/api/finance/transactions/category/Tuition%20Fees" | jq

# По ID
curl -s http://localhost:8080/api/finance/transactions/1 | jq

# Финансовая статистика
curl -s http://localhost:8080/api/finance/stats | jq
```

**Пример вывода статистики:**
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

## 🔧 Управление сервисами

### Перезапуск конкретного сервиса (после изменений кода)
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

### Просмотр логов
```bash
# HR Service
docker-compose logs edusync-hr --tail=50 -f

# Student Service
docker-compose logs edusync-student --tail=50 -f

# Finance Service
docker-compose logs edusync-finance --tail=50 -f

# Gateway
docker-compose logs edusync-gateway --tail=50 -f

# Все сервисы
docker-compose logs --tail=50 -f
```

---

## 🧪 Тестирование API

### Добавить Staff Member
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

### Добавить Student
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

### Добавить Transaction (Finance)
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

## 🏥 Проверка здоровья системы

```bash
# Gateway
curl http://localhost:8080/actuator/health

# Eureka (Service Discovery)
curl http://localhost:8761

# Postgres
docker exec erp-system-postgres-1 pg_isready
```

---

## 📁 База данных (PostgreSQL)

```bash
# Подключиться к БД
docker exec -it erp-system-postgres-1 psql -U eduuser -d edusync_erp

# Просмотр таблиц
\dt

# Просмотр staff
SELECT * FROM staff;

# Просмотр students
SELECT * FROM students;

# Выход
\q
```

---

## 🌐 Порты сервисов

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

## ✅ Быстрая проверка

```bash
# 1. Backend работает?
docker-compose ps

# 2. Gateway доступен?
curl http://localhost:8080/actuator/health

# 3. Данные есть?
curl -s http://localhost:8080/api/hr/staff | jq length
curl -s http://localhost:8080/api/student/students | jq length

# 4. Frontend работает?
# Откройте браузер: http://localhost:5173
```

---

## 🔄 Полный перезапуск системы

```bash
# Остановить все
docker-compose down

# Удалить volumes (ВНИМАНИЕ: удалит все данные!)
docker-compose down -v

# Запустить заново
docker-compose up -d

# Проверить статус
docker-compose ps
```

