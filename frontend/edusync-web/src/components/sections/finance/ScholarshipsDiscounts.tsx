import React, { useState, useEffect } from 'react';
import { FiAward, FiPlus, FiEdit2, FiTrash2, FiTrendingUp } from 'react-icons/fi';

interface Scholarship {
  id: string;
  studentName: string;
  grade: string;
  scholarshipType: string;
  amount: number;
  percentage: number;
  status: 'Active' | 'Expired' | 'Pending';
  startDate: string;
  endDate: string;
}

interface ScholarshipFund {
  id: string;
  fundName: string;
  totalAmount: number;
  usedAmount: number;
  availableAmount: number;
  beneficiaries: number;
}

const ScholarshipsDiscounts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'adjustments' | 'monitoring'>('scholarships');
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  

  const [scholarshipForm, setScholarshipForm] = useState({
    studentName: '',
    grade: '',
    scholarshipType: '',
    amount: '',
    percentage: '',
    startDate: '',
    endDate: ''
  });
  
  useEffect(() => {
    // Students are loaded but not used in this component
  }, []);

  // Real data (no mock)
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  const [funds] = useState<ScholarshipFund[]>([
    {
      id: 'FUND-001',
      fundName: 'Merit Scholarship Fund',
      totalAmount: 50000,
      usedAmount: 15000,
      availableAmount: 35000,
      beneficiaries: 8
    },
    {
      id: 'FUND-002',
      fundName: 'Need-Based Fund',
      totalAmount: 75000,
      usedAmount: 45000,
      availableAmount: 30000,
      beneficiaries: 12
    },
  ]);

  const handleAddScholarship = () => {
    setEditingScholarship(null);
    setScholarshipForm({
      studentName: '',
      grade: '',
      scholarshipType: '',
      amount: '',
      percentage: '',
      startDate: '',
      endDate: ''
    });
    setShowScholarshipModal(true);
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setScholarshipForm({
      studentName: scholarship.studentName,
      grade: scholarship.grade,
      scholarshipType: scholarship.scholarshipType,
      amount: scholarship.amount.toString(),
      percentage: scholarship.percentage.toString(),
      startDate: scholarship.startDate,
      endDate: scholarship.endDate
    });
    setShowScholarshipModal(true);
  };

  const handleDeleteScholarship = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      setScholarships(scholarships.filter(s => s.id !== id));
    }
  };

  const handleSaveScholarship = () => {
    if (!scholarshipForm.studentName || !scholarshipForm.grade || !scholarshipForm.scholarshipType ||
        !scholarshipForm.amount || !scholarshipForm.percentage || !scholarshipForm.startDate || !scholarshipForm.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingScholarship) {
      setScholarships(scholarships.map(s =>
        s.id === editingScholarship.id
          ? {
              ...s,
              ...scholarshipForm,
              amount: parseFloat(scholarshipForm.amount),
              percentage: parseFloat(scholarshipForm.percentage)
            }
          : s
      ));
    } else {
      const newScholarship: Scholarship = {
        id: `SCH-${String(scholarships.length + 1).padStart(3, '0')}`,
        studentName: scholarshipForm.studentName,
        grade: scholarshipForm.grade,
        scholarshipType: scholarshipForm.scholarshipType,
        amount: parseFloat(scholarshipForm.amount),
        percentage: parseFloat(scholarshipForm.percentage),
        status: 'Active',
        startDate: scholarshipForm.startDate,
        endDate: scholarshipForm.endDate
      };
      setScholarships([...scholarships, newScholarship]);
    }
    setShowScholarshipModal(false);
  };

  const renderScholarships = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Scholarship Records</h3>
        <button
          onClick={handleAddScholarship}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Scholarship
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scholarships.map((scholarship) => (
              <tr key={scholarship.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scholarship.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scholarship.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scholarship.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scholarship.scholarshipType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${scholarship.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scholarship.percentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    scholarship.status === 'Active' ? 'bg-green-100 text-green-800' :
                    scholarship.status === 'Expired' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {scholarship.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditScholarship(scholarship)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteScholarship(scholarship.id)}
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

  const renderAdjustments = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Fee Adjustments</h3>
      <p className="text-sm text-gray-600">
        Apply scholarships and discounts directly to student tuition records. Adjustments are automatically calculated based on scholarship percentages.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.filter(s => s.status === 'Active').map((scholarship) => (
          <div key={scholarship.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{scholarship.studentName}</h4>
                <p className="text-sm text-gray-600">{scholarship.grade} • {scholarship.scholarshipType}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                {scholarship.percentage}% OFF
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Tuition:</span>
                <span className="font-medium text-gray-900">$5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Scholarship Amount:</span>
                <span className="font-medium text-red-600">-${scholarship.amount.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Adjusted Fee:</span>
                <span className="font-bold text-primary-600">${(5000 - scholarship.amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Valid: {scholarship.startDate} to {scholarship.endDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Scholarship Fund Monitoring</h3>

      {funds.map((fund) => (
        <div key={fund.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{fund.fundName}</h4>
              <p className="text-sm text-gray-600">{fund.beneficiaries} active beneficiaries</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${fund.totalAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Fund</div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Fund Utilization</span>
                <span className="font-medium text-gray-900">
                  {((fund.usedAmount / fund.totalAmount) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(fund.usedAmount / fund.totalAmount) * 100}%` }}
                />
              </div>
            </div>

            {/* Fund Details */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <FiTrendingUp className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Used</span>
                </div>
                <div className="text-xl font-bold text-red-900">${fund.usedAmount.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <FiAward className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Available</span>
                </div>
                <div className="text-xl font-bold text-green-900">${fund.availableAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <FiAward className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scholarships</h2>
          <p className="text-sm text-gray-600">Manage financial aid, fee adjustments, and scholarship funds</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'scholarships'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Record Scholarships
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'adjustments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Adjust Fees
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'monitoring'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fund Monitoring
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'scholarships' && renderScholarships()}
        {activeTab === 'adjustments' && renderAdjustments()}
        {activeTab === 'monitoring' && renderMonitoring()}
      </div>

      {/* Add/Edit Scholarship Modal */}
      {showScholarshipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={scholarshipForm.studentName}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  value={scholarshipForm.grade}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Grade 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Type</label>
                <select
                  value={scholarshipForm.scholarshipType}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, scholarshipType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Merit-Based">Merit-Based</option>
                  <option value="Need-Based">Need-Based</option>
                  <option value="Athletic">Athletic</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={scholarshipForm.amount}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={scholarshipForm.percentage}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, percentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="40"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={scholarshipForm.startDate}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={scholarshipForm.endDate}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScholarshipModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScholarship}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingScholarship ? 'Save Changes' : 'Add Scholarship'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsDiscounts;
