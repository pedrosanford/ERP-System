import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import studentService, { type Student as StudentAPI } from '../../../services/studentService';

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
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    program: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    enrollmentDate: '',
    status: 'Active' as Student['status'],
    currentSemester: '1',
    gpa: '',
    attendancePercentage: '',
    feeStatus: 'Pending' as Student['financialInfo']['feeStatus'],
    lastPaymentDate: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isFilterOpen && !(event.target as Element).closest('.filter-container')) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studentService.getAllStudents();
      
      const transformedStudents: Student[] = response.map((student: StudentAPI) => ({
        id: student.id!,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        program: student.program,
        phone: student.phone || 'N/A',
        address: student.address || 'N/A',
        status: mapStatus(student.status),
        academicInfo: {
          gpa: student.gpa || 0,
          attendance: student.attendancePercentage || 0,
          currentSemester: student.currentSemester || 1,
        },
        financialInfo: {
          feeStatus: mapFeeStatus(student.feeStatus),
          lastPaymentDate: student.lastPaymentDate || 'N/A',
        },
      }));

      setStudentsData(transformedStudents);
    } catch (err: any) {
      console.error('Failed to fetch students:', err);
      setError(err.message || 'Failed to load student data');
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatus = (status: StudentAPI['status']): Student['status'] => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'SUSPENDED':
        return 'Suspended';
      default:
        return 'Active';
    }
  };

  const mapFeeStatus = (feeStatus: StudentAPI['feeStatus']): Student['financialInfo']['feeStatus'] => {
    switch (feeStatus) {
      case 'PAID':
        return 'Paid';
      case 'PENDING':
        return 'Pending';
      case 'OVERDUE':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

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
    setSubmitError(null);
    setFormData({
      studentId: '',
      firstName: '',
      lastName: '',
      email: '',
      program: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      enrollmentDate: '',
      status: 'Active',
      currentSemester: '1',
      gpa: '',
      attendancePercentage: '',
      feeStatus: 'Pending',
      lastPaymentDate: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
    });
  }


  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map UI status to backend status
      const backendStatus = formData.status === 'Active' ? 'ACTIVE' 
        : formData.status === 'Inactive' ? 'INACTIVE' 
        : formData.status === 'Suspended' ? 'SUSPENDED' 
        : 'ACTIVE';

      // Map UI fee status to backend fee status
      const backendFeeStatus = formData.feeStatus === 'Paid' ? 'PAID'
        : formData.feeStatus === 'Pending' ? 'PENDING'
        : formData.feeStatus === 'Overdue' ? 'OVERDUE'
        : 'PENDING';

      const studentData: StudentAPI = {
        studentId: formData.studentId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : undefined,
        enrollmentDate: formData.enrollmentDate ? formData.enrollmentDate : undefined,
        program: formData.program,
        currentSemester: formData.currentSemester ? parseInt(formData.currentSemester) : undefined,
        gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
        attendancePercentage: formData.attendancePercentage ? parseInt(formData.attendancePercentage) : undefined,
        status: backendStatus as StudentAPI['status'],
        feeStatus: backendFeeStatus as StudentAPI['feeStatus'],
        lastPaymentDate: formData.lastPaymentDate ? formData.lastPaymentDate : undefined,
        guardianName: formData.guardianName || undefined,
        guardianPhone: formData.guardianPhone || undefined,
        guardianEmail: formData.guardianEmail || undefined,
      };

      await studentService.createStudent(studentData);
      await fetchData(); // Refresh the list
      handleClose();
    } catch (err: any) {
      console.error('Failed to create student:', err);
      setSubmitError(err.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  }


  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading students data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
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

                {/* Edit functionality coming soon */}
              </div>
          ))}
        </div>

        {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Student</h2>
                {submitError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID *</label>
                        <input
                            type="text"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            placeholder="e.g., 2025001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
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
                        <label className="block text-sm font-medium text-gray-700">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Program *</label>
                        <input
                            type="text"
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                        <input
                            type="date"
                            name="enrollmentDate"
                            value={formData.enrollmentDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Semester</label>
                        <input
                            type="number"
                            name="currentSemester"
                            value={formData.currentSemester}
                            onChange={handleChange}
                            min="1"
                            max="12"
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GPA</label>
                        <input
                            type="number"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            max="4"
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., 3.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Attendance %</label>
                        <input
                            type="number"
                            name="attendancePercentage"
                            value={formData.attendancePercentage}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., 95"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fee Status</label>
                        <select
                            name="feeStatus"
                            value={formData.feeStatus}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Payment Date</label>
                        <input
                            type="date"
                            name="lastPaymentDate"
                            value={formData.lastPaymentDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Guardian Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                        <input
                            type="text"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
                        <input
                            type="text"
                            name="guardianPhone"
                            value={formData.guardianPhone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Guardian Email</label>
                        <input
                            type="email"
                            name="guardianEmail"
                            value={formData.guardianEmail}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin h-4 w-4" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Student</span>
                      )}
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