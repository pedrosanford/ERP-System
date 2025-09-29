// Staff.tsx
import React, { useState } from 'react';
import {
    FaEnvelope,
    FaPhone,
    FaGraduationCap,
    FaBuilding,
    FaFilter,
    FaSearch, FaPlus,
} from 'react-icons/fa';
import {FiUsers} from "react-icons/fi";
import AddStaffDialog from './AddStaffDialog';

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
    status: 'Active' | 'On Leave' | 'Sabbatical';
    officeLocation: string;
    courses: string[];
    achievements: string[];
}

const Staff: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    // Add these new state variables
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const staffData: StaffMember[] = [
        {
            id: 1,
            name: "Dr. Sarah Smith",
            role: "Professor",
            department: "Computer Science",
            email: "s.smith@school.edu",
            phone: "(555) 123-4567",
            education: "Ph.D. in Computer Science, MIT",
            specialization: "Artificial Intelligence",
            dateJoined: "2017-09-01",
            status: "Active",
            officeLocation: "Building A, Room 301",
            courses: ["Introduction to AI", "Machine Learning", "Neural Networks"],
            achievements: ["Best Teacher Award 2024", "Published 15 research papers", "AI Innovation Grant 2023"]
        },
        {
            id: 2,
            name: "Dr. James Wilson",
            role: "Department Head",
            department: "Mathematics",
            email: "j.wilson@school.edu",
            phone: "(555) 234-5678",
            education: "Ph.D. in Mathematics, Stanford",
            specialization: "Abstract Algebra",
            dateJoined: "2013-08-15",
            status: "Active",
            officeLocation: "Building B, Room 201",
            courses: ["Advanced Algebra", "Number Theory", "Mathematical Analysis"],
            achievements: ["Department Excellence Award", "Mathematics Research Grant 2024"]
        },
        {
            id: 3,
            name: "Prof. Maria Garcia",
            role: "Associate Professor",
            department: "Physics",
            email: "m.garcia@school.edu",
            phone: "(555) 345-6789",
            education: "Ph.D. in Physics, CalTech",
            specialization: "Quantum Mechanics",
            dateJoined: "2020-01-15",
            status: "Active",
            officeLocation: "Building C, Room 405",
            courses: ["Quantum Physics", "Classical Mechanics", "Physics Lab"],
            achievements: ["Outstanding Research Paper 2024", "Physics Innovation Award"]
        },
        {
            id: 4,
            name: "Mrs. Emily Brown",
            role: "Principal",
            department: "Administration",
            email: "e.brown@school.edu",
            phone: "(555) 456-7890",
            education: "Ed.D. in Educational Leadership, Harvard",
            specialization: "Educational Administration",
            dateJoined: "2010-07-01",
            status: "Active",
            officeLocation: "Main Building, Room 101",
            courses: [],
            achievements: ["School Leadership Award", "Educational Excellence Recognition 2023"]
        },
        {
            id: 5,
            name: "Dr. Michael Chang",
            role: "Assistant Professor",
            department: "Chemistry",
            email: "m.chang@school.edu",
            phone: "(555) 567-8901",
            education: "Ph.D. in Chemistry, Berkeley",
            specialization: "Organic Chemistry",
            dateJoined: "2022-09-01",
            status: "Active",
            officeLocation: "Building D, Room 205",
            courses: ["Organic Chemistry", "Chemical Analysis", "Lab Methods"],
            achievements: ["New Faculty Excellence Award", "Chemistry Innovation Grant"]
        },
        {
            id: 6,
            name: "Dr. Lisa Anderson",
            role: "Associate Professor",
            department: "Computer Science",
            email: "l.anderson@school.edu",
            phone: "(555) 678-9012",
            education: "Ph.D. in Computer Engineering, Georgia Tech",
            specialization: "Cybersecurity",
            dateJoined: "2019-08-15",
            status: "On Leave",
            officeLocation: "Building A, Room 304",
            courses: ["Network Security", "Cryptography", "Computer Networks"],
            achievements: ["Cybersecurity Research Grant", "Best Paper Award 2024"]
        }
    ];

    const departments = ['All', ...new Set(staffData.map(staff => staff.department))];

    const filteredStaff = staffData.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment === 'All' || staff.department === filterDepartment;
        return matchesSearch && matchesDepartment;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <FiUsers className="w-6 h-6 text-primary-600" />
                        <span>Staff</span>
                    </h1>
                    <p className="text-gray-600">Manage Staff Information</p>
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
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search staff..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-400"/>
                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                        {departments.map(dept => (
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
            <AddStaffDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />

        </div>
    );
};

export default Staff;