import React from 'react';
import TuitionFees from './finance/TuitionFees';
import ScholarshipsDiscounts from './finance/ScholarshipsDiscounts';
import SalariesPayroll from './finance/SalariesPayroll';
import DepartmentExpenses from './finance/DepartmentExpenses';

interface FinanceProps {
  activeSection: string;
}

const Finance: React.FC<FinanceProps> = ({ activeSection }) => {
  // Route to appropriate component based on activeSection
  switch (activeSection) {
    case 'finance-tuition':
      return <TuitionFees />;
    case 'finance-scholarships':
      return <ScholarshipsDiscounts />;
    case 'finance-salaries':
      return <SalariesPayroll />;
    case 'finance-expenses':
      return <DepartmentExpenses />;
    case 'finance':
    default:
      // Default finance dashboard - show tuition fees as the main view
      return <TuitionFees />;
  }
};

export default Finance;
