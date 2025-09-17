import React, { useState } from 'react';
import { FiUsers, FiUserPlus, FiSearch, FiFilter } from 'react-icons/fi';

const Staff: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
  });

  function handleAddStaff() {
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
    console.log('New Staff:', formData);

    // Here you could call an API or update state
    // Example: await api.addStaff(formData);

    setIsDialogOpen(false);
    setFormData({ name: '', email: '', program: '' });
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FiUsers className="w-6 h-6 text-primary-600" />
              <span>Staff</span>
            </h1>
            <p className="text-gray-600">Manage staff</p>
          </div>
          <button
              onClick={handleAddStaff}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <FiSearch className="text-gray-400 w-4 h-4 mr-2" />
            <input
                type="text"
                placeholder="Search Staff..."
                className="w-full focus:outline-none"
            />
          </div>
          <button className="flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <FiFilter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* --- Table or Staff list goes here --- */}

        {/* Add Staff Dialog */}
        {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Staff</h2>
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

export default Staff;
