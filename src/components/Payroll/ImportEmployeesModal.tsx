import React, { useState } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { enterprisePayrollService } from '../../services/enterprisePayrollService';

interface ImportEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportEmployeesModal: React.FC<ImportEmployeesModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError('');

    try {
      const text = await file.text();
      const employees = enterprisePayrollService.parseCSV(text);

      if (employees.length === 0) {
        setError('No valid employees found in CSV file');
        setImporting(false);
        return;
      }

      const importResult = await enterprisePayrollService.bulkImportEmployees(employees);
      setResult(importResult);

      if (importResult.success > 0) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import employees');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'Employee Number',
      'First Name',
      'Last Name',
      'Email',
      'Department',
      'Job Title',
      'Employment Type',
      'Location',
      'State',
      'Status',
      'Start Date',
      'Annual Salary',
      'Hourly Rate',
    ];

    const sampleData = [
      [
        'EMP001',
        'John',
        'Doe',
        'john.doe@company.com',
        'Engineering',
        'Software Engineer',
        'Full-time',
        'San Francisco',
        'CA',
        'Active',
        '2024-01-15',
        '120000',
        '',
      ],
      [
        'EMP002',
        'Jane',
        'Smith',
        'jane.smith@company.com',
        'Marketing',
        'Marketing Manager',
        'Full-time',
        'New York',
        'NY',
        'Active',
        '2024-02-01',
        '110000',
        '',
      ],
    ];

    const csv = [headers, ...sampleData]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Import Employees</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Import completed!</p>
                <p className="text-sm mt-1">
                  Successfully imported {result.success} employee{result.success !== 1 ? 's' : ''}.
                  {result.errors > 0 && ` ${result.errors} error${result.errors !== 1 ? 's' : ''}.`}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Download the CSV template below</li>
              <li>Fill in your employee data following the template format</li>
              <li>Upload the completed CSV file</li>
              <li>Review and confirm the import</li>
            </ol>
          </div>

          <div>
            <button
              onClick={downloadTemplate}
              className="w-full px-3 py-2 bg-white text-blue-600 rounded text-sm font-medium shadow-sm border border-gray-300 transition-colors hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
              <p className="text-xs text-gray-500">or drag and drop</p>
            </label>
          </div>

          {file && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={importing}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            style={{
              backgroundColor: '#212B36',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#1a2028';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#212B36';
              }
            }}
          >
            {importing ? 'Importing...' : 'Import Employees'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportEmployeesModal;
