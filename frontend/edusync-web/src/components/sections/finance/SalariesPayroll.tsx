import React, { useState } from 'react';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiDownload, FiCheckCircle } from 'react-icons/fi';

interface SalaryPackage {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  baseSalary: number;
  allowances: number;
  status: 'Active' | 'Inactive';
}

interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending' | 'Processing';
  paymentDate?: string;
}

interface Deduction {
  id: string;
  type: string;
  amount: number;
  description: string;
}

const SalariesPayroll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'payroll' | 'deductions' | 'payslips'>('setup');
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryPackage | null>(null);

  const [salaryForm, setSalaryForm] = useState({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    baseSalary: '',
    allowances: ''
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    month: '',
    deductions: ''
  });

  // Sample data
  const [salaryPackages, setSalaryPackages] = useState<SalaryPackage[]>([
    {
      id: 'SAL-001',
      employeeName: 'Dr. Sarah Johnson',
      employeeId: 'EMP-001',
      position: 'Mathematics Teacher',
      department: 'Academic',
      baseSalary: 5000,
      allowances: 500,
      status: 'Active'
    },
    {
      id: 'SAL-002',
      employeeName: 'Mr. John Davis',
      employeeId: 'EMP-002',
      position: 'Science Teacher',
      department: 'Academic',
      baseSalary: 4800,
      allowances: 450,
      status: 'Active'
    },
  ]);

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    {
      id: 'PAY-001',
      employeeName: 'Dr. Sarah Johnson',
      employeeId: 'EMP-001',
      month: 'October 2025',
      baseSalary: 5000,
      allowances: 500,
      deductions: 750,
      netSalary: 4750,
      status: 'Paid',
      paymentDate: '2025-10-31'
    },
    {
      id: 'PAY-002',
      employeeName: 'Mr. John Davis',
      employeeId: 'EMP-002',
      month: 'October 2025',
      baseSalary: 4800,
      allowances: 450,
      deductions: 720,
      netSalary: 4530,
      status: 'Processing'
    },
  ]);

  const [deductions] = useState<Deduction[]>([
    { id: 'DED-001', type: 'Tax', amount: 500, description: 'Income Tax' },
    { id: 'DED-002', type: 'Insurance', amount: 150, description: 'Health Insurance' },
    { id: 'DED-003', type: 'Pension', amount: 100, description: 'Retirement Fund' },
  ]);

  const handleAddSalary = () => {
    setEditingSalary(null);
    setSalaryForm({
      employeeName: '',
      employeeId: '',
      position: '',
      department: '',
      baseSalary: '',
      allowances: ''
    });
    setShowSalaryModal(true);
  };

  const handleEditSalary = (pkg: SalaryPackage) => {
    setEditingSalary(pkg);
    setSalaryForm({
      employeeName: pkg.employeeName,
      employeeId: pkg.employeeId,
      position: pkg.position,
      department: pkg.department,
      baseSalary: pkg.baseSalary.toString(),
      allowances: pkg.allowances.toString()
    });
    setShowSalaryModal(true);
  };

  const handleDeleteSalary = (id: string) => {
    if (window.confirm('Are you sure you want to delete this salary package?')) {
      setSalaryPackages(salaryPackages.filter(pkg => pkg.id !== id));
    }
  };

  const handleSaveSalary = () => {
    if (!salaryForm.employeeName || !salaryForm.employeeId || !salaryForm.position ||
        !salaryForm.department || !salaryForm.baseSalary || !salaryForm.allowances) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingSalary) {
      setSalaryPackages(salaryPackages.map(pkg =>
        pkg.id === editingSalary.id
          ? {
              ...pkg,
              ...salaryForm,
              baseSalary: parseFloat(salaryForm.baseSalary),
              allowances: parseFloat(salaryForm.allowances)
            }
          : pkg
      ));
    } else {
      const newPackage: SalaryPackage = {
        id: `SAL-${String(salaryPackages.length + 1).padStart(3, '0')}`,
        employeeName: salaryForm.employeeName,
        employeeId: salaryForm.employeeId,
        position: salaryForm.position,
        department: salaryForm.department,
        baseSalary: parseFloat(salaryForm.baseSalary),
        allowances: parseFloat(salaryForm.allowances),
        status: 'Active'
      };
      setSalaryPackages([...salaryPackages, newPackage]);
    }
    setShowSalaryModal(false);
  };

  const handleProcessPayroll = () => {
    setPayrollForm({
      employeeId: '',
      month: '',
      deductions: ''
    });
    setShowPayrollModal(true);
  };

  const handleSavePayroll = () => {
    if (!payrollForm.employeeId || !payrollForm.month || !payrollForm.deductions) {
      alert('Please fill in all required fields');
      return;
    }

    const employee = salaryPackages.find(pkg => pkg.employeeId === payrollForm.employeeId);
    if (!employee) {
      alert('Employee not found');
      return;
    }

    const deductionsAmount = parseFloat(payrollForm.deductions);
    const netSalary = employee.baseSalary + employee.allowances - deductionsAmount;

    const newPayroll: PayrollRecord = {
      id: `PAY-${String(payrollRecords.length + 1).padStart(3, '0')}`,
      employeeName: employee.employeeName,
      employeeId: employee.employeeId,
      month: payrollForm.month,
      baseSalary: employee.baseSalary,
      allowances: employee.allowances,
      deductions: deductionsAmount,
      netSalary: netSalary,
      status: 'Processing',
      paymentDate: new Date().toISOString().split('T')[0]
    };

    setPayrollRecords([...payrollRecords, newPayroll]);
    setShowPayrollModal(false);
  };

  const handleMarkAsPaid = (id: string) => {
    setPayrollRecords(payrollRecords.map(record =>
      record.id === id
        ? { ...record, status: 'Paid' as 'Paid', paymentDate: new Date().toISOString().split('T')[0] }
        : record
    ));
  };

  const renderSalarySetup = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Salary Packages</h3>
        <button
          onClick={handleAddSalary}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Salary Package
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salaryPackages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{pkg.employeeName}</div>
                    <div className="text-sm text-gray-500">{pkg.employeeId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.baseSalary.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pkg.allowances.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${(pkg.baseSalary + pkg.allowances).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pkg.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditSalary(pkg)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSalary(pkg.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Payroll Processing</h3>
        <button
          onClick={handleProcessPayroll}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Process Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Payroll (October)</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            ${payrollRecords.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Paid</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            ${payrollRecords.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-sm text-yellow-600 font-medium">Pending</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            ${payrollRecords.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrollRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                    <div className="text-sm text-gray-500">{record.employeeId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.baseSalary.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+${record.allowances.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${record.deductions.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${record.netSalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    record.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDeductions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Deductions & Allowances</h3>
      <p className="text-sm text-gray-600">
        Manage standard deductions including taxes, insurance, bonuses, and overtime payments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Standard Deductions</h4>
          <div className="space-y-3">
            {deductions.map((deduction) => (
              <div key={deduction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{deduction.type}</div>
                  <div className="text-sm text-gray-600">{deduction.description}</div>
                </div>
                <div className="text-red-600 font-semibold">-${deduction.amount}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiPlus className="w-4 h-4 inline mr-2" />
            Add Deduction Rule
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Allowances & Bonuses</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Housing Allowance</div>
                <div className="text-sm text-gray-600">Monthly benefit</div>
              </div>
              <div className="text-green-600 font-semibold">+$300</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Transport Allowance</div>
                <div className="text-sm text-gray-600">Monthly benefit</div>
              </div>
              <div className="text-green-600 font-semibold">+$200</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Performance Bonus</div>
                <div className="text-sm text-gray-600">Quarterly</div>
              </div>
              <div className="text-green-600 font-semibold">+$500</div>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiPlus className="w-4 h-4 inline mr-2" />
            Add Allowance
          </button>
        </div>
      </div>
    </div>
  );

  const renderPayslips = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payslip Storage</h3>
      <p className="text-sm text-gray-600">
        Digital copies of payslips for administrative use and employee records.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payslip ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrollRecords.filter(r => r.status === 'Paid').map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                    <div className="text-sm text-gray-500">{record.employeeId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${record.netSalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.paymentDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 flex items-center gap-2 ml-auto">
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <FiUsers className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salaries & Payroll</h2>
          <p className="text-sm text-gray-600">Manage salary packages, process payroll, and handle deductions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'setup'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Salary Setup
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'payroll'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Process Payroll
          </button>
          <button
            onClick={() => setActiveTab('deductions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'deductions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Deductions & Allowances
          </button>
          <button
            onClick={() => setActiveTab('payslips')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'payslips'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payslip Storage
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'setup' && renderSalarySetup()}
        {activeTab === 'payroll' && renderPayroll()}
        {activeTab === 'deductions' && renderDeductions()}
        {activeTab === 'payslips' && renderPayslips()}
      </div>

      {/* Add/Edit Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSalary ? 'Edit Salary Package' : 'Add Salary Package'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={salaryForm.employeeName}
                  onChange={(e) => setSalaryForm({ ...salaryForm, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Dr. Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={salaryForm.employeeId}
                  onChange={(e) => setSalaryForm({ ...salaryForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="EMP-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={salaryForm.position}
                  onChange={(e) => setSalaryForm({ ...salaryForm, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mathematics Teacher"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={salaryForm.department}
                  onChange={(e) => setSalaryForm({ ...salaryForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  <option value="Academic">Academic</option>
                  <option value="Administration">Administration</option>
                  <option value="IT">IT</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary ($)</label>
                <input
                  type="number"
                  value={salaryForm.baseSalary}
                  onChange={(e) => setSalaryForm({ ...salaryForm, baseSalary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances ($)</label>
                <input
                  type="number"
                  value={salaryForm.allowances}
                  onChange={(e) => setSalaryForm({ ...salaryForm, allowances: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSalaryModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSalary}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingSalary ? 'Save Changes' : 'Add Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Payroll Modal */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Payroll</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  value={payrollForm.employeeId}
                  onChange={(e) => setPayrollForm({ ...payrollForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select employee</option>
                  {salaryPackages.map(pkg => (
                    <option key={pkg.employeeId} value={pkg.employeeId}>
                      {pkg.employeeName} ({pkg.employeeId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month/Period</label>
                <input
                  type="text"
                  value={payrollForm.month}
                  onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="October 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Deductions ($)</label>
                <input
                  type="number"
                  value={payrollForm.deductions}
                  onChange={(e) => setPayrollForm({ ...payrollForm, deductions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="750"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Standard deductions: Tax, Insurance, Pension
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPayrollModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayroll}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Process Payroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalariesPayroll;
