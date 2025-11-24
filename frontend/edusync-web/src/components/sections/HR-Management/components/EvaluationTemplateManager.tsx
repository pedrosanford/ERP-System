import React, { useState } from 'react';
import { FaClipboardList, FaPlus, FaEdit, FaTrash, FaWeight, FaCog } from 'react-icons/fa';

interface EvaluationTemplateManagerProps {
    templates: any[];
}

const EvaluationTemplateManager: React.FC<EvaluationTemplateManagerProps> = ({ templates }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);

    const getRoleTypeColor = (roleType: string) => {
        switch (roleType) {
            case 'teaching': return 'bg-blue-100 text-blue-700';
            case 'non-teaching': return 'bg-green-100 text-green-700';
            case 'management': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const renderTemplateForm = () => (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h3>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Template Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-md"
                            placeholder="e.g., Teaching Staff Evaluation"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Role Type</label>
                        <select className="w-full p-3 border rounded-md">
                            <option value="teaching">Teaching Staff</option>
                            <option value="non-teaching">Non-Teaching Staff</option>
                            <option value="management">Management Staff</option>
                        </select>
                    </div>
                </div>

                {/* Criteria Section */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Evaluation Criteria</h4>
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <FaPlus className="w-3 h-3" /> Add Criterion
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {/* Sample Criterion */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded text-sm"
                                        placeholder="Criterion name"
                                        defaultValue="Teaching Effectiveness"
                                    />
                                </div>
                                <div>
                                    <select className="w-full p-2 border rounded text-sm">
                                        <option>1-5 Scale</option>
                                        <option>1-10 Scale</option>
                                        <option>Poor-Excellent</option>
                                        <option>Percentage</option>
                                    </select>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FaWeight className="text-gray-400" />
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded text-sm"
                                            placeholder="Weight %"
                                            defaultValue="30"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-blue-600 hover:text-blue-800">
                                        <FaEdit className="w-3 h-3" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:text-red-800">
                                        <FaTrash className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <textarea
                                    className="w-full p-2 border rounded text-sm"
                                    rows={2}
                                    placeholder="Criterion description"
                                    defaultValue="Quality of instruction, student engagement, and teaching methods"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => {setShowCreateForm(false); setEditingTemplate(null);}}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Evaluation Templates</h2>
                    <p className="text-gray-600">Create and manage reusable evaluation templates for different role types</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <FaPlus /> New Template
                </button>
            </div>

            {/* Template Form */}
            {(showCreateForm || editingTemplate) && renderTemplateForm()}

            {/* Templates List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <FaClipboardList className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Created: {new Date(template.createdDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleTypeColor(template.roleType)}`}>
                                    {template.roleType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Template Statistics */}
                        <div className="grid grid-cols-3 gap-4 mb-4 py-3 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{template.criteria.length}</div>
                                <div className="text-xs text-gray-500">Criteria</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">
                                    {template.criteria.reduce((sum: number, c: any) => sum + c.weight, 0)}%
                                </div>
                                <div className="text-xs text-gray-500">Total Weight</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">45</div>
                                <div className="text-xs text-gray-500">Uses</div>
                            </div>
                        </div>

                        {/* Criteria Preview */}
                        <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-medium text-gray-700">Criteria Overview:</h4>
                            {template.criteria.slice(0, 3).map((criterion: any) => (
                                <div key={criterion.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{criterion.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{criterion.weight}%</span>
                                        <span className="text-xs text-gray-500">{criterion.scaleType}</span>
                                    </div>
                                </div>
                            ))}
                            {template.criteria.length > 3 && (
                                <div className="text-xs text-gray-500">
                                    +{template.criteria.length - 3} more criteria...
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                                Preview Template
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingTemplate(template)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaEdit />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <FaCog />
                                </button>
                                <button className="p-2 text-red-400 hover:text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvaluationTemplateManager;