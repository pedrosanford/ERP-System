import React, { useState, useEffect } from 'react';
import {
  FiMail, FiPlus, FiTrash2, FiCopy, FiSearch, FiFilter, FiX, FiSave, FiSend, FiClock, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import salesService, { type Lead } from '../../../services/salesService';

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

interface SentEmail {
  id: number;
  templateId: number;
  templateName: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
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
EduSync Academy Admissions Team
Phone: {{recruiterPhone}}
Email: {{recruiterEmail}}`,
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
- Completed application form
- Academic transcripts
- Recommendation letters
- Application fee payment

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
📍 Location: EduSync Academy Main Campus, Building A, Room 101
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
    },
    {
      id: 4,
      name: 'Acceptance Letter',
      subject: '🎉 Congratulations! {{studentName}} has been accepted to EduSync Academy',
      body: `Dear {{parentName}},

Congratulations! We are delighted to inform you that {{studentName}} has been accepted into our {{program}} program for the {{enrollmentTerm}} semester.

NEXT STEPS:
1. Review and sign the enrollment agreement (attached)
2. Submit enrollment deposit of $500 by {{deadline}}
3. Complete health and emergency contact forms
4. Schedule orientation session

Your enrollment package includes:
✓ Tuition information and payment plan options
✓ Campus housing information (if applicable)
✓ Academic calendar and important dates
✓ New student orientation details

We're thrilled to welcome {{studentName}} to the EduSync Academy family!

Best regards,
{{recruiterName}}
Director of Admissions
EduSync Academy`,
      category: 'Enrollment',
      tags: ['acceptance', 'congratulations', 'enrollment'],
      createdAt: '2025-01-03',
      updatedAt: '2025-01-08',
      usageCount: 8
    },
    {
      id: 5,
      name: 'Follow-up After Tour',
      subject: 'Thank you for visiting EduSync Academy!',
      body: `Dear {{parentName}},

Thank you for taking the time to tour EduSync Academy yesterday! It was wonderful meeting you and {{studentName}}.

We hope you were impressed by our facilities, faculty, and the vibrant learning environment we provide.

As discussed, here are the next steps:
1. Review the program information packet (attached)
2. Complete the online application by {{deadline}}
3. Schedule an interview (if not already completed)

I'm here to answer any questions you may have. Please don't hesitate to reach out!

Looking forward to hearing from you soon.

Best regards,
{{recruiterName}}
Admissions Counselor
{{recruiterPhone}} | {{recruiterEmail}}`,
      category: 'Follow-up',
      tags: ['follow-up', 'campus-tour', 'thank-you'],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-05',
      usageCount: 15
    },
    {
      id: 6,
      name: 'Scholarship Opportunity',
      subject: '💰 Scholarship Opportunity for {{studentName}}',
      body: `Dear {{parentName}},

Great news! Based on {{studentName}}'s academic achievements, we'd like to inform you about scholarship opportunities available for the {{enrollmentTerm}} semester.

AVAILABLE SCHOLARSHIPS:
• Academic Excellence Scholarship: Up to 50% tuition
• Merit-Based Scholarship: $5,000 - $10,000
• Need-Based Financial Aid: Varies based on family income

To apply, please submit:
- Completed scholarship application form
- Most recent academic transcripts
- Two letters of recommendation
- Personal essay (500 words)

Application deadline: {{deadline}}

Don't miss this opportunity to make education more affordable!

Best regards,
{{recruiterName}}
Financial Aid Office
EduSync Academy`,
      category: 'Financial',
      tags: ['scholarship', 'financial-aid', 'opportunity'],
      createdAt: '2024-12-28',
      updatedAt: '2025-01-02',
      usageCount: 6
    }
  ]);

  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSendMode, setIsSendMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
    'Financial',
    'General'
  ];

  // Load leads on component mount
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const allLeads = await salesService.getAllLeads();
      setLeads(allLeads);
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

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
        id: Math.max(...templates.map(t => t.id), 0) + 1,
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
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
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
      alert('✅ Template saved successfully!');
    }
  };

  const replaceVariables = (text: string, lead: Lead): string => {
    if (!lead) return text;
    
    return text
      .replace(/\{\{studentName\}\}/g, lead.name || '')
      .replace(/\{\{parentName\}\}/g, lead.parentName || '')
      .replace(/\{\{program\}\}/g, lead.program || '')
      .replace(/\{\{recruiterName\}\}/g, 'John Smith')
      .replace(/\{\{recruiterPhone\}\}/g, '+1 (555) 123-4567')
      .replace(/\{\{recruiterEmail\}\}/g, 'admissions@edusync.edu')
      .replace(/\{\{deadline\}\}/g, lead.enrollmentDeadline || 'TBD')
      .replace(/\{\{interviewDate\}\}/g, lead.interviewDate || 'TBD')
      .replace(/\{\{interviewTime\}\}/g, '10:00 AM')
      .replace(/\{\{interviewer\}\}/g, lead.interviewer || 'Admissions Team')
      .replace(/\{\{enrollmentTerm\}\}/g, lead.enrollmentTerm || 'Fall 2025')
      .replace(/\{\{location\}\}/g, 'EduSync Academy Main Campus');
  };

  const handleSendEmail = () => {
    if (!selectedTemplate || !selectedLead) {
      alert('Please select a template and a lead');
      return;
    }

    const filledSubject = replaceVariables(selectedTemplate.subject, selectedLead);

    const sentEmail: SentEmail = {
      id: sentEmails.length + 1,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      recipientName: selectedLead.name,
      recipientEmail: selectedLead.email,
      subject: filledSubject,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    setSentEmails([sentEmail, ...sentEmails]);
    
    // Update usage count
    setTemplates(templates.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, usageCount: t.usageCount + 1 } 
        : t
    ));

    setIsSendMode(false);
    setSelectedLead(null);
    alert(`✅ Email sent successfully to ${selectedLead.name} (${selectedLead.email})!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiMail className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
            <p className="text-sm text-gray-600">Create and manage email templates for sales communications</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateMode(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'templates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              Sent History ({sentEmails.length})
              {sentEmails.length > 0 && (
                <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs">
                  {sentEmails.filter(e => e.status === 'sent').length} sent
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <>
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
              <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
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
                        <h4 className="font-semibold text-gray-900 text-sm flex-1">{template.name}</h4>
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
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.subject}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.category === 'Lead Nurturing' ? 'bg-blue-100 text-blue-700' :
                          template.category === 'Application Process' ? 'bg-orange-100 text-orange-700' :
                          template.category === 'Interview Process' ? 'bg-purple-100 text-purple-700' :
                          template.category === 'Enrollment' ? 'bg-green-100 text-green-700' :
                          template.category === 'Financial' ? 'bg-yellow-100 text-yellow-700' :
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
                      <h3 className="text-xl font-bold text-gray-900">
                        {isPreviewMode ? 'Template Preview' : 'Edit Template'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLead(null);
                            setIsSendMode(true);
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <FiSend className="w-4 h-4" />
                          Send Email
                        </button>
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
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedTemplate.name}</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-600">Subject:</span>
                              <p className="text-gray-900 mt-1">{selectedTemplate.subject}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Body:</span>
                              <div className="mt-1 whitespace-pre-wrap text-gray-900 text-sm leading-relaxed bg-white p-4 rounded border border-gray-200">
                                {selectedTemplate.body}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedTemplate.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
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
                            rows={14}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
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

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Available Variables:
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{studentName}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{parentName}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{program}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{recruiterName}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{recruiterPhone}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{recruiterEmail}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{deadline}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{interviewDate}}'}</code>
                            <code className="bg-white px-2 py-1 rounded text-blue-700">{'{{enrollmentTerm}}'}</code>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setEditingTemplate(selectedTemplate);
                              setIsPreviewMode(true);
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
                  <FiMail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
                  <p className="text-gray-600">Choose a template from the list to view or edit it</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Email History Tab */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sent Email History</h3>
            <p className="text-sm text-gray-600 mt-1">Track all emails sent using templates</p>
          </div>
          
          {sentEmails.length === 0 ? (
            <div className="p-12 text-center">
              <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No emails sent yet</h4>
              <p className="text-gray-600">Start sending emails using templates to see them here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sentEmails.map(email => (
                <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          email.status === 'sent' ? 'bg-green-100' :
                          email.status === 'pending' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          {email.status === 'sent' ? (
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                          ) : email.status === 'pending' ? (
                            <FiClock className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <FiAlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{email.subject}</h4>
                          <p className="text-sm text-gray-600">
                            To: {email.recipientName} ({email.recipientEmail})
                          </p>
                        </div>
                      </div>
                      <div className="ml-13 space-y-1">
                        <p className="text-xs text-gray-500">
                          Template: <span className="font-medium text-gray-700">{email.templateName}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Sent: {new Date(email.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      email.status === 'sent' ? 'bg-green-100 text-green-700' :
                      email.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
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

      {/* Send Email Modal */}
      {isSendMode && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Send Email</h2>
              <button
                onClick={() => {
                  setIsSendMode(false);
                  setSelectedLead(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Recipient *</label>
                <select
                  value={selectedLead?.id || ''}
                  onChange={(e) => {
                    const lead = leads.find(l => l.id === parseInt(e.target.value));
                    setSelectedLead(lead || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Select a lead --</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} - {lead.email} ({lead.program})
                    </option>
                  ))}
                </select>
              </div>

              {selectedLead && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Email Preview:</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-blue-700">To:</span>
                        <p className="text-blue-900">{selectedLead.name} ({selectedLead.email})</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-700">Subject:</span>
                        <p className="text-blue-900">{replaceVariables(selectedTemplate.subject, selectedLead)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-700">Body:</span>
                        <div className="mt-1 bg-white p-4 rounded border border-blue-200 whitespace-pre-wrap text-sm text-blue-900">
                          {replaceVariables(selectedTemplate.body, selectedLead)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsSendMode(false);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!selectedLead}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiSend className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;
