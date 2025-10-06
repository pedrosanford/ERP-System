# Finance Module Implementation 💰

## Overview
The Finance module manages all financial transactions, accounts, budgets, and provides comprehensive financial statistics for the EduSync ERP system.

## Implementation Date
**October 6, 2025**

## Architecture

### Backend Structure
```
services/edusync-finance/
├── src/main/java/com/edusync/finance/
│   ├── entity/
│   │   ├── Transaction.java      # Financial transactions
│   │   ├── Account.java          # Bank/Cash accounts
│   │   └── Budget.java           # Budget management
│   ├── repository/
│   │   ├── TransactionRepository.java
│   │   ├── AccountRepository.java
│   │   └── BudgetRepository.java
│   ├── service/
│   │   ├── TransactionService.java
│   │   └── FinanceStatsService.java
│   └── controller/
│       └── FinanceController.java
```

### Frontend Structure
```
frontend/edusync-web/src/
├── services/
│   └── financeService.ts         # API integration
└── components/sections/
    ├── Finance.tsx               # Router component
    └── finance/
        ├── FinanceOverview.tsx   # Main dashboard (connected to backend)
        ├── TuitionFees.tsx       # (mock data - to be integrated)
        ├── ScholarshipsDiscounts.tsx
        ├── SalariesPayroll.tsx
        └── DepartmentExpenses.tsx
```

## Database Schema

### Transactions Table
```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(255) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    amount NUMERIC(15,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    sub_category VARCHAR(255),
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    reference VARCHAR(255),
    account_id BIGINT,
    student_id BIGINT,
    staff_id BIGINT,
    status VARCHAR(255) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    payment_method VARCHAR(255),
    created_by VARCHAR(255),
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(255) NOT NULL CHECK (type IN ('CASH', 'BANK', 'CREDIT_CARD', 'PAYPAL', 'OTHER')),
    balance NUMERIC(15,2) NOT NULL,
    currency VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255),
    branch VARCHAR(255),
    description VARCHAR(500),
    status VARCHAR(255) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

### Budgets Table
```sql
CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    spent NUMERIC(15,2) NOT NULL,
    period VARCHAR(255) NOT NULL CHECK (period IN ('MONTHLY', 'QUARTERLY', 'YEARLY')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description VARCHAR(500),
    status VARCHAR(255) NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    alert_threshold INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Base URL
```
http://localhost:8080/api/finance
```

### Statistics
- **GET** `/stats` - Get comprehensive financial statistics

### Transactions
- **GET** `/transactions` - Get all transactions
- **GET** `/transactions/{id}` - Get transaction by ID
- **GET** `/transactions/type/{type}` - Get transactions by type (INCOME/EXPENSE)
- **GET** `/transactions/status/{status}` - Get transactions by status
- **GET** `/transactions/category/{category}` - Get transactions by category
- **GET** `/transactions/date-range?startDate={date}&endDate={date}` - Get transactions in date range
- **GET** `/transactions/recent` - Get recent transactions
- **POST** `/transactions` - Create new transaction
- **PUT** `/transactions/{id}` - Update transaction
- **PUT** `/transactions/{id}/status?status={status}` - Update transaction status
- **DELETE** `/transactions/{id}` - Delete transaction

## Features Implemented

### ✅ Backend
1. **Transaction Management**
   - Complete CRUD operations
   - Transaction categorization
   - Status tracking (PENDING, COMPLETED, CANCELLED)
   - Type classification (INCOME, EXPENSE)
   - Payment method tracking

2. **Financial Statistics**
   - Total revenue calculation
   - Total expenses calculation
   - Net profit calculation
   - Profit margin calculation
   - Month-over-month growth tracking
   - Account balance aggregation

3. **Repository Layer**
   - Custom queries for analytics
   - Date range filtering
   - Type and status filtering
   - Category grouping

### ✅ Frontend
1. **Finance Overview Dashboard**
   - Real-time statistics display
   - Revenue/Expense/Profit cards with growth indicators
   - Recent transactions table
   - Transaction creation dialog
   - Status badges and formatting
   - Currency formatting
   - Date formatting

2. **Transaction Management**
   - Add new transactions
   - Form validation
   - Loading states
   - Error handling
   - Automatic data refresh

## Example Usage

### Create Transaction (via API)
```bash
curl -X POST http://localhost:8080/api/finance/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN001",
    "type": "INCOME",
    "amount": 5000,
    "category": "Tuition Fees",
    "subCategory": "Grade 1",
    "date": "2025-10-01",
    "description": "Tuition fee payment for October 2025",
    "status": "COMPLETED",
    "paymentMethod": "Bank Transfer"
  }'
```

### Get Statistics
```bash
curl http://localhost:8080/api/finance/stats
```

Response:
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

## Running the Module

### Backend
```bash
# Finance service starts automatically with docker-compose
docker-compose up edusync-finance -d

# Check logs
docker-compose logs edusync-finance

# Verify service is registered with Eureka
curl http://localhost:8761/eureka/apps/EDUSYNC-FINANCE
```

### Frontend
The Finance module is accessible from the main navigation menu. The default view shows:
- Financial statistics cards
- Recent transactions table
- "Add Transaction" button for creating new transactions

## Configuration

### Backend Configuration (`application.yml`)
```yaml
server:
  port: 8081

spring:
  application:
    name: edusync-finance
  datasource:
    url: jdbc:postgresql://localhost:5432/edusync_erp
    username: edusync
    password: edusync123
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Frontend Configuration (`.env.local`)
```env
VITE_API_URL=http://localhost:8080
```

## Testing

### Test Data
The system includes sample transactions for testing:
```bash
# View all transactions
curl http://localhost:8080/api/finance/transactions/recent

# View statistics
curl http://localhost:8080/api/finance/stats
```

## Future Enhancements

### Planned Features
1. **Account Management**
   - Create and manage multiple accounts
   - Account balance tracking
   - Account reconciliation

2. **Budget Management**
   - Set budget limits per category
   - Budget alerts and notifications
   - Budget utilization reports

3. **Advanced Reporting**
   - Profit & Loss statements
   - Cash flow analysis
   - Category-wise expense breakdown
   - Trend analysis charts

4. **Integration with Other Modules**
   - Link transactions to students (tuition fees)
   - Link transactions to staff (payroll)
   - Link transactions to departments (expenses)

5. **Payment Processing**
   - Payment gateway integration
   - Recurring payment support
   - Payment reminders
   - Receipt generation

## Notes
- Finance service runs on port **8081**
- All API calls go through the Gateway on port **8080**
- Database tables are auto-created by Hibernate
- CORS is handled by the API Gateway
- All monetary values use `BigDecimal` for precision
- Dates use ISO format (YYYY-MM-DD)
- Frontend uses TypeScript for type safety

## Related Documentation
- [Database Schema](DATABASE_SCHEMA.md)
- [HR Module Implementation](HR_MODULE_IMPLEMENTATION.md)
- [Students Module Integration](STUDENTS_MODULE_INTEGRATION.md)
- [Quick Commands](QUICK_COMMANDS.md)

