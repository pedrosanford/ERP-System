import React, { useState } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiGripVertical,
  FiSettings, FiChevronDown, FiChevronUp, FiMove
} from 'react-icons/fi';
import { KanbanStage, CustomField } from './types';

interface PipelineCustomizationProps {
  stages: KanbanStage[];
  onStagesUpdate: (stages: KanbanStage[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PipelineCustomization: React.FC<PipelineCustomizationProps> = ({
  stages,
  onStagesUpdate,
  isOpen,
  onToggle
}) => {
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState('');
  const [draggedStage, setDraggedStage] = useState<string | null>(null);
  const [expandedStageFields, setExpandedStageFields] = useState<string | null>(null);

  const fieldTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'longtext', label: 'Long Text / Notes' },
    { value: 'dropdown', label: 'Dropdown (Single Select)' },
    { value: 'multiselect', label: 'Multi-Select Tags' },
    { value: 'number', label: 'Number (Integer/Decimal)' },
    { value: 'currency', label: 'Currency / Accounting Number' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'date', label: 'Date Picker' },
    { value: 'time', label: 'Time Picker' },
    { value: 'datetime', label: 'Date+Time' },
    { value: 'checkbox', label: 'Checkbox / Boolean / Toggle Yes-No' },
    { value: 'rating', label: 'Rating (Stars or 1–5 scale)' },
    { value: 'progress', label: 'Progress Bar / Completion %' },
    { value: 'file', label: 'File Upload' },
    { value: 'url', label: 'Link / URL' },
    { value: 'image', label: 'Image Upload' },
    { value: 'lookup', label: 'Lookup (connect to another module record)' },
    { value: 'user', label: 'User Assignment Dropdown' },
    { value: 'signature', label: 'Signature Field' }
  ];

  const handleAddStage = () => {
    if (!newStageName.trim()) return;

    const newStage: KanbanStage = {
      id: `stage-${Date.now()}`,
      title: newStageName,
      color: 'bg-gray-500',
      lineColor: 'bg-gray-500',
      count: 0,
      customFields: [],
      isRequired: false,
      order: stages.length
    };

    onStagesUpdate([...stages, newStage]);
    setNewStageName('');
  };

  const handleRenameStage = (stageId: string, newName: string) => {
    const updatedStages = stages.map(stage =>
      stage.id === stageId ? { ...stage, title: newName } : stage
    );
    onStagesUpdate(updatedStages);
    setEditingStage(null);
  };

  const handleDeleteStage = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage?.isRequired) {
      alert('Cannot delete required stages (New Inquiry and Enrolled)');
      return;
    }

    if (confirm('Are you sure you want to delete this stage? This action cannot be undone.')) {
      const updatedStages = stages.filter(stage => stage.id !== stageId);
      onStagesUpdate(updatedStages);
    }
  };

  const handleDragStart = (stageId: string) => {
    setDraggedStage(stageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (!draggedStage || draggedStage === targetStageId) return;

    const draggedIndex = stages.findIndex(s => s.id === draggedStage);
    const targetIndex = stages.findIndex(s => s.id === targetStageId);

    const newStages = [...stages];
    const draggedItem = newStages.splice(draggedIndex, 1)[0];
    newStages.splice(targetIndex, 0, draggedItem);

    // Update order property
    const reorderedStages = newStages.map((stage, index) => ({
      ...stage,
      order: index
    }));

    onStagesUpdate(reorderedStages);
    setDraggedStage(null);
  };

  const addCustomField = (stageId: string) => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      name: 'New Field',
      type: 'text',
      required: false,
      placeholder: '',
      columnId: stageId,
      order: 0
    };

    const updatedStages = stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            customFields: [
              ...(stage.customFields || []),
              { ...newField, order: (stage.customFields || []).length }
            ]
          }
        : stage
    );

    onStagesUpdate(updatedStages);
  };

  const updateCustomField = (stageId: string, fieldId: string, updates: Partial<CustomField>) => {
    const updatedStages = stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            customFields: stage.customFields?.map(field =>
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : stage
    );

    onStagesUpdate(updatedStages);
  };

  const deleteCustomField = (stageId: string, fieldId: string) => {
    const updatedStages = stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            customFields: stage.customFields?.filter(field => field.id !== fieldId)
          }
        : stage
    );

    onStagesUpdate(updatedStages);
  };

  const reorderFields = (stageId: string, fieldId: string, direction: 'up' | 'down') => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage?.customFields) return;

    const currentIndex = stage.customFields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stage.customFields.length) return;

    const reorderedFields = [...stage.customFields];
    const [movedField] = reorderedFields.splice(currentIndex, 1);
    reorderedFields.splice(newIndex, 0, movedField);

    // Update order property
    const fieldsWithOrder = reorderedFields.map((field, index) => ({
      ...field,
      order: index
    }));

    const updatedStages = stages.map(s =>
      s.id === stageId ? { ...s, customFields: fieldsWithOrder } : s
    );

    onStagesUpdate(updatedStages);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <FiSettings className="w-4 h-4" />
        <span>Customize Pipeline</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Pipeline Customization</h3>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          {/* Add New Stage */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Add New Stage</h4>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="Stage name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddStage()}
              />
              <button
                onClick={handleAddStage}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Existing Stages */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Manage Stages</h4>
            <div className="space-y-3">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className="border border-gray-200 rounded-lg"
                  draggable
                  onDragStart={() => handleDragStart(stage.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiGripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                      <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                      {editingStage === stage.id ? (
                        <input
                          type="text"
                          defaultValue={stage.title}
                          onBlur={(e) => handleRenameStage(stage.id, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleRenameStage(stage.id, (e.target as HTMLInputElement).value);
                            }
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{stage.title}</span>
                      )}
                      {stage.isRequired && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedStageFields(
                          expandedStageFields === stage.id ? null : stage.id
                        )}
                        className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        title="Manage Fields"
                      >
                        <FiSettings className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => setEditingStage(editingStage === stage.id ? null : stage.id)}
                        className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        title="Rename Stage"
                      >
                        <FiEdit className="w-4 h-4 text-gray-500" />
                      </button>
                      {!stage.isRequired && (
                        <button
                          onClick={() => handleDeleteStage(stage.id)}
                          className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                          title="Delete Stage"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Custom Fields for Stage */}
                  {expandedStageFields === stage.id && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Custom Fields</h5>
                        <button
                          onClick={() => addCustomField(stage.id)}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm hover:bg-primary-200 flex items-center space-x-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <FiPlus className="w-3 h-3" />
                          <span>Add Field</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {stage.customFields?.map((field) => (
                          <div key={field.id} className="bg-gray-50 p-3 rounded border">
                            <div className="grid grid-cols-12 gap-3 mb-2">
                              <div className="col-span-3">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Field Name</label>
                                <input
                                  type="text"
                                  value={field.name}
                                  onChange={(e) => updateCustomField(stage.id, field.id, { name: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  placeholder="Field name"
                                />
                              </div>
                              <div className="col-span-3">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Field Type</label>
                                <select
                                  value={field.type}
                                  onChange={(e) => updateCustomField(stage.id, field.id, { type: e.target.value as any })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                  {fieldTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-3">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Placeholder</label>
                                <input
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => updateCustomField(stage.id, field.id, { placeholder: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  placeholder="Placeholder text"
                                />
                              </div>
                              <div className="col-span-3 flex items-end justify-between space-x-1">
                                <label className="flex items-center text-xs">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => updateCustomField(stage.id, field.id, { required: e.target.checked })}
                                    className="mr-1 w-3 h-3 text-primary-600 focus:ring-1 focus:ring-primary-500"
                                  />
                                  Required
                                </label>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => reorderFields(stage.id, field.id, 'up')}
                                    className="p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    title="Move Up"
                                  >
                                    <FiChevronUp className="w-3 h-3 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => reorderFields(stage.id, field.id, 'down')}
                                    className="p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    title="Move Down"
                                  >
                                    <FiChevronDown className="w-3 h-3 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => deleteCustomField(stage.id, field.id)}
                                    className="p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                                    title="Delete Field"
                                  >
                                    <FiTrash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {(field.type === 'dropdown' || field.type === 'multiselect') && (
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Options</label>
                                <input
                                  type="text"
                                  value={field.options?.join(', ') || ''}
                                  onChange={(e) => updateCustomField(stage.id, field.id, {
                                    options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                                  })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  placeholder="Options (comma-separated): Option 1, Option 2, Option 3"
                                />
                              </div>
                            )}
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500 italic">No custom fields added yet</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Usage Notes:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Drag and drop stages to reorder them in the pipeline</li>
              <li>• "New Inquiry" and "Enrolled" stages are required and cannot be deleted</li>
              <li>• Custom fields are specific to each stage and appear when cards are expanded</li>
              <li>• Use the up/down arrows to reorder fields within each stage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineCustomization;