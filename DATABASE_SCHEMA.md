# 🗄️ EduSync ERP - Схема Централизованной Базы Данных

## Архитектура
- **База данных**: PostgreSQL 15
- **Имя БД**: `edusync_erp`
- **Подход**: Одна централизованная база для всех микросервисов
- **ORM**: Hibernate/JPA с `ddl-auto: update`

---

## 🔐 AUTH MODULE (edusync-auth)

### Таблица: `users`
**Статус**: ✅ Реализовано

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | Уникальный идентификатор |
| name | VARCHAR(100) NOT NULL | Полное имя пользователя |
| email | VARCHAR(100) NOT NULL UNIQUE | Email (используется как username) |
| password | VARCHAR(255) NOT NULL | Хэшированный пароль (BCrypt) |
| role | VARCHAR(50) NOT NULL | Роль: USER, ADMIN |
| enabled | BOOLEAN NOT NULL DEFAULT true | Активен ли аккаунт |
| created_at | TIMESTAMP NOT NULL | Дата создания |
| updated_at | TIMESTAMP | Дата последнего обновления |

**Индексы**:
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- INDEX (role)

---

## 💰 FINANCE MODULE (edusync-finance)

### Таблица: `tuition_fees`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| student_id | BIGINT NOT NULL | FK -> students.id |
| academic_year | VARCHAR(20) NOT NULL | Например: "2024-2025" |
| semester | VARCHAR(20) | "Fall", "Spring", "Summer" |
| total_amount | DECIMAL(10,2) NOT NULL | Общая сумма |
| paid_amount | DECIMAL(10,2) DEFAULT 0 | Оплаченная сумма |
| balance | DECIMAL(10,2) | Остаток (total - paid) |
| due_date | DATE | Срок оплаты |
| status | VARCHAR(20) | PENDING, PAID, OVERDUE, PARTIAL |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `payments`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| tuition_fee_id | BIGINT | FK -> tuition_fees.id (nullable) |
| student_id | BIGINT NOT NULL | FK -> students.id |
| amount | DECIMAL(10,2) NOT NULL | Сумма платежа |
| payment_method | VARCHAR(50) | CASH, CARD, BANK_TRANSFER, CHECK |
| payment_date | DATE NOT NULL | Дата платежа |
| receipt_number | VARCHAR(50) UNIQUE | Номер квитанции |
| notes | TEXT | Примечания |
| created_by | BIGINT | FK -> users.id |
| created_at | TIMESTAMP NOT NULL | |

### Таблица: `scholarships`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| name | VARCHAR(200) NOT NULL | Название стипендии |
| description | TEXT | Описание |
| amount | DECIMAL(10,2) NOT NULL | Сумма |
| type | VARCHAR(50) | PERCENTAGE, FIXED_AMOUNT |
| eligibility_criteria | TEXT | Критерии получения |
| start_date | DATE | |
| end_date | DATE | |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `student_scholarships`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| student_id | BIGINT NOT NULL | FK -> students.id |
| scholarship_id | BIGINT NOT NULL | FK -> scholarships.id |
| awarded_date | DATE NOT NULL | |
| amount | DECIMAL(10,2) NOT NULL | Присужденная сумма |
| academic_year | VARCHAR(20) | |
| status | VARCHAR(20) | ACTIVE, SUSPENDED, COMPLETED |
| created_at | TIMESTAMP NOT NULL | |

### Таблица: `expenses`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| category | VARCHAR(100) NOT NULL | SALARY, UTILITIES, SUPPLIES, MAINTENANCE, etc |
| department_id | BIGINT | FK -> departments.id |
| description | TEXT NOT NULL | |
| amount | DECIMAL(10,2) NOT NULL | |
| expense_date | DATE NOT NULL | |
| vendor | VARCHAR(200) | Поставщик/Получатель |
| invoice_number | VARCHAR(50) | |
| payment_status | VARCHAR(20) | PENDING, PAID, OVERDUE |
| approved_by | BIGINT | FK -> users.id |
| created_by | BIGINT | FK -> users.id |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `budgets`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| department_id | BIGINT | FK -> departments.id |
| fiscal_year | VARCHAR(20) NOT NULL | |
| category | VARCHAR(100) NOT NULL | |
| allocated_amount | DECIMAL(10,2) NOT NULL | |
| spent_amount | DECIMAL(10,2) DEFAULT 0 | |
| remaining_amount | DECIMAL(10,2) | |
| status | VARCHAR(20) | ACTIVE, EXCEEDED, COMPLETED |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

---

## 👥 HR MODULE (edusync-hr)

### Таблица: `staff`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| user_id | BIGINT UNIQUE | FK -> users.id (nullable, если есть аккаунт) |
| employee_id | VARCHAR(50) UNIQUE NOT NULL | Табельный номер |
| first_name | VARCHAR(100) NOT NULL | |
| last_name | VARCHAR(100) NOT NULL | |
| email | VARCHAR(100) UNIQUE NOT NULL | |
| phone | VARCHAR(20) | |
| date_of_birth | DATE | |
| gender | VARCHAR(10) | |
| address | TEXT | |
| hire_date | DATE NOT NULL | Дата найма |
| employment_type | VARCHAR(50) | FULL_TIME, PART_TIME, CONTRACT |
| position | VARCHAR(100) NOT NULL | Должность |
| department_id | BIGINT | FK -> departments.id |
| salary | DECIMAL(10,2) | |
| status | VARCHAR(20) | ACTIVE, ON_LEAVE, TERMINATED |
| termination_date | DATE | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `departments`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| name | VARCHAR(100) NOT NULL UNIQUE | |
| code | VARCHAR(20) UNIQUE | Код отдела |
| description | TEXT | |
| head_of_department_id | BIGINT | FK -> staff.id |
| parent_department_id | BIGINT | FK -> departments.id (для иерархии) |
| budget | DECIMAL(12,2) | Годовой бюджет |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `attendance`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| staff_id | BIGINT NOT NULL | FK -> staff.id |
| date | DATE NOT NULL | |
| check_in_time | TIME | |
| check_out_time | TIME | |
| status | VARCHAR(20) | PRESENT, ABSENT, LATE, HALF_DAY, LEAVE |
| hours_worked | DECIMAL(4,2) | |
| notes | TEXT | |
| created_at | TIMESTAMP NOT NULL | |

### Таблица: `leave_requests`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| staff_id | BIGINT NOT NULL | FK -> staff.id |
| leave_type | VARCHAR(50) | SICK, VACATION, PERSONAL, MATERNITY, etc |
| start_date | DATE NOT NULL | |
| end_date | DATE NOT NULL | |
| days_count | INTEGER | |
| reason | TEXT | |
| status | VARCHAR(20) | PENDING, APPROVED, REJECTED, CANCELLED |
| approved_by | BIGINT | FK -> users.id |
| approval_date | DATE | |
| notes | TEXT | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `payroll`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| staff_id | BIGINT NOT NULL | FK -> staff.id |
| pay_period_start | DATE NOT NULL | |
| pay_period_end | DATE NOT NULL | |
| base_salary | DECIMAL(10,2) NOT NULL | |
| bonuses | DECIMAL(10,2) DEFAULT 0 | |
| deductions | DECIMAL(10,2) DEFAULT 0 | |
| tax | DECIMAL(10,2) DEFAULT 0 | |
| net_salary | DECIMAL(10,2) NOT NULL | |
| payment_date | DATE | |
| payment_method | VARCHAR(50) | |
| status | VARCHAR(20) | PENDING, PROCESSED, PAID |
| created_by | BIGINT | FK -> users.id |
| created_at | TIMESTAMP NOT NULL | |

### Таблица: `staff_evaluations`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| staff_id | BIGINT NOT NULL | FK -> staff.id |
| evaluation_date | DATE NOT NULL | |
| evaluator_id | BIGINT | FK -> staff.id |
| period_start | DATE | |
| period_end | DATE | |
| performance_score | DECIMAL(3,2) | Например: 4.5 из 5 |
| strengths | TEXT | |
| areas_for_improvement | TEXT | |
| goals | TEXT | |
| comments | TEXT | |
| status | VARCHAR(20) | DRAFT, COMPLETED, REVIEWED |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `staff_documents`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| staff_id | BIGINT NOT NULL | FK -> staff.id |
| document_type | VARCHAR(100) | CONTRACT, RESUME, ID_COPY, CERTIFICATE, etc |
| document_name | VARCHAR(255) NOT NULL | |
| file_path | VARCHAR(500) NOT NULL | Путь к файлу |
| file_size | BIGINT | Размер в байтах |
| upload_date | DATE NOT NULL | |
| expiry_date | DATE | Для документов с истечением срока |
| uploaded_by | BIGINT | FK -> users.id |
| notes | TEXT | |
| created_at | TIMESTAMP NOT NULL | |

---

## 🎓 STUDENT MODULE (edusync-student)

### Таблица: `students`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| user_id | BIGINT UNIQUE | FK -> users.id (если есть аккаунт) |
| student_number | VARCHAR(50) UNIQUE NOT NULL | Студенческий билет |
| first_name | VARCHAR(100) NOT NULL | |
| last_name | VARCHAR(100) NOT NULL | |
| email | VARCHAR(100) UNIQUE NOT NULL | |
| phone | VARCHAR(20) | |
| date_of_birth | DATE | |
| gender | VARCHAR(10) | |
| address | TEXT | |
| emergency_contact_name | VARCHAR(200) | |
| emergency_contact_phone | VARCHAR(20) | |
| enrollment_date | DATE NOT NULL | |
| program_id | BIGINT | FK -> programs.id |
| academic_year | VARCHAR(20) | |
| status | VARCHAR(20) | ACTIVE, GRADUATED, SUSPENDED, WITHDRAWN |
| gpa | DECIMAL(3,2) | |
| graduation_date | DATE | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `student_documents`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| student_id | BIGINT NOT NULL | FK -> students.id |
| document_type | VARCHAR(100) | TRANSCRIPT, ID_COPY, PHOTO, CERTIFICATE, etc |
| document_name | VARCHAR(255) NOT NULL | |
| file_path | VARCHAR(500) NOT NULL | |
| file_size | BIGINT | |
| upload_date | DATE NOT NULL | |
| uploaded_by | BIGINT | FK -> users.id |
| notes | TEXT | |
| created_at | TIMESTAMP NOT NULL | |

---

## 📚 ACADEMICS MODULE (edusync-academics)

### Таблица: `programs`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| name | VARCHAR(200) NOT NULL | Название программы |
| code | VARCHAR(20) UNIQUE | |
| degree_type | VARCHAR(50) | BACHELOR, MASTER, PHD, DIPLOMA |
| department_id | BIGINT | FK -> departments.id |
| duration_years | INTEGER | |
| credits_required | INTEGER | |
| description | TEXT | |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `courses`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| code | VARCHAR(20) UNIQUE NOT NULL | Код курса |
| name | VARCHAR(200) NOT NULL | |
| description | TEXT | |
| credits | INTEGER NOT NULL | |
| department_id | BIGINT | FK -> departments.id |
| level | VARCHAR(20) | BEGINNER, INTERMEDIATE, ADVANCED |
| prerequisites | TEXT | |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `course_offerings`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| course_id | BIGINT NOT NULL | FK -> courses.id |
| instructor_id | BIGINT | FK -> staff.id |
| academic_year | VARCHAR(20) NOT NULL | |
| semester | VARCHAR(20) NOT NULL | |
| section | VARCHAR(10) | |
| schedule | TEXT | JSON или текст с расписанием |
| room | VARCHAR(50) | |
| capacity | INTEGER | |
| enrolled_count | INTEGER DEFAULT 0 | |
| status | VARCHAR(20) | OPEN, CLOSED, CANCELLED |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `enrollments`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| student_id | BIGINT NOT NULL | FK -> students.id |
| course_offering_id | BIGINT NOT NULL | FK -> course_offerings.id |
| enrollment_date | DATE NOT NULL | |
| status | VARCHAR(20) | ENROLLED, COMPLETED, DROPPED, FAILED |
| grade | VARCHAR(5) | A+, A, B+, B, C+, C, D, F |
| grade_points | DECIMAL(3,2) | |
| attendance_percentage | DECIMAL(5,2) | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `assignments`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| course_offering_id | BIGINT NOT NULL | FK -> course_offerings.id |
| title | VARCHAR(255) NOT NULL | |
| description | TEXT | |
| max_points | DECIMAL(5,2) | |
| due_date | TIMESTAMP | |
| created_by | BIGINT | FK -> users.id |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `submissions`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| assignment_id | BIGINT NOT NULL | FK -> assignments.id |
| student_id | BIGINT NOT NULL | FK -> students.id |
| submission_date | TIMESTAMP NOT NULL | |
| file_path | VARCHAR(500) | |
| content | TEXT | |
| points_earned | DECIMAL(5,2) | |
| feedback | TEXT | |
| graded_by | BIGINT | FK -> users.id |
| graded_at | TIMESTAMP | |
| status | VARCHAR(20) | SUBMITTED, GRADED, LATE |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

---

## 💼 SALES MODULE (edusync-sales)

### Таблица: `leads`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| first_name | VARCHAR(100) NOT NULL | |
| last_name | VARCHAR(100) NOT NULL | |
| email | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| source | VARCHAR(50) | WEBSITE, REFERRAL, SOCIAL_MEDIA, EVENT, etc |
| status | VARCHAR(20) | NEW, CONTACTED, QUALIFIED, CONVERTED, LOST |
| program_interest_id | BIGINT | FK -> programs.id |
| assigned_to | BIGINT | FK -> users.id (sales rep) |
| notes | TEXT | |
| lead_score | INTEGER | 0-100 |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `opportunities`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| lead_id | BIGINT | FK -> leads.id |
| name | VARCHAR(255) NOT NULL | |
| stage | VARCHAR(50) | PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST |
| expected_value | DECIMAL(10,2) | |
| probability | INTEGER | 0-100% |
| expected_close_date | DATE | |
| actual_close_date | DATE | |
| assigned_to | BIGINT | FK -> users.id |
| notes | TEXT | |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

### Таблица: `sales_activities`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| lead_id | BIGINT | FK -> leads.id |
| opportunity_id | BIGINT | FK -> opportunities.id |
| activity_type | VARCHAR(50) | CALL, EMAIL, MEETING, NOTE, TASK |
| subject | VARCHAR(255) | |
| description | TEXT | |
| activity_date | TIMESTAMP NOT NULL | |
| duration_minutes | INTEGER | |
| outcome | VARCHAR(50) | |
| created_by | BIGINT | FK -> users.id |
| created_at | TIMESTAMP NOT NULL | |

### Таблица: `email_templates`
**Статус**: ❌ Требуется реализация

| Поле | Тип | Описание |
|------|-----|----------|
| id | BIGSERIAL PRIMARY KEY | |
| name | VARCHAR(200) NOT NULL | |
| subject | VARCHAR(255) | |
| body | TEXT NOT NULL | |
| category | VARCHAR(50) | FOLLOW_UP, WELCOME, PROMOTIONAL, etc |
| is_active | BOOLEAN DEFAULT true | |
| created_by | BIGINT | FK -> users.id |
| created_at | TIMESTAMP NOT NULL | |
| updated_at | TIMESTAMP | |

---

## 🔗 Связи между модулями

### Cross-Module Foreign Keys:
- `staff.user_id` -> `users.id` (Auth)
- `students.user_id` -> `users.id` (Auth)
- `staff.department_id` -> `departments.id` (HR)
- `tuition_fees.student_id` -> `students.id` (Student)
- `payments.student_id` -> `students.id` (Student)
- `enrollments.student_id` -> `students.id` (Student)
- `enrollments.course_offering_id` -> `course_offerings.id` (Academics)
- `course_offerings.instructor_id` -> `staff.id` (HR)
- `leads.program_interest_id` -> `programs.id` (Academics)
- `expenses.department_id` -> `departments.id` (HR)

---

## 🚀 План Реализации

### Фаза 1: Core Entities (Приоритет HIGH)
1. ✅ `users` (Auth) - **ГОТОВО**
2. `departments` (HR)
3. `staff` (HR)
4. `students` (Student)
5. `programs` (Academics)

### Фаза 2: Academic & Finance (Приоритет MEDIUM)
6. `courses` (Academics)
7. `course_offerings` (Academics)
8. `enrollments` (Academics)
9. `tuition_fees` (Finance)
10. `payments` (Finance)

### Фаза 3: HR & Payroll (Приоритет MEDIUM)
11. `attendance` (HR)
12. `leave_requests` (HR)
13. `payroll` (HR)
14. `staff_evaluations` (HR)
15. `scholarships` (Finance)

### Фаза 4: Sales & Advanced Features (Приоритет LOW)
16. `leads` (Sales)
17. `opportunities` (Sales)
18. `sales_activities` (Sales)
19. `email_templates` (Sales)
20. `assignments` & `submissions` (Academics)

### Фаза 5: Supporting Tables (Приоритет LOW)
21. `student_documents` (Student)
22. `staff_documents` (HR)
23. `budgets` (Finance)
24. `expenses` (Finance)

---

## 🔒 Безопасность и Права Доступа

### Рекомендации:
1. **Row Level Security (RLS)** - рассмотреть для мультитенантности (если планируется несколько учебных заведений)
2. **Audit Trail** - добавить `created_by`, `updated_by` для критичных таблиц
3. **Soft Delete** - использовать `deleted_at` вместо физического удаления для важных данных
4. **Encryption** - зашифровать чувствительные данные (SSN, salary, etc)

---

## 📈 Индексы для Производительности

### Рекомендуемые индексы:
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Students
CREATE INDEX idx_students_student_number ON students(student_number);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_program_id ON students(program_id);

-- Staff
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_staff_department_id ON staff(department_id);
CREATE INDEX idx_staff_status ON staff(status);

-- Enrollments
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_offering_id ON enrollments(course_offering_id);

-- Tuition Fees
CREATE INDEX idx_tuition_fees_student_id ON tuition_fees(student_id);
CREATE INDEX idx_tuition_fees_status ON tuition_fees(status);
CREATE INDEX idx_tuition_fees_due_date ON tuition_fees(due_date);

-- Payments
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Attendance
CREATE INDEX idx_attendance_staff_id_date ON attendance(staff_id, date);

-- Leads
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
```

---

## 💾 Миграция и Версионирование

### Рекомендуется использовать:
- **Flyway** или **Liquibase** для версионирования схемы БД
- Все изменения схемы через migration scripts
- Не полагаться только на `ddl-auto: update` в production

---

## 🔄 Backup и Recovery

### Стратегия:
- **Ежедневные бэкапы**: Full backup PostgreSQL
- **Point-in-Time Recovery**: Включить WAL archiving
- **Тестовые восстановления**: Ежемесячно
- **Retention**: 30 дней ежедневных, 12 месяцев месячных

---

## 📊 Мониторинг

### Метрики для отслеживания:
- Database size growth
- Query performance (slow queries)
- Connection pool utilization
- Index usage statistics
- Lock contention

---

**Последнее обновление**: October 5, 2025

