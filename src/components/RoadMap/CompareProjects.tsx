import React, { useState } from 'react';
import { ArrowLeftRight, ChevronDown, X } from 'lucide-react';
import type { RoadmapProject } from '../../types/roadmap';

interface CompareProjectsProps {
  projects: RoadmapProject[];
}

const CompareProjects: React.FC<CompareProjectsProps> = ({ projects }) => {
  const [selectedProject1, setSelectedProject1] = useState<RoadmapProject | null>(null);
  const [selectedProject2, setSelectedProject2] = useState<RoadmapProject | null>(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const availableProjects1 = projects.filter(p => p.id !== selectedProject2?.id);
  const availableProjects2 = projects.filter(p => p.id !== selectedProject1?.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const ComparisonRow = ({
    label,
    value1,
    value2,
    highlight = false
  }: {
    label: string;
    value1: React.ReactNode;
    value2: React.ReactNode;
    highlight?: boolean;
  }) => (
    <div className={`grid grid-cols-3 gap-4 py-3 border-b border-gray-200 ${highlight ? 'bg-gray-50' : ''}`}>
      <div className="font-medium text-gray-700">{label}</div>
      <div className="text-gray-900">{value1 || '-'}</div>
      <div className="text-gray-900">{value2 || '-'}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#101010]">Compare Projects</h3>
        <p className="text-xs text-gray-600">Select two projects to compare their details side by side</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-2">Project 1</label>
          <button
            onClick={() => setShowDropdown1(!showDropdown1)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors"
          >
            <span className={selectedProject1 ? 'text-gray-900' : 'text-gray-500'}>
              {selectedProject1?.header || 'Select a project...'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showDropdown1 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {availableProjects1.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-500">No projects available</div>
              ) : (
                availableProjects1.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject1(project);
                      setShowDropdown1(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{project.header}</div>
                    <div className="text-xs text-gray-500 mt-1">{project.department}</div>
                  </button>
                ))
              )}
            </div>
          )}

          {selectedProject1 && (
            <button
              onClick={() => setSelectedProject1(null)}
              className="absolute right-12 top-[42px] p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-2">Project 2</label>
          <button
            onClick={() => setShowDropdown2(!showDropdown2)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors"
          >
            <span className={selectedProject2 ? 'text-gray-900' : 'text-gray-500'}>
              {selectedProject2?.header || 'Select a project...'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showDropdown2 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {availableProjects2.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-500">No projects available</div>
              ) : (
                availableProjects2.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject2(project);
                      setShowDropdown2(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{project.header}</div>
                    <div className="text-xs text-gray-500 mt-1">{project.department}</div>
                  </button>
                ))
              )}
            </div>
          )}

          {selectedProject2 && (
            <button
              onClick={() => setSelectedProject2(null)}
              className="absolute right-12 top-[42px] p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {!selectedProject1 && !selectedProject2 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Select two projects to compare</p>
        </div>
      ) : selectedProject1 && !selectedProject2 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Select a second project to compare</p>
        </div>
      ) : !selectedProject1 && selectedProject2 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Select a first project to compare</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-semibold text-gray-700">Property</div>
              <div className="font-semibold text-gray-900">{selectedProject1?.header}</div>
              <div className="font-semibold text-gray-900">{selectedProject2?.header}</div>
            </div>
          </div>

          <div className="px-6 divide-y divide-gray-200">
            <ComparisonRow
              label="Status"
              value1={
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedProject1?.status || '')}`}>
                  {selectedProject1?.status}
                </span>
              }
              value2={
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedProject2?.status || '')}`}>
                  {selectedProject2?.status}
                </span>
              }
            />

            <ComparisonRow
              label="Department"
              value1={selectedProject1?.department}
              value2={selectedProject2?.department}
            />

            <ComparisonRow
              label="Scenario"
              value1={selectedProject1?.scenario}
              value2={selectedProject2?.scenario}
            />

            <ComparisonRow
              label="Completion Date"
              value1={formatDate(selectedProject1?.completion_date || null)}
              value2={formatDate(selectedProject2?.completion_date || null)}
            />

            <ComparisonRow
              label="Budget Total"
              value1={formatCurrency(selectedProject1?.budget_total || 0)}
              value2={formatCurrency(selectedProject2?.budget_total || 0)}
              highlight
            />

            <ComparisonRow
              label="Actual Total"
              value1={formatCurrency(selectedProject1?.actual_total || 0)}
              value2={formatCurrency(selectedProject2?.actual_total || 0)}
              highlight
            />

            <ComparisonRow
              label="Budget Variance"
              value1={
                <span className={
                  (selectedProject1?.actual_total || 0) > (selectedProject1?.budget_total || 0)
                    ? 'text-red-600 font-medium'
                    : 'text-green-600 font-medium'
                }>
                  {formatCurrency((selectedProject1?.budget_total || 0) - (selectedProject1?.actual_total || 0))}
                </span>
              }
              value2={
                <span className={
                  (selectedProject2?.actual_total || 0) > (selectedProject2?.budget_total || 0)
                    ? 'text-red-600 font-medium'
                    : 'text-green-600 font-medium'
                }>
                  {formatCurrency((selectedProject2?.budget_total || 0) - (selectedProject2?.actual_total || 0))}
                </span>
              }
              highlight
            />

            <ComparisonRow
              label="GL Accounts"
              value1={
                <div className="flex flex-wrap gap-1">
                  {selectedProject1?.gl_accounts.map((account, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {account}
                    </span>
                  ))}
                </div>
              }
              value2={
                <div className="flex flex-wrap gap-1">
                  {selectedProject2?.gl_accounts.map((account, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {account}
                    </span>
                  ))}
                </div>
              }
            />

            <ComparisonRow
              label="Assigned Users"
              value1={selectedProject1?.assigned_users.length}
              value2={selectedProject2?.assigned_users.length}
            />

            <ComparisonRow
              label="Version"
              value1={`v${selectedProject1?.version}`}
              value2={`v${selectedProject2?.version}`}
            />

            <ComparisonRow
              label="Created"
              value1={formatDate(selectedProject1?.created_at || null)}
              value2={formatDate(selectedProject2?.created_at || null)}
            />

            <ComparisonRow
              label="Last Updated"
              value1={formatDate(selectedProject1?.updated_at || null)}
              value2={formatDate(selectedProject2?.updated_at || null)}
            />

            <div className="py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-gray-700">Description</div>
                <div className="text-xs text-gray-700">{selectedProject1?.description}</div>
                <div className="text-xs text-gray-700">{selectedProject2?.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareProjects;
