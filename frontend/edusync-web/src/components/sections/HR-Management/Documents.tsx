import React, { useState, useRef } from 'react';
import { FiFile, FiUpload, FiSearch, FiFilter } from 'react-icons/fi';

const Documents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
      // Here you would make your API call to upload the files
      // Example: await api.uploadDocuments(formData);
      console.log('Uploading files:', selectedFiles);
      
      // Reset and close dialog after successful upload
      setSelectedFiles([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FiFile className="w-6 h-6 text-primary-600" />
            <span>Documents</span>
          </h1>
          <p className="text-gray-600">Upload documents</p>
        </div>
        <button
          onClick={handleAddDocument}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
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
          />
        </div>
        <button className="flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          <FiFilter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* --- Table or Document list goes here --- */}

      {/* Upload Document Dialog */}
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
    </div>
  );
};

export default Documents;