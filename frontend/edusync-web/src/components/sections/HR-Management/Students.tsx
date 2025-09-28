import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiEye
} from 'react-icons/fi';

interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  program: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  academicInfo: {
    gpa: number;
    attendance: number;
    currentSemester: number;
  };
  financialInfo: {
    feeStatus: 'Paid' | 'Pending' | 'Overdue';
    lastPaymentDate: string;
  };
}

const Students: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isFilterOpen && !(event.target as Element).closest('.filter-container')) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  // Mock data
  const studentsData: Student[] = [
    {
      id: 1,
      studentId: "2025001",
      name: "Alex Thompson",
      email: "alex.t@university.edu",
      program: "Computer Science",
      phone: "(555) 123-4567",
      address: "123 Campus Drive, University City",
      status: "Active",
      academicInfo: {
        gpa: 3.8,
        attendance: 95,
        currentSemester: 2
      },
      financialInfo: {
        feeStatus: "Paid",
        lastPaymentDate: "2025-08-15"
      }
    },
    {
      id: 2,
      studentId: "2025002",
      name: "Maria Garcia",
      email: "maria.g@university.edu",
      program: "Data Science",
      phone: "(555) 234-5678",
      address: "456 University Ave, University City",
      status: "Active",
      academicInfo: {
        gpa: 4.0,
        attendance: 98,
        currentSemester: 2
      },
      financialInfo: {
        feeStatus: "Paid",
        lastPaymentDate: "2025-08-10"
      }
    },
    {
      id: 3,
      studentId: "2025003",
      name: "James Wilson",
      email: "james.w@university.edu",
      program: "Artificial Intelligence",
      phone: "(555) 345-6789",
      address: "789 College Street, University City",
      status: "Suspended",
      academicInfo: {
        gpa: 2.5,
        attendance: 65,
        currentSemester: 2
      },
      financialInfo: {
        feeStatus: "Overdue",
        lastPaymentDate: "2025-06-15"
      }
    },
    {
      id: 4,
      studentId: "2025004",
      name: "Emily Chen",
      email: "emily.c@university.edu",
      program: "Software Engineering",
      phone: "(555) 456-7890",
      address: "321 Tech Road, University City",
      status: "Active",
      academicInfo: {
        gpa: 3.9,
        attendance: 97,
        currentSemester: 2
      },
      financialInfo: {
        feeStatus: "Paid",
        lastPaymentDate: "2025-08-20"
      }
    },
    {
      id: 5,
      studentId: "2025005",
      name: "Michael Brown",
      email: "michael.b@university.edu",
      program: "Cybersecurity",
      phone: "(555) 567-8901",
      address: "567 Security Blvd, University City",
      status: "Inactive",
      academicInfo: {
        gpa: 3.2,
        attendance: 78,
        currentSemester: 2
      },
      financialInfo: {
        feeStatus: "Pending",
        lastPaymentDate: "2025-07-30"
      }
    }
  ];

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(student.status);

    return matchesSearch && matchesStatus;
  });

  function handleAddStudent() {
    setIsDialogOpen(true);
  }

  function handleClose() {
    setIsDialogOpen(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('New Student:', formData);
    setIsDialogOpen(false);
    setFormData({ name: '', email: '', program: '' });
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FiUsers className="w-6 h-6 text-primary-600" />
              <span>Students</span>
            </h1>
            <p className="text-gray-600">Manage student enrollment and information</p>
          </div>
          <button
              onClick={handleAddStudent}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <FiSearch className="text-gray-400 w-4 h-4 mr-2" />
            <input
                type="text"
                placeholder="Search by name, ID, email, or program..."
                className="w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative filter-container">
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 ${
                    statusFilter.length > 0 ? 'bg-primary-50 border-primary-200' : ''
                }`}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
              {statusFilter.length > 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                  {statusFilter.length}
                </span>
              )}
            </button>

            {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Filters</h3>
                      <button
                          onClick={() => setStatusFilter([])}
                          className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      {['Active', 'Inactive', 'Suspended'].map((status) => (
                          <label key={status} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={statusFilter.includes(status)}
                                onChange={() => {
                                  setStatusFilter(prev =>
                                      prev.includes(status)
                                          ? prev.filter(s => s !== status)
                                          : [...prev, status]
                                  );
                                }}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-600">{status}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
              <div key={student.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{student.name}</h2>
                    <div className="text-sm text-gray-600">{student.studentId}</div>
                    <div className="text-sm text-gray-600">{student.program}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' :
                          student.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">GPA</div>
                    <div>{student.academicInfo.gpa}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Attendance</div>
                    <div>{student.academicInfo.attendance}%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm truncate">{student.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <button className="text-primary-600 hover:text-primary-800 flex items-center space-x-1">
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
          ))}
        </div>

        {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Student</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program</label>
                    <input
                        type="text"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Students;