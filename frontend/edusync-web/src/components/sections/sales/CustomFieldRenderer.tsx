import React from 'react';
import { FiStar, FiUpload, FiLink, FiUser } from 'react-icons/fi';
import type { CustomField } from './types';

interface CustomFieldRendererProps {
  field: CustomField;
  value: any;
  onChange: (value: any) => void;
  isEditing: boolean;
}

const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({
  field,
  value,
  onChange,
  isEditing
}) => {
  const renderField = () => {
    if (!isEditing) {
      return (
        <div className="text-gray-900 text-xs">
          {formatDisplayValue(field.type, value)}
        </div>
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );

      case 'longtext':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );

      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-1">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-3 h-3 text-primary-600 rounded"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">$</span>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(Number(e.target.value))}
              placeholder={field.placeholder}
              className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        );

      case 'percentage':
        return (
          <div className="relative">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(Number(e.target.value))}
              placeholder={field.placeholder}
              min="0"
              max="100"
              className="w-full pr-6 pl-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">%</span>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="w-3 h-3 text-primary-600 rounded"
            />
            <span>{field.placeholder || 'Yes/No'}</span>
          </label>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`p-0 ${
                  value >= star ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                <FiStar className={`w-4 h-4 ${value >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={value || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">{value || 0}%</div>
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={(e) => onChange(e.target.files?.[0])}
              className="hidden"
              id={`file-${field.id}`}
            />
            <label
              htmlFor={`file-${field.id}`}
              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-200"
            >
              <FiUpload className="w-3 h-3" />
              <span>Choose File</span>
            </label>
            {value && (
              <span className="text-xs text-gray-600 truncate">
                {typeof value === 'object' ? value.name : value}
              </span>
            )}
          </div>
        );

      case 'url':
        return (
          <div className="relative">
            <FiLink className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || 'https://'}
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChange(e.target.files?.[0])}
              className="hidden"
              id={`image-${field.id}`}
            />
            <label
              htmlFor={`image-${field.id}`}
              className="flex items-center justify-center w-full p-2 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-200"
            >
              <FiUpload className="w-3 h-3 mr-1" />
              Choose Image
            </label>
            {value && (
              <div className="text-xs text-gray-600">
                {typeof value === 'object' ? value.name : 'Image selected'}
              </div>
            )}
          </div>
        );

      case 'lookup':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Select record...</option>
            {/* This would typically be populated from another module */}
            <option value="record1">Record 1</option>
            <option value="record2">Record 2</option>
          </select>
        );

      case 'user':
        return (
          <div className="relative">
            <FiUser className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Assign to...</option>
              <option value="john.smith">John Smith</option>
              <option value="maria.garcia">Maria Garcia</option>
              <option value="david.wilson">David Wilson</option>
            </select>
          </div>
        );

      case 'signature':
        return (
          <div className="border border-gray-300 rounded p-2 bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">Signature Field</div>
            <div className="h-16 bg-white border border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-400">
              Click to sign
            </div>
            {value && (
              <div className="text-xs text-green-600 mt-1">✓ Signed</div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        );
    }
  };

  const formatDisplayValue = (type: string, value: any): string => {
    if (!value && value !== 0) return 'Not set';

    switch (type) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'time':
        return value;
      case 'checkbox':
        return value ? 'Yes' : 'No';
      case 'rating':
        return `${value}/5 stars`;
      case 'progress':
        return `${value}%`;
      case 'multiselect':
        return Array.isArray(value) ? value.join(', ') : 'None selected';
      case 'file':
      case 'image':
        return typeof value === 'object' ? value.name : value;
      case 'signature':
        return value ? 'Signed' : 'Not signed';
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500">
        {field.name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

export default CustomFieldRenderer;