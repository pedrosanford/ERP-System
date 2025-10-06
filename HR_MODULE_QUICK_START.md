# 🚀 HR Module - Quick Start Guide

## ✅ Что было реализовано

### База данных готова к использованию! 

**7 таблиц HR модуля** будут автоматически созданы в вашей централизованной БД `edusync_erp`:
- ✅ `departments` - Отделы
- ✅ `staff` - Сотрудники  
- ✅ `attendance` - Посещаемость
- ✅ `leave_requests` - Запросы на отпуск
- ✅ `payroll` - Зарплатные ведомости
- ✅ `staff_evaluations` - Оценки сотрудников
- ✅ `staff_documents` - Документы сотрудников

---

## 🏃 Быстрый запуск

### Шаг 1: Запустите PostgreSQL
```bash
cd /Users/stam7/Documents/Coding\ Workspace/ERP/ERP-System
docker-compose up postgres -d
```

### Шаг 2: Запустите HR сервис
```bash
cd services/edusync-hr
mvn clean install
mvn spring-boot:run
```

### Шаг 3: Проверьте работу
```bash
# Health check
curl http://localhost:8082/api/hr/health

# Получить статистику (будет пустая на старте)
curl http://localhost:8082/api/hr/stats
```

---

## 📝 Тестируем API

### 1. Создаем отдел
```bash
curl -X POST http://localhost:8082/api/hr/departments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IT Department",
    "code": "IT",
    "description": "Information Technology",
    "budget": 500000.00,
    "isActive": true
  }'
```

**Ответ:**
```json
{
  "id": 1,
  "name": "IT Department",
  "code": "IT",
  "description": "Information Technology",
  "budget": 500000.00,
  "isActive": true,
  "createdAt": "2024-10-05T10:30:00",
  "updatedAt": "2024-10-05T10:30:00"
}
```

### 2. Создаем сотрудника
```bash
curl -X POST http://localhost:8082/api/hr/staff \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivanov@edusync.com",
    "phone": "+79001234567",
    "hireDate": "2024-10-01",
    "position": "Software Engineer",
    "departmentId": 1,
    "salary": 120000.00,
    "employmentType": "FULL_TIME",
    "status": "ACTIVE"
  }'
```

### 3. Получаем всех сотрудников
```bash
curl http://localhost:8082/api/hr/staff
```

### 4. Получаем сотрудников отдела
```bash
curl http://localhost:8082/api/hr/staff/department/1
```

### 5. Смотрим обновленную статистику
```bash
curl http://localhost:8082/api/hr/stats
```

**Ответ:**
```json
{
  "totalStaff": 1,
  "activeStaff": 1,
  "newHires": 1,
  "departments": 1,
  "averageSalary": 120000.00,
  "pendingLeaveRequests": 0,
  "pendingPayrolls": 0
}
```

---

## 🗄️ Проверка базы данных

### Подключитесь к PostgreSQL:
```bash
docker exec -it $(docker ps -qf "name=postgres") psql -U edusync -d edusync_erp
```

### Проверьте созданные таблицы:
```sql
-- Список всех таблиц HR модуля
\dt

-- Посмотреть структуру таблицы departments
\d departments

-- Посмотреть структуру таблицы staff
\d staff

-- Посмотреть данные
SELECT * FROM departments;
SELECT * FROM staff;
```

---

## 📊 Полный список API endpoints

### Health & Stats
- `GET /api/hr/health` - Health check
- `GET /api/hr/stats` - Общая статистика

### Departments (Отделы)
- `GET /api/hr/departments` - Все отделы
- `GET /api/hr/departments/active` - Активные отделы
- `GET /api/hr/departments/{id}` - Отдел по ID
- `GET /api/hr/departments/code/{code}` - Отдел по коду
- `GET /api/hr/departments/{id}/subdepartments` - Подотделы
- `POST /api/hr/departments` - Создать отдел
- `PUT /api/hr/departments/{id}` - Обновить отдел
- `DELETE /api/hr/departments/{id}` - Деактивировать отдел
- `GET /api/hr/departments/{id}/stats` - Статистика отдела

### Staff (Сотрудники)
- `GET /api/hr/staff` - Все сотрудники
- `GET /api/hr/staff/active` - Активные сотрудники
- `GET /api/hr/staff/{id}` - Сотрудник по ID
- `GET /api/hr/staff/employee/{employeeId}` - По табельному номеру
- `GET /api/hr/staff/email/{email}` - По email
- `GET /api/hr/staff/department/{departmentId}` - Сотрудники отдела
- `POST /api/hr/staff` - Создать сотрудника
- `PUT /api/hr/staff/{id}` - Обновить сотрудника
- `PUT /api/hr/staff/{id}/terminate` - Уволить сотрудника
- `DELETE /api/hr/staff/{id}` - Удалить сотрудника

---

## 🔗 Интеграция с Frontend

В вашем React приложении (`frontend/edusync-web`) можно создать HR секцию:

```typescript
// api/hrService.ts
const API_URL = 'http://localhost:8082/api/hr';

export const hrService = {
  // Departments
  getAllDepartments: () => axios.get(`${API_URL}/departments`),
  createDepartment: (data) => axios.post(`${API_URL}/departments`, data),
  
  // Staff
  getAllStaff: () => axios.get(`${API_URL}/staff`),
  getStaffByDepartment: (deptId) => axios.get(`${API_URL}/staff/department/${deptId}`),
  createStaff: (data) => axios.post(`${API_URL}/staff`, data),
  
  // Stats
  getHrStats: () => axios.get(`${API_URL}/stats`),
};
```

---

## ✨ Следующие шаги

### Можно добавить endpoints для:
1. **Attendance** - управление посещаемостью
2. **LeaveRequests** - управление отпусками
3. **Payroll** - управление зарплатами
4. **StaffEvaluations** - оценки сотрудников
5. **StaffDocuments** - документы сотрудников

### Пример для Attendance:
```bash
# Отметить присутствие
curl -X POST http://localhost:8082/api/hr/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": 1,
    "date": "2024-10-05",
    "checkInTime": "09:00:00",
    "checkOutTime": "18:00:00",
    "status": "PRESENT",
    "hoursWorked": 8.0
  }'
```

---

## 📖 Документация

Полная документация находится в:
- **DATABASE_SCHEMA.md** - Полная схема всех таблиц ERP системы
- **HR_MODULE_IMPLEMENTATION.md** - Детальная документация HR модуля

---

## 🎯 Архитектура базы данных

```
edusync_erp (PostgreSQL Database)
│
├── users (Auth Module) ← УЖЕ ЕСТЬ
│
├── departments (HR Module) ← СОЗДАНО
├── staff (HR Module) ← СОЗДАНО
├── attendance (HR Module) ← СОЗДАНО
├── leave_requests (HR Module) ← СОЗДАНО
├── payroll (HR Module) ← СОЗДАНО
├── staff_evaluations (HR Module) ← СОЗДАНО
└── staff_documents (HR Module) ← СОЗДАНО
```

**Все модули используют ОДНУ централизованную базу данных!** ✅

---

**Готово к использованию!** 🎉

Дата: October 5, 2025

