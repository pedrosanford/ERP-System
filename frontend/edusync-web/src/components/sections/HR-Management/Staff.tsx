// Staff.tsx
import React, { useState, useEffect } from 'react';
import {
    FaEnvelope,
    FaPhone,
    FaGraduationCap,
    FaBuilding,
    FaFilter,
    FaSearch, 
    FaPlus,
    FaSpinner,
} from 'react-icons/fa';
import {FiUsers} from "react-icons/fi";
import AddStaffDialog from './AddStaffDialog';
import hrService, { type Staff as StaffAPI, type Department } from '../../../services/hrService';

interface StaffMember {
    id: number;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    education: string;
    specialization: string;
    dateJoined: string;
    status: 'Active' | 'On Leave' | 'Sabbatical' | 'Terminated' | 'Suspended';
    officeLocation: string;
    courses: string[];
    achievements: string[];
}

const Staff: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [staffData, setStaffData] = useState<StaffMember[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Fetch staff and departments on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [staffResponse, departmentsResponse] = await Promise.all([
                hrService.getAllStaff(),
                hrService.getActiveDepartments(),
            ]);

            // Transform API data to UI format
            const transformedStaff: StaffMember[] = staffResponse.map((staff: StaffAPI) => {
                const dept = departmentsResponse.find(d => d.id === staff.departmentId);
                return {
                    id: staff.id!,
                    name: staff.fullName || `${staff.firstName} ${staff.lastName}`,
                    role: staff.position,
                    department: dept?.name || 'N/A',
                    email: staff.email,
                    phone: staff.phone || 'N/A',
                    education: 'N/A', // Can be extended later
                    specialization: staff.position,
                    dateJoined: staff.hireDate,
                    status: mapStatus(staff.status || 'ACTIVE'),
                    officeLocation: 'N/A', // Can be extended later
                    courses: [], // Can be extended later
                    achievements: [], // Can be extended later
                };
            });

            setStaffData(transformedStaff);
            setDepartments(departmentsResponse);
        } catch (err: any) {
            console.error('Failed to fetch data:', err);
            setError(err.message || 'Failed to load staff data');
        } finally {
            setIsLoading(false);
        }
    };

    const mapStatus = (status: string): 'Active' | 'On Leave' | 'Sabbatical' | 'Terminated' | 'Suspended' => {
        switch (status) {
            case 'ACTIVE': return 'Active';
            case 'ON_LEAVE': return 'On Leave';
            case 'TERMINATED': return 'Terminated';
            case 'SUSPENDED': return 'Suspended';
            default: return 'Active';
        }
    };

    const departmentOptions = ['All', ...departments.map(dept => dept.name)];

    const filteredStaff = staffData.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment === 'All' || staff.department === filterDepartment;
        return matchesSearch && matchesDepartment;
    });

    const handleStaffAdded = () => {
        fetchData(); // Refresh data after adding new staff
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading staff data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
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
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <FiUsers className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Staff</h2>
                        <p className="text-sm text-gray-600">Manage Staff Information</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                    <FaPlus className="w-4 h-4" />
                    Add Staff Member
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1">
                    <FaSearch className="text-gray-400 w-4 h-4 mr-2"/>
                    <input
                        type="text"
                        placeholder="Search by name, role, or specialization..."
                        className="w-full focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <FaFilter className="text-gray-400 w-4 h-4 mr-2"/>
                    <select
                        className="focus:outline-none bg-transparent"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                        {departmentOptions.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map(staff => (
                    <div key={staff.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">{staff.name}</h2>
                                <p className="text-gray-600">{staff.role}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                staff.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    staff.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                            }`}>
                                {staff.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaBuilding className="w-4 h-4"/>
                                <span>{staff.department}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaEnvelope className="w-4 h-4"/>
                                <span>{staff.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaPhone className="w-4 h-4"/>
                                <span>{staff.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaGraduationCap className="w-4 h-4"/>
                                <span>{staff.education}</span>
                            </div>
                        </div>

                        {staff.courses.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Courses</h3>
                                <div className="flex flex-wrap gap-2">
                                    {staff.courses.map((course, index) => (
                                        <span key={index}
                                              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Achievements</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {staff.achievements.map((achievement, index) => (
                                    <li key={index}>{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            
            {staffData.length === 0 && (
                <div className="text-center py-12">
                    <FiUsers className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first staff member</p>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Staff Member
                    </button>
                </div>
            )}

            <AddStaffDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onStaffAdded={handleStaffAdded}
                departments={departments}
            />
        </div>
    );
};

export default Staff;