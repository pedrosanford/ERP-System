// AddStaffDialog.tsx
import React, { useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import hrService, { type Department, type Staff } from '../../../services/hrService';

interface AddStaffDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onStaffAdded: () => void;
    departments: Department[];
}

const AddStaffDialog: React.FC<AddStaffDialogProps> = ({ isOpen, onClose, onStaffAdded, departments }) => {
    const [formData, setFormData] = useState({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        hireDate: '',
        position: '',
        departmentId: '',
        salary: '',
        employmentType: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN',
        status: 'ACTIVE' as 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'SUSPENDED',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setFormData({
            employeeId: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            hireDate: '',
            position: '',
            departmentId: '',
            salary: '',
            employmentType: 'FULL_TIME',
            status: 'ACTIVE',
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const staffData: Staff = {
                employeeId: formData.employeeId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || undefined,
                hireDate: formData.hireDate,
                position: formData.position,
                departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
                salary: formData.salary ? parseFloat(formData.salary) : undefined,
                employmentType: formData.employmentType,
                status: formData.status,
            };

            await hrService.createStaff(staffData);
            resetForm();
            onStaffAdded();
            onClose();
        } catch (err: any) {
            console.error('Failed to create staff:', err);
            setError(err.message || 'Failed to create staff member');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Staff Member</h2>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        <FaTimes />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Employee ID*</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Position*</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.position}
                                onChange={(e) => setFormData({...formData, position: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name*</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email*</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hire Date*</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.hireDate}
                                onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                                disabled={isLoading}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                            <input
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={formData.employmentType}
                                onChange={(e) => setFormData({...formData, employmentType: e.target.value as any})}
                                disabled={isLoading}
                            >
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERN">Intern</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <FaSpinner className="animate-spin" />}
                            {isLoading ? 'Adding...' : 'Add Staff Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffDialog;