import React, { useState } from 'react';
import {
  FiMail, FiPlus, FiTrash2, FiCopy, FiSearch, FiFilter, FiX, FiSave
} from 'react-icons/fi';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: 'Welcome New Lead',
      subject: 'Welcome to EduSync Academy - Your Educational Journey Begins Here!',
      body: `Dear {{parentName}},

Thank you for your interest in EduSync Academy for {{studentName}}. We're excited to learn more about your educational goals and how we can support {{studentName}}'s academic journey.

Our admissions team will be in touch within 24 hours to schedule a campus tour and answer any questions you may have about our {{program}} program.

In the meantime, please don't hesitate to reach out if you need any additional information.

Best regards,
{{recruiterName}}
EduSync Academy Admissions Team`,
      category: 'Lead Nurturing',
      tags: ['welcome', 'new-lead', 'first-contact'],
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15',
      usageCount: 24
    },
    {
      id: 2,
      name: 'Application Reminder',
      subject: 'Application Deadline Approaching - {{studentName}}',
      body: `Dear {{parentName}},

This is a friendly reminder that the application deadline for {{studentName}} is approaching on {{deadline}}.

To complete the application process, we still need:
- {{missingDocuments}}

Please submit these documents at your earliest convenience to ensure {{studentName}}'s application is processed on time.

If you have any questions or need assistance, please don't hesitate to contact me directly.

Best regards,
{{recruiterName}}
Direct: {{recruiterPhone}}
Email: {{recruiterEmail}}`,
      category: 'Application Process',
      tags: ['reminder', 'deadline', 'documents'],
      createdAt: '2025-01-08',
      updatedAt: '2025-01-12',
      usageCount: 18
    },
    {
      id: 3,
      name: 'Interview Confirmation',
      subject: 'Interview Confirmation - {{studentName}} at EduSync Academy',
      body: `Dear {{parentName}},

We're pleased to confirm {{studentName}}'s interview appointment:

📅 Date: {{interviewDate}}
⏰ Time: {{interviewTime}}
📍 Location: {{location}}
👤 Interviewer: {{interviewer}}

Please arrive 15 minutes early and bring:
- Photo ID
- Academic transcripts
- Portfolio (if applicable)

We look forward to meeting you and {{studentName}}!

Best regards,
{{recruiterName}}
EduSync Academy Admissions Team`,
      category: 'Interview Process',
      tags: ['interview', 'confirmation', 'appointment'],
      createdAt: '2025-01-05',
      updatedAt: '2025-01-10',
      usageCount: 12
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    category: 'Lead Nurturing',
    tags: []
  });

  const categories = [
    'Lead Nurturing',
    'Application Process',
    'Interview Process',
    'Enrollment',
    'Follow-up',
    'General'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.body) {
      const template: EmailTemplate = {
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: newTemplate.name!,
        subject: newTemplate.subject!,
        body: newTemplate.body!,
        category: newTemplate.category!,
        tags: newTemplate.tags || [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', subject: '', body: '', category: 'Lead Nurturing', tags: [] });
      setIsCreateMode(false);
    }
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
    }
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: Math.max(...templates.map(t => t.id)) + 1,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    setTemplates([...templates, duplicated]);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate && selectedTemplate) {
      const updatedTemplates = templates.map(t =>
        t.id === selectedTemplate.id
          ? { ...editingTemplate, updatedAt: new Date().toISOString().split('T')[0] }
          : t
      );
      setTemplates(updatedTemplates);
      setSelectedTemplate(editingTemplate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Create and manage email templates for sales communications</p>
        </div>
        <button
          onClick={() => setIsCreateMode(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} of {templates.length} templates
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedTemplate?.id === template.id
                    ? 'border-primary-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedTemplate(template);
                  setEditingTemplate(template);
                  setIsPreviewMode(true);
                }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(template);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Duplicate"
                      >
                        <FiCopy className="w-3 h-3 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 truncate">{template.subject}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.category === 'Lead Nurturing' ? 'bg-blue-100 text-blue-700' :
                      template.category === 'Application Process' ? 'bg-orange-100 text-orange-700' :
                      template.category === 'Interview Process' ? 'bg-purple-100 text-purple-700' :
                      template.category === 'Enrollment' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">{template.usageCount} uses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Editor/Viewer */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isPreviewMode ? 'Preview Template' : 'Edit Template'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        isPreviewMode
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {isPreviewMode ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {isPreviewMode ? (
                  <>
                    {/* Preview Mode */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-600">Subject:</span>
                          <p className="text-gray-900 mt-1">{selectedTemplate.subject}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Body:</span>
                          <div className="mt-1 whitespace-pre-wrap text-gray-900 text-sm leading-relaxed">
                            {selectedTemplate.body}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                      <input
                        type="text"
                        value={editingTemplate?.name || ''}
                        onChange={(e) => setEditingTemplate(editingTemplate ? {...editingTemplate, name: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                      <input
                        type="text"
                        value={editingTemplate?.subject || ''}
                        onChange={(e) => setEditingTemplate(editingTemplate ? {...editingTemplate, subject: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
                      <textarea
                        value={editingTemplate?.body || ''}
                        onChange={(e) => setEditingTemplate(editingTemplate ? {...editingTemplate, body: e.target.value} : null)}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={editingTemplate?.category || ''}
                          onChange={(e) => setEditingTemplate(editingTemplate ? {...editingTemplate, category: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <input
                          type="text"
                          value={editingTemplate?.tags?.join(', ') || ''}
                          onChange={(e) => setEditingTemplate(editingTemplate ? {
                            ...editingTemplate,
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          } : null)}
                          placeholder="Enter tags separated by commas"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Available Variables:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700">
                        <span>{'{{studentName}}'}</span>
                        <span>{'{{parentName}}'}</span>
                        <span>{'{{program}}'}</span>
                        <span>{'{{recruiterName}}'}</span>
                        <span>{'{{recruiterPhone}}'}</span>
                        <span>{'{{recruiterEmail}}'}</span>
                        <span>{'{{deadline}}'}</span>
                        <span>{'{{interviewDate}}'}</span>
                        <span>{'{{interviewTime}}'}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setEditingTemplate(selectedTemplate);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveTemplate}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save Template</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
              <p className="text-gray-600">Choose a template from the list to view or edit it</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {isCreateMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Template</h2>
              <button
                onClick={() => setIsCreateMode(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                <input
                  type="text"
                  value={newTemplate.subject || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Body *</label>
                <textarea
                  value={newTemplate.body || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTemplate.category || 'Lead Nurturing'}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newTemplate.tags?.join(', ') || ''}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateMode(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;