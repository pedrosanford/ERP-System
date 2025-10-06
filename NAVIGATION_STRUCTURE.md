# 🗺️ Navigation Structure - EduSync ERP System

## 📋 Main Menu Structure

### 1. 🏠 Dashboard
- **Path**: `/dashboard`
- **Description**: Main dashboard with overview stats and recent activity

---

### 2. 💰 Finance
- **Path**: `/finance`
- **Description**: Financial management module
- **Submenu**:
  - **📊 Finance Overview** - Main finance dashboard with statistics and transactions list
  - **💵 Tuition & Fees** - Manage tuition rules, generate invoices, track collections
  - **🏆 Scholarships** - Manage scholarships and discounts
  - **👥 Salaries & Payroll** - Staff salary packages and payroll management
  - **💳 Department Expenses** - Department budgets and expense tracking

---

### 3. 🏢 Sales
- **Path**: `/sales`
- **Description**: Sales and CRM module
- **Submenu**:
  - **🎯 Pipeline** - Sales pipeline and deals management
  - **📧 Email Templates** - Email templates for communication

---

### 4. 👥 HR Management
- **Path**: `/hr`
- **Description**: Human resources and student management
- **Submenu**:
  - **👨‍🎓 Students** - Student records, enrollment, and management
  - **👨‍💼 Staff** - Staff members and employee management
  - **📄 Documents** - HR documents and records
  - **📈 Staff Evaluation** - Staff performance evaluation

---

### 5. ⚙️ Settings
- **Path**: `/settings`
- **Description**: System settings and configuration

---

## 🎯 How to Access Finance Overview

### The Main Finance Dashboard:

1. Click on **"Finance"** in the sidebar (it will expand to show submenu)
2. Click on **"Finance Overview"** (first item in the submenu)
3. You will see:
   - 📊 **Statistics Cards**: Total Revenue, Total Expenses, Net Profit, Total Balance
   - 📋 **Recent Transactions Table**: All transactions sorted by date (newest first)
   - 🏷️ **Student Column**: Shows which transactions are linked to students (e.g., Alex Thompson)

### Alternative: Direct Click
- Click directly on the Finance icon/text in the sidebar (without expanding submenu)
- This will also open Finance Overview by default

---

## 📊 Finance Overview Features

### Statistics Cards (Top Section):
- **Total Revenue**: All income transactions
- **Total Expenses**: All expense transactions (scholarships, salaries, etc.)
- **Net Profit**: Revenue - Expenses
- **Total Balance**: Current account balance

### Transactions Table:
| Column | Description |
|--------|-------------|
| **ID** | Transaction ID (e.g., TXN-2025-001) |
| **Type** | INCOME (green) or EXPENSE (red) |
| **Category** | Tuition, Scholarship, Fees, etc. |
| **Description** | Transaction description |
| **Student** | Student name (if linked) - highlighted in blue |
| **Amount** | Transaction amount with +/- sign |
| **Date** | Transaction date |
| **Status** | PENDING, COMPLETED, or CANCELLED |

---

## 🔄 Current Data

### Finance Module:
- **Total Transactions**: 13
- **Sample Student**: Alex Thompson (2025001)
- **Transaction Categories**: Tuition, Scholarships, Fees, Materials, Discounts
- **Date Range**: September - October 2025

### HR Module:
- **Students**: 1 active student (Alex Thompson)
- **Staff**: 1 active staff member (IT Department)
- **Departments**: 1 department (IT Department)

---

## 🚀 Quick Navigation Tips

1. **Finance Overview is the MAIN finance page** - click it first to see all your financial data
2. **Tuition & Fees** is for managing tuition rules and generating NEW invoices
3. **Scholarships** is for managing scholarship programs
4. **Salaries & Payroll** is for staff salary management
5. **Department Expenses** is for department budget tracking

---

## 📝 Notes

- All Finance sections now use **real data** from the database
- **Data integrity checks** are enabled:
  - Transactions can only be linked to ACTIVE students
  - Scholarships require real student data
  - Salaries require real staff data
  - Department expenses require real department data
- **No mock data** is used anywhere in the system

---

**Last Updated**: October 6, 2025  
**Version**: 1.0  
**Module**: Navigation & Finance

