import React, { useState } from 'react';
import {
  FiPhone, FiMail, FiCalendar, FiClock, FiMessageSquare,
  FiUser, FiBookOpen, FiDollarSign, FiFileText,
  FiChevronDown, FiChevronUp, FiEdit, FiSave, FiX, FiPlus,
  FiMove
} from 'react-icons/fi';
import type { Lead, Task, Communication, KanbanStage } from './types';
import CustomFieldRenderer from './CustomFieldRenderer';

interface ExpandableKanbanCardProps {
  lead: Lead;
  stage: KanbanStage;
  onUpdate: (updatedLead: Lead) => void;
  onMove: (leadId: number, newStageId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  allStages: KanbanStage[];
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

const ExpandableKanbanCard: React.FC<ExpandableKanbanCardProps> = ({
  lead,
  stage,
  onUpdate,
  onMove,
  isExpanded,
  onToggle,
  allStages,
  isDragging = false,
  onDragStart,
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState('');

  const handleSave = () => {
    onUpdate(editedLead);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };

  const addCommunication = (type: 'call' | 'email' | 'meeting') => {
    if (!newNote.trim()) return;

    const newComm: Communication = {
      id: Date.now().toString(),
      type,
      summary: newNote,
      timestamp: new Date().toISOString(),
    };

    const updatedLead = {
      ...editedLead,
      communicationLog: [...(editedLead.communicationLog || []), newComm]
    };

    setEditedLead(updatedLead);
    setNewNote('');
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };

    const updatedLead = {
      ...editedLead,
      taskChecklist: [...(editedLead.taskChecklist || []), task]
    };

    setEditedLead(updatedLead);
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = editedLead.taskChecklist?.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ) || [];

    setEditedLead({
      ...editedLead,
      taskChecklist: updatedTasks
    });
  };

  const handleStageChange = (newStageId: string) => {
    if (newStageId !== lead.status) {
      onMove(lead.id, newStageId);
    }
  };

  const updateCustomField = (fieldId: string, value: any) => {
    setEditedLead({
      ...editedLead,
      customFieldValues: {
        ...editedLead.customFieldValues,
        [fieldId]: value
      }
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 transform rotate-2' : ''
      }`}
      draggable={!isExpanded}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Card Header - Always Visible */}
      <div
        className="p-4 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FiMove
              className={`w-4 h-4 text-gray-400 ${!isExpanded ? 'cursor-grab' : 'cursor-pointer'}`}
            />
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-gray-900 text-sm truncate">{lead.name}</h5>
              <p className="text-xs text-gray-600 mt-1">Parent: {lead.parentName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            {lead.priority === 'high' && (
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" title="High Priority"></div>
            )}
            <button
              className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? <FiX className="w-3 h-3 text-gray-400" /> : <FiEdit className="w-3 h-3 text-gray-400" />}
            </button>
            <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
              {isExpanded ? <FiChevronUp className="w-3 h-3 text-gray-400" /> : <FiChevronDown className="w-3 h-3 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <FiBookOpen className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{lead.grade} • {lead.program}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiCalendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Term: {lead.enrollmentTerm}</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Student Info Section */}
          <div className="space-y-4">
            <h6 className="font-medium text-gray-900 text-sm flex items-center">
              <FiUser className="w-4 h-4 mr-2" />
              Student Information
            </h6>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.name}
                    onChange={(e) => setEditedLead({...editedLead, name: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Grade Level</label>
                {isEditing ? (
                  <select
                    value={editedLead.grade}
                    onChange={(e) => setEditedLead({...editedLead, grade: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{lead.grade}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Program of Interest</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.program}
                    onChange={(e) => setEditedLead({...editedLead, program: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.program}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Expected Enrollment Term</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.enrollmentTerm}
                    onChange={(e) => setEditedLead({...editedLead, enrollmentTerm: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.enrollmentTerm}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Lead Source</label>
                {isEditing ? (
                  <select
                    value={editedLead.source}
                    onChange={(e) => setEditedLead({...editedLead, source: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="Website">Website</option>
                    <option value="School Fair">School Fair</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Online Form">Online Form</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{lead.source}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Assigned Recruiter</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.assignedRecruiter || ''}
                    onChange={(e) => setEditedLead({...editedLead, assignedRecruiter: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Not assigned"
                  />
                ) : (
                  <p className="text-gray-900">{lead.assignedRecruiter || 'Not assigned'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h6 className="font-medium text-gray-900 text-sm flex items-center">
              <FiPhone className="w-4 h-4 mr-2" />
              Contact Details
            </h6>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedLead.email}
                    onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedLead.phone}
                    onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.phone}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Preferred Contact Method</label>
                {isEditing ? (
                  <select
                    value={editedLead.preferredContactMethod || ''}
                    onChange={(e) => setEditedLead({...editedLead, preferredContactMethod: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select method</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text Message</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{lead.preferredContactMethod || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress & Status Section */}
          <div className="space-y-4">
            <h6 className="font-medium text-gray-900 text-sm flex items-center">
              <FiClock className="w-4 h-4 mr-2" />
              Progress & Status
            </h6>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Current Stage</label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {allStages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status Notes</label>
                {isEditing ? (
                  <textarea
                    value={editedLead.statusNotes || ''}
                    onChange={(e) => setEditedLead({...editedLead, statusNotes: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                    rows={2}
                    placeholder="Internal notes about current status..."
                  />
                ) : (
                  <p className="text-gray-900 text-xs">{lead.statusNotes || 'No status notes'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Next Follow-up Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedLead.nextFollowUpDate || ''}
                    onChange={(e) => setEditedLead({...editedLead, nextFollowUpDate: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.nextFollowUpDate || lead.followUpDate}</p>
                )}
              </div>

              {/* Task Checklist */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Task Checklist</label>
                <div className="space-y-2">
                  {editedLead.taskChecklist?.map((task) => (
                    <div key={task.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-3 h-3 text-primary-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <span className={`text-xs flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}

                  {isEditing && (
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add new task..."
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      />
                      <button
                        onClick={addTask}
                        className="p-1 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Fields for Current Stage */}
          {stage.customFields && stage.customFields.length > 0 && (
            <div className="space-y-4">
              <h6 className="font-medium text-gray-900 text-sm flex items-center">
                <FiFileText className="w-4 h-4 mr-2" />
                Stage-Specific Fields
              </h6>
              <div className="grid grid-cols-2 gap-4">
                {stage.customFields.map((field) => (
                  <CustomFieldRenderer
                    key={field.id}
                    field={field}
                    value={editedLead.customFieldValues?.[field.id]}
                    onChange={(value) => updateCustomField(field.id, value)}
                    isEditing={isEditing}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Communication Log Section */}
          <div className="space-y-4">
            <h6 className="font-medium text-gray-900 text-sm flex items-center">
              <FiMessageSquare className="w-4 h-4 mr-2" />
              Communication Log
            </h6>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {editedLead.communicationLog?.map((comm) => (
                <div key={comm.id} className="bg-gray-50 p-2 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium capitalize">{comm.type}</span>
                    <span className="text-gray-500">
                      {new Date(comm.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comm.summary}</p>
                </div>
              )) || <p className="text-xs text-gray-500">No communications logged</p>}
            </div>

            {isEditing && (
              <div className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add communication note..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => addCommunication('call')}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    Log Call
                  </button>
                  <button
                    onClick={() => addCommunication('email')}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    Log Email
                  </button>
                  <button
                    onClick={() => addCommunication('meeting')}
                    className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    Log Meeting
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Financial/Enrollment Info Section */}
          <div className="space-y-4">
            <h6 className="font-medium text-gray-900 text-sm flex items-center">
              <FiDollarSign className="w-4 h-4 mr-2" />
              Financial & Enrollment Info
            </h6>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estimated Tuition Value</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedLead.estimatedTuitionValue || ''}
                    onChange={(e) => setEditedLead({...editedLead, estimatedTuitionValue: Number(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="0"
                  />
                ) : (
                  <p className="text-gray-900">
                    {lead.estimatedTuitionValue ? `$${lead.estimatedTuitionValue.toLocaleString()}` : 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Scholarship Requested</label>
                {isEditing ? (
                  <select
                    value={editedLead.scholarshipRequested ? 'yes' : 'no'}
                    onChange={(e) => setEditedLead({...editedLead, scholarshipRequested: e.target.value === 'yes'})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{lead.scholarshipRequested ? 'Yes' : 'No'}</p>
                )}
              </div>

              {(editedLead.scholarshipRequested || lead.scholarshipRequested) && (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Scholarship Notes</label>
                  {isEditing ? (
                    <textarea
                      value={editedLead.scholarshipNotes || ''}
                      onChange={(e) => setEditedLead({...editedLead, scholarshipNotes: e.target.value})}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                      rows={2}
                      placeholder="Scholarship requirements, amount requested, etc."
                    />
                  ) : (
                    <p className="text-gray-900 text-xs">{lead.scholarshipNotes || 'No notes'}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Call">
                <FiPhone className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Email">
                <FiMail className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Schedule">
                <FiCalendar className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 flex items-center space-x-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <FiSave className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableKanbanCard;