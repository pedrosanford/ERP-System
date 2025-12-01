import React, { useState, useEffect } from 'react';
import { FiStar, FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { FaUserTie } from 'react-icons/fa';

interface Staff {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
}

interface Evaluation {
  id: number;
  staffId: number;
  staffName?: string;
  position?: string;
  rating: number;
  comments: string;
  evaluationDate: string;
  evaluatorId: number;
  status: string;
}

const StaffEvaluation: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  
  const [evaluationForm, setEvaluationForm] = useState({
    staffId: '',
    rating: 5,
    comments: ''
  });

  useEffect(() => {
    loadStaff();
    loadEvaluations();
  }, []);

  const loadStaff = async () => {
    try {
      const response = await fetch('/api/hr/staff');
      if (response.ok) {
        const data = await response.json();
        setStaffList(data.map((s: any) => ({
          id: s.id,
          employeeId: s.employeeId,
          firstName: s.firstName,
          lastName: s.lastName,
          position: s.position,
          department: s.departmentId?.toString() || 'N/A'
        })));
      }
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  const loadEvaluations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hr/evaluations');
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      }
    } catch (error) {
      console.error('Failed to load evaluations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvaluation = () => {
    setEditingEvaluation(null);
    setEvaluationForm({
      staffId: '',
      rating: 5,
      comments: ''
    });
    setShowEvaluationModal(true);
  };

  const handleEditEvaluation = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    setEvaluationForm({
      staffId: evaluation.staffId.toString(),
      rating: evaluation.rating,
      comments: evaluation.comments
    });
    setShowEvaluationModal(true);
  };

  const handleDeleteEvaluation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      try {
        const response = await fetch(`/api/hr/evaluations/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          loadEvaluations();
        }
      } catch (error) {
        console.error('Failed to delete evaluation:', error);
      }
    }
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!evaluationForm.staffId || !evaluationForm.comments.trim()) {
      alert('Please select a staff member and provide comments');
      return;
    }

    const evaluationData = {
      staffId: parseInt(evaluationForm.staffId),
      rating: evaluationForm.rating,
      comments: evaluationForm.comments.trim(),
      evaluationDate: new Date().toISOString().split('T')[0],
      evaluatorId: 1, // Current user ID
      status: 'COMPLETED'
    };

    try {
      const url = editingEvaluation 
        ? `/api/hr/evaluations/${editingEvaluation.id}`
        : '/api/hr/evaluations';
      
      const response = await fetch(url, {
        method: editingEvaluation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evaluationData)
      });

      if (response.ok) {
        setShowEvaluationModal(false);
        loadEvaluations();
      }
    } catch (error) {
      console.error('Failed to save evaluation:', error);
    }
  };

  const getStaffName = (staffId: number) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : `Staff #${staffId}`;
  };

  const getStaffPosition = (staffId: number) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff?.position || 'Unknown';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'text-green-600 bg-green-50';
    if (rating >= 4) return 'text-blue-600 bg-blue-50';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50';
    if (rating >= 2) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <FaUserTie className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Staff Evaluation System</h2>
            <p className="text-sm text-gray-600">Comprehensive performance management platform</p>
          </div>
        </div>
        <button
          onClick={handleAddEvaluation}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Evaluation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Staff</span>
            <FiUsers className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{staffList.length}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Evaluations</span>
            <FiStar className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{evaluations.length}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Average Rating</span>
            <FiStar className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {evaluations.length > 0 
              ? (evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length).toFixed(1)
              : '0.0'
            }
            <span className="text-sm text-gray-500 ml-1">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Excellent (5★)</span>
            <FiStar className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {evaluations.filter(e => e.rating === 5).length}
          </div>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Staff Evaluations</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading evaluations...</div>
        ) : evaluations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No evaluations yet. Click "New Evaluation" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaUserTie className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getStaffName(evaluation.staffId)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {staffList.find(s => s.id === evaluation.staffId)?.employeeId || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStaffPosition(evaluation.staffId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full font-semibold text-sm ${getRatingColor(evaluation.rating)}`}>
                          {evaluation.rating}/5
                        </div>
                        <span className="text-xs text-gray-500">
                          {getRatingLabel(evaluation.rating)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div className="truncate">
                        {evaluation.comments}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(evaluation.evaluationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        evaluation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        evaluation.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {evaluation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditEvaluation(evaluation)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvaluation(evaluation.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Evaluation Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingEvaluation ? 'Edit Evaluation' : 'New Staff Evaluation'}
            </h3>

            <form onSubmit={handleSubmitEvaluation} className="space-y-6">
              {/* Staff Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Staff Member <span className="text-red-500">*</span>
                </label>
                <select
                  value={evaluationForm.staffId}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, staffId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  disabled={!!editingEvaluation}
                >
                  <option value="">-- Select Staff Member --</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName} - {staff.position}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Performance Rating <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        evaluationForm.rating === rating
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={evaluationForm.rating === rating}
                        onChange={(e) => setEvaluationForm({ ...evaluationForm, rating: parseInt(e.target.value) })}
                        className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <FiStar key={i} className={`w-5 h-5 fill-current ${
                              rating >= 5 ? 'text-green-500' :
                              rating >= 4 ? 'text-blue-500' :
                              rating >= 3 ? 'text-yellow-500' :
                              rating >= 2 ? 'text-orange-500' :
                              'text-red-500'
                            }`} />
                          ))}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {rating === 5 && 'Excellent'}
                            {rating === 4 && 'Very Good'}
                            {rating === 3 && 'Good'}
                            {rating === 2 && 'Needs Improvement'}
                            {rating === 1 && 'Poor'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {rating === 5 && 'Consistently exceeds expectations'}
                            {rating === 4 && 'Frequently exceeds expectations'}
                            {rating === 3 && 'Meets expectations'}
                            {rating === 2 && 'Sometimes meets expectations'}
                            {rating === 1 && 'Does not meet expectations'}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evaluation Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={evaluationForm.comments}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, comments: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Provide detailed feedback on performance, strengths, areas for improvement, and recommendations..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 20 characters ({evaluationForm.comments.length}/20)
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEvaluationModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  disabled={evaluationForm.comments.length < 20}
                >
                  {editingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffEvaluation;
