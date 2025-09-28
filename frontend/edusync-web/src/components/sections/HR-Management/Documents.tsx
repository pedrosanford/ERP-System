import React, { useState, useRef } from 'react';
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

interface Document {
  id: string;
  title: string;
  type: 'Contract' | 'Policy' | 'Agreement' | 'Report' | 'Form';
  category: 'HR' | 'Legal' | 'Financial' | 'Administrative' | 'Employee';
  dateCreated: string;
  lastModified: string;
  status: 'Active' | 'Draft' | 'Expired' | 'Pending Review';
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'DOC';
  creator: string;
  description: string;
  tags: string[];
  previewUrl?: string;
}

const Documents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

  const handlePreview = (doc: Document) => {
    setPreviewDocument(doc);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };


  // Your existing handlers
  function handleAddDocument() {
    setIsDialogOpen(true);
  }

  function handleClose() {
    setIsDialogOpen(false);
    setSelectedFiles([]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      console.log('Uploading files:', selectedFiles);
      setSelectedFiles([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  }

  // Mock documents data
  const documents: Document[] = [
    {
      id: "DOC-2025-001",
      title: "Employment Contract Template",
      type: "Contract",
      category: "HR",
      dateCreated: "2025-01-15",
      lastModified: "2025-08-20",
      status: "Active",
      fileSize: "245 KB",
      fileType: "PDF",
      creator: "HR Department",
      description: "Standard employment contract template for full-time employees",
      tags: ["contract", "employment", "hr", "template"]
    },
    {
      id: "DOC-2025-002",
      title: "Non-Disclosure Agreement",
      type: "Agreement",
      category: "Legal",
      dateCreated: "2025-02-01",
      lastModified: "2025-08-15",
      status: "Active",
      fileSize: "180 KB",
      fileType: "PDF",
      creator: "Legal Department",
      description: "Confidentiality agreement for employees and contractors",
      tags: ["nda", "confidentiality", "legal"],
      previewUrl: "file:///C:/Users/dylan/Downloads/bcd_increment_design.pdf"
    },
    // ... [Add the rest of the mock documents here]
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(documents.map(doc => doc.category))];

  return (
      <div className="space-y-6">
        {/* Keep your existing header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FiFile className="w-6 h-6 text-primary-600" />
              <span>Documents</span>
            </h1>
            <p className="text-gray-600">Upload and manage documents</p>
          </div>
          <button
              onClick={handleAddDocument}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <FiUpload className="w-4 h-4" />
            <span>Upload Document(s)</span>
          </button>
        </div>

        {/* Modified Search + Filter */}
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

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{doc.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                      doc.status === 'Active' ? 'bg-green-100 text-green-800' :
                          doc.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                              doc.status === 'Expired' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                  }`}>
                                {doc.status}
                            </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiPaperclip className="w-4 h-4 mr-2" />
                    <span>{doc.fileType} • {doc.fileSize}</span>
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
                  <button className="text-primary-600 hover:text-primary-800 flex items-center space-x-1">
                    <FiEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                      onClick={() => handlePreview(doc)}
                      className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>

                </div>
              </div>
          ))}
        </div>

        {/* Keep your existing Upload Document Dialog */}
        {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
        {previewDocument && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">{previewDocument.title}</h3>
                    <p className="text-sm text-gray-500">
                      {previewDocument.fileType} • {previewDocument.fileSize}
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
                  {previewDocument.previewUrl ? (
                      <iframe
                          src={previewDocument.previewUrl}
                          className="w-full h-full rounded border bg-white"
                          title={`Preview of ${previewDocument.title}`}
                      />
                  ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No preview available</p>
                      </div>
                  )}
                </div>
                <div className="p-4 border-t flex justify-end space-x-4">
                  <button
                      onClick={closePreview}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                  >
                    <FiDownload className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Documents;