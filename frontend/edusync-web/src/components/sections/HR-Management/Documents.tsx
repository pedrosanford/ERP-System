import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiFile,
  FiUpload,
  FiSearch,
  FiDownload,
  FiEye,
  FiPaperclip,
  FiClock,
  FiCalendar,
  FiX
} from 'react-icons/fi';
import hrService from '../../../services/hrService';

interface Document {
  id: string;
  title: string;
  type: 'CONTRACT' | 'RESUME' | 'ID_COPY' | 'CERTIFICATE' | 'PERFORMANCE_REVIEW' | 'MEDICAL_CERTIFICATE' | 'TRAINING_CERTIFICATE' | 'REFERENCE_LETTER' | 'BANK_DETAILS' | 'EMERGENCY_CONTACT' | 'OTHER';
  category: 'HR' | 'LEGAL' | 'FINANCIAL' | 'ADMINISTRATIVE' | 'EMPLOYEE';
  dateCreated: string;
  lastModified: string;
  status: 'ACTIVE' | 'DRAFT' | 'EXPIRED' | 'PENDING_REVIEW';
  fileSize: number;
  fileType: string;
  creator: string;
  description: string;
  tags: string[];
  fileName: string;
}

interface UploadFormData {
  title: string;
  type: string;
  category: string;
  description: string;
  tags: string;
}

const Documents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    type: 'OTHER',
    category: 'HR',
    description: '',
    tags: ''
  });

  // Get API base URL
  // Use Gateway (port 8080) or direct HR service (port 8082) for testing
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  // For direct HR service testing (bypass gateway): use 'http://localhost:8082' and change path to /hr/...

  // Fetch staff ID on component mount
  useEffect(() => {
    const fetchStaffId = async () => {
      try {
        const staffList = await hrService.getAllStaff();
        if (staffList.length > 0) {
          // Use the first staff member's ID
          setStaffId(staffList[0].id || 1);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        // Fallback to default staff ID
        setStaffId(1);
      }
    };
    fetchStaffId();
  }, []);

  // Fetch documents from backend
  useEffect(() => {
    if (staffId !== null) {
      fetchDocuments();
    }
  }, [searchTerm, selectedCategory, staffId]);

  const fetchDocuments = async () => {
    if (staffId === null) return;
    
    try {
      setLoading(true);
      // Build query params for search if needed (backend might support this in future)
      const params = new URLSearchParams();
      if (searchTerm) {
        // Note: Backend might not support search yet, so we filter on frontend
      }
      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/hr/staff/${staffId}/documents${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Filter by category and search term on frontend
        let filteredData = data;
        if (selectedCategory !== 'All') {
          // Note: Backend might not have category field, so we filter on frontend
          filteredData = filteredData.filter((doc: any) => 
            doc.documentType?.toUpperCase() === selectedCategory.toUpperCase()
          );
        }
        if (searchTerm) {
          filteredData = filteredData.filter((doc: any) => 
            doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setDocuments(filteredData.map((doc: any) => ({
          id: doc.id.toString(),
          title: doc.title || doc.fileName || 'Untitled',
          type: (doc.documentType || doc.type || 'OTHER').toUpperCase(),
          category: 'HR', // Default category
          dateCreated: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : (doc.dateCreated ? new Date(doc.dateCreated).toLocaleDateString() : new Date().toLocaleDateString()),
          lastModified: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : (doc.lastModified ? new Date(doc.lastModified).toLocaleDateString() : new Date().toLocaleDateString()),
          status: doc.status || 'ACTIVE',
          fileSize: doc.fileSize || 0,
          fileType: doc.contentType || 'application/pdf',
          creator: doc.creator || doc.staff?.fullName || 'Unknown',
          description: doc.description || '',
          tags: doc.tags || [],
          fileName: doc.fileName || 'document.pdf'
        })));
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (doc: Document) => {
    setPreviewDocument(doc);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  const handleDownload = async (docId: string, fileName: string) => {
    if (staffId === null) {
      alert('Staff ID not available');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/documents/${docId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document. Please try again.');
    }
  };

  function handleAddDocument() {
    setIsDialogOpen(true);
  }

  function handleClose() {
    setIsDialogOpen(false);
    setSelectedFiles([]);
    setFormData({
      title: '',
      type: 'OTHER',
      category: 'HR',
      description: '',
      tags: ''
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update your handleSubmit function around line 171
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (staffId === null) {
      alert('Staff ID not available. Please try again.');
      return;
    }

    if (!selectedFiles.length || !formData.title) {
      alert('Please select a file and fill in the title');
      return;
    }

    // Backend expects only one file at a time
    const file = selectedFiles[0];
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`File size exceeds maximum allowed size of 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
      alert(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`);
      return;
    }

    const uploadFormData = new FormData();

    // Backend expects: file, documentType, description
    uploadFormData.append('file', file);
    uploadFormData.append('documentType', formData.type);
    uploadFormData.append('description', formData.description || formData.title);

    try {
      setLoading(true);
      
      // Use Gateway - StripPrefix=1 removes /api, so /api/hr/staff/1/upload becomes /hr/staff/1/upload
      const response = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/documents/upload`, {
        method: 'POST',
        body: uploadFormData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.error('Upload error response:', errorText);
          
          // Try to parse as JSON for structured error messages
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorText;
          } catch {
            // If not JSON, use the text as is
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        alert(errorMessage);
        return;
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      // Refresh documents list and close dialog
      await fetchDocuments();
      handleClose();
      
      // Reset form
      setSelectedFiles([]);
      setFormData({
        title: '',
        type: 'OTHER',
        category: 'HR',
        description: '',
        tags: ''
      });

      // Show success message
      alert('Document uploaded successfully!');

    } catch (error: any) {
      console.error('Upload failed:', error);
      
      let errorMessage = 'Upload failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categories = ['All', 'HR', 'LEGAL', 'FINANCIAL', 'ADMINISTRATIVE', 'EMPLOYEE'];

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiFile className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              <p className="text-sm text-gray-600">Upload and manage documents</p>
            </div>
          </div>
          <button
              onClick={handleAddDocument}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              disabled={loading}
          >
            <FiUpload className="w-4 h-4" />
            <span>Upload Document(s)</span>
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1">
            <FiSearch className="text-gray-400 w-4 h-4 mr-2" />
            <input
                type="text"
                placeholder="Search Documents..."
                className="w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
              className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
                <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Loading indicator */}
        {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
        )}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{doc.fileName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                      doc.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          doc.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                              doc.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                  }`}>
                {doc.status.replace('_', ' ')}
              </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiPaperclip className="w-4 h-4 mr-2" />
                    <span>{doc.fileType} • {formatFileSize(doc.fileSize)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    <span>Created: {doc.dateCreated}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-2" />
                    <span>Modified: {doc.lastModified}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.map((tag, index) => (
                      <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                      >
                  {tag}
                </span>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button
                      onClick={() => handlePreview(doc)}
                      className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                      className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
          ))}
        </div>

        {/* Upload Document Dialog */}
        {isDialogOpen && createPortal(
            <div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]" 
              style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleClose();
                }
              }}
            >
              <div 
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Title Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                    />
                  </div>

                  {/* Type and Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                          name="type"
                          value={formData.type}
                          onChange={handleFormChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="CONTRACT">Contract</option>
                        <option value="RESUME">Resume</option>
                        <option value="ID_COPY">ID Copy</option>
                        <option value="CERTIFICATE">Certificate</option>
                        <option value="PERFORMANCE_REVIEW">Performance Review</option>
                        <option value="MEDICAL_CERTIFICATE">Medical Certificate</option>
                        <option value="TRAINING_CERTIFICATE">Training Certificate</option>
                        <option value="REFERENCE_LETTER">Reference Letter</option>
                        <option value="BANK_DETAILS">Bank Details</option>
                        <option value="EMERGENCY_CONTACT">Emergency Contact</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                          name="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="HR">HR</option>
                        <option value="LEGAL">Legal</option>
                        <option value="FINANCIAL">Financial</option>
                        <option value="ADMINISTRATIVE">Administrative</option>
                        <option value="EMPLOYEE">Employee</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Brief description of the document..."
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter tags separated by commas"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    <div className="text-center">
                      <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                      >
                        <FiUpload className="w-5 h-5 mr-2" />
                        Select Files
                      </button>
                      <p className="mt-2 text-sm text-gray-600">
                        or drag and drop your files here
                      </p>
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected files:</h4>
                          <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </li>
                            ))}
                          </ul>
                        </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        disabled={loading}
                    >
                      {loading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
        )}

        {/* Preview Dialog */}
        {previewDocument && createPortal(
            <div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]" 
              style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closePreview();
                }
              }}
            >
              <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">{previewDocument.title}</h3>
                    <p className="text-sm text-gray-500">
                      {previewDocument.fileType} • {formatFileSize(previewDocument.fileSize)}
                    </p>
                  </div>
                  <button
                      onClick={closePreview}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-hidden bg-gray-50">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Document preview not available</p>
                  </div>
                </div>
                <div className="p-4 border-t flex justify-end space-x-4">
                  <button
                      onClick={closePreview}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                      onClick={() => handleDownload(previewDocument.id, previewDocument.fileName)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                  >
                    <FiDownload className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>,
            document.body
        )}
      </div>
  );
};

export default Documents;