import React, { useState } from 'react';
import { Calendar, DollarSign, Users, Filter, Search, MoreVertical, CheckCircle, Clock, XCircle, AlertCircle, Trash2, CreditCard as Edit } from 'lucide-react';
import type { RoadmapProject, ProjectStatus } from '../../types/roadmap';
import { roadmapService } from '../../services/roadmapService';

interface ProjectsListProps {
  projects: RoadmapProject[];
  onEdit: (project: RoadmapProject) => void;
  onRefresh: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onEdit, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-[#4ADE80]" />;
      case 'Pending Approval':
        return <Clock className="w-4 h-4 text-[#FBBF24]" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-[#F87171]" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-[#3B82F6]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending Approval':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const departments = ['All', ...Array.from(new Set(projects.map(p => p.department).filter(Boolean)))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || project.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await roadmapService.deleteProject(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'All')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEdit(project)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-[#101010]">{project.header}</h3>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </div>
                      {project.scenario !== 'Base Case' && (
                        <span className="text-xs font-medium text-[#7B68EE] px-2 py-1 bg-[#7B68EE]/10 rounded">{project.scenario}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {project.department && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Dept:</span>
                        <span>{project.department}</span>
                      </div>
                    )}
                    {project.completion_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.completion_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${project.budget_total.toLocaleString()}</span>
                    </div>
                    {project.assigned_users.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{project.assigned_users.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === project.id ? null : project.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {menuOpen === project.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(project);
                          setMenuOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                          setMenuOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
