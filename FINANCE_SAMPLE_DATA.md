# 💰 Finance Module - Sample Data Documentation

## 📊 Overview
This document describes the sample financial data created for **Alex Thompson** (Student ID: 2025001, Database ID: 1) in the Finance module.

---

## 🎓 Student Information
- **Name**: Alex Thompson
- **Student ID**: 2025001
- **Database ID**: 1
- **Email**: alex.thompson@university.edu
- **Program**: Computer Science
- **Status**: ACTIVE

---

## 💳 Financial Transactions Created

### Summary
- **Total Transactions**: 9
- **Total Income**: $31,480.00
- **Total Expenses (Scholarships/Discounts)**: $4,000.00
- **Net Balance**: $27,480.00
- **Date Range**: September 1, 2025 - October 5, 2025

---

## 📝 Detailed Transaction List

### 1️⃣ Tuition Fee Invoice
- **Transaction ID**: TXN-2025-001
- **Date**: September 1, 2025
- **Type**: INCOME
- **Category**: Tuition → Semester Fee
- **Amount**: $15,000.00
- **Status**: COMPLETED
- **Payment Method**: Bank Transfer
- **Reference**: INV-2025-FALL-001
- **Description**: Fall 2025 Semester Tuition Fee
- **Notes**: Tuition fee for Computer Science program - Fall 2025 semester

---

### 2️⃣ Tuition Payment Received
- **Transaction ID**: TXN-2025-002
- **Date**: September 5, 2025
- **Type**: INCOME
- **Category**: Tuition → Payment
- **Amount**: $15,000.00
- **Status**: COMPLETED
- **Payment Method**: Bank Transfer
- **Reference**: PAY-2025-001
- **Description**: Tuition Payment Received from Alex Thompson
- **Notes**: Full payment received for Fall 2025 semester

---

### 3️⃣ Academic Excellence Scholarship
- **Transaction ID**: TXN-2025-003
- **Date**: September 10, 2025
- **Type**: EXPENSE (Scholarship)
- **Category**: Scholarship → Merit-Based
- **Amount**: $2,500.00
- **Status**: COMPLETED
- **Payment Method**: Bank Transfer
- **Reference**: SCH-2025-001
- **Description**: Academic Excellence Scholarship - Fall 2025
- **Notes**: Scholarship awarded for maintaining GPA 3.8 in previous semester

---

### 4️⃣ Library Access Fee
- **Transaction ID**: TXN-2025-004
- **Date**: September 15, 2025
- **Type**: INCOME
- **Category**: Fees → Library
- **Amount**: $150.00
- **Status**: COMPLETED
- **Payment Method**: Credit Card
- **Reference**: LIB-2025-001
- **Description**: Library Access Fee - Fall 2025
- **Notes**: Annual library membership and digital resources access

---

### 5️⃣ Computer Lab Fee
- **Transaction ID**: TXN-2025-005
- **Date**: September 20, 2025
- **Type**: INCOME
- **Category**: Fees → Laboratory
- **Amount**: $450.00
- **Status**: COMPLETED
- **Payment Method**: Debit Card
- **Reference**: LAB-CS-2025-001
- **Description**: Computer Lab Fee - Fall 2025
- **Notes**: Computer Science lab equipment and software license fee

---

### 6️⃣ Sports Activity Discount
- **Transaction ID**: TXN-2025-006
- **Date**: September 25, 2025
- **Type**: EXPENSE (Discount)
- **Category**: Discount → Sports
- **Amount**: $500.00
- **Status**: COMPLETED
- **Payment Method**: Credit Adjustment
- **Reference**: DISC-SPORT-2025-001
- **Description**: University Basketball Team Discount
- **Notes**: Discount granted for representing university in basketball championship

---

### 7️⃣ Student Activity Fee
- **Transaction ID**: TXN-2025-007
- **Date**: October 1, 2025
- **Type**: INCOME
- **Category**: Fees → Student Activities
- **Amount**: $200.00
- **Status**: COMPLETED
- **Payment Method**: Cash
- **Reference**: SAF-2025-001
- **Description**: Student Activity Fee - Fall 2025
- **Notes**: Fee for student clubs, events, and campus activities

---

### 8️⃣ Textbook Purchase
- **Transaction ID**: TXN-2025-008
- **Date**: October 3, 2025
- **Type**: INCOME
- **Category**: Materials → Textbooks
- **Amount**: $680.00
- **Status**: COMPLETED
- **Payment Method**: Credit Card
- **Reference**: BOOK-2025-001
- **Description**: Required Textbooks - Fall 2025
- **Notes**: Algorithms, Database Systems, and Web Development textbooks

---

### 9️⃣ Financial Aid Grant
- **Transaction ID**: TXN-2025-009
- **Date**: October 5, 2025
- **Type**: EXPENSE (Scholarship)
- **Category**: Scholarship → Need-Based
- **Amount**: $1,000.00
- **Status**: COMPLETED
- **Payment Method**: Bank Transfer
- **Reference**: SCH-NEED-2025-001
- **Description**: Financial Aid Grant - Fall 2025
- **Notes**: Need-based financial aid for academic year 2025-2026

---

## 📊 Financial Summary by Category

### Income Breakdown
| Category | Sub-Category | Amount | Percentage |
|----------|--------------|--------|------------|
| **Tuition** | Semester Fee | $15,000.00 | 47.65% |
| **Tuition** | Payment | $15,000.00 | 47.65% |
| **Fees** | Library | $150.00 | 0.48% |
| **Fees** | Laboratory | $450.00 | 1.43% |
| **Fees** | Student Activities | $200.00 | 0.64% |
| **Materials** | Textbooks | $680.00 | 2.16% |
| **TOTAL INCOME** | | **$31,480.00** | **100%** |

### Expenses Breakdown (Scholarships & Discounts)
| Category | Sub-Category | Amount | Percentage |
|----------|--------------|--------|------------|
| **Scholarship** | Merit-Based | $2,500.00 | 62.5% |
| **Scholarship** | Need-Based | $1,000.00 | 25.0% |
| **Discount** | Sports | $500.00 | 12.5% |
| **TOTAL EXPENSES** | | **$4,000.00** | **100%** |

---

## 🔍 How to View Data

### Via API (curl commands)

```bash
# Get all transactions
curl http://localhost:8080/api/finance/transactions

# Get transactions for specific student (Alex Thompson, ID=1)
curl http://localhost:8080/api/finance/transactions | jq '.[] | select(.studentId == 1)'

# Get Finance statistics
curl http://localhost:8080/api/finance/stats

# Get transactions by category
curl http://localhost:8080/api/finance/transactions/category/Tuition
curl http://localhost:8080/api/finance/transactions/category/Scholarship
curl http://localhost:8080/api/finance/transactions/category/Fees
```

### Via Database

```bash
# View all transactions for Alex Thompson
docker exec erp-system-postgres-1 psql -U edusync -d edusync_erp -c \
  "SELECT transaction_id, date, category, sub_category, type, amount, description, status 
   FROM transactions 
   WHERE student_id = 1 
   ORDER BY date;"

# Get financial summary
docker exec erp-system-postgres-1 psql -U edusync -d edusync_erp -c \
  "SELECT 
     type,
     category,
     SUM(amount) as total_amount,
     COUNT(*) as transaction_count
   FROM transactions 
   WHERE student_id = 1 
   GROUP BY type, category 
   ORDER BY type, total_amount DESC;"
```

### Via Frontend
1. Open frontend: `http://localhost:5173`
2. Navigate to **Finance** module (click on "Finance" in sidebar, NOT on sub-sections)
3. You will see **Finance Overview** - the main finance dashboard with:
   - **Statistics cards** at the top (Total Revenue, Total Expenses, Net Profit, Total Balance)
   - **Recent Transactions table** with ALL transactions sorted by date (newest first)
   - **Student column** showing which transactions belong to Alex Thompson (highlighted in blue)
4. **Optional**: Check other Finance sections:
   - **Tuition & Fees** tab for tuition management
   - **Scholarships & Discounts** tab for scholarship/discount data
   - **Salaries & Payroll** tab for staff payments
   - **Department Expenses** tab for department budgets

---

## 🎯 Data Integrity

All transactions are linked to **real student data**:
- ✅ Student ID 1 (Alex Thompson) exists in `students` table
- ✅ Student is ACTIVE
- ✅ All transactions have valid categories and types
- ✅ All amounts are realistic
- ✅ Dates follow chronological order (Sept-Oct 2025)
- ✅ All transactions are COMPLETED
- ✅ Each transaction has unique transaction_id
- ✅ References and notes provide audit trail

---

## 📈 Finance Module Updates

After adding this data, the Finance module now displays:
- **Total Revenue**: Includes all tuition, fees, and material income
- **Total Expenses**: Includes scholarships and discounts
- **Recent Transactions**: Shows all 9 transactions in chronological order
- **Student Financial Profile**: Alex Thompson's complete financial history

---

## 🚀 Next Steps

To add more sample data:
1. Create additional students via HR module
2. Generate transactions for new students
3. Add staff salary payments
4. Create department budgets
5. Add more scholarship programs

---

**Created**: October 6, 2025  
**Student**: Alex Thompson (2025001)  
**Database**: edusync_erp  
**Module**: Finance

