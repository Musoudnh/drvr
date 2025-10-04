import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Filter, Search } from 'lucide-react';
import Card from '../../components/UI/Card';
import ProjectsList from '../../components/RoadMap/ProjectsList';
import ForecastView from '../../components/RoadMap/ForecastView';
import IdeasBoard from '../../components/RoadMap/IdeasBoard';
import AuditTrail from '../../components/RoadMap/AuditTrail';
import ProjectModal from '../../components/RoadMap/ProjectModal';
import { roadmapService } from '../../services/roadmapService';
import type { RoadmapProject, RoadmapIdea, RoadmapApproval } from '../../types/roadmap';

type TabType = 'projects' | 'forecast' | 'ideas' | 'audit';

const RoadMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [projects, setProjects] = useState<RoadmapProject[]>([]);
  const [ideas, setIdeas] = useState<RoadmapIdea[]>([]);
  const [approvals, setApprovals] = useState<RoadmapApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<RoadmapProject | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, ideasData] = await Promise.all([
        roadmapService.getProjects(),
        roadmapService.getIdeas()
      ]);
      setProjects(projectsData);
      setIdeas(ideasData);
    } catch (error) {
      console.error('Error loading roadmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: RoadmapProject) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleCloseModal = () => {
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleSaveProject = async () => {
    await loadData();
    handleCloseModal();
  };

  const tabs = [
    { id: 'projects' as TabType, label: 'Projects', icon: MapPin },
    { id: 'forecast' as TabType, label: 'Forecast', icon: MapPin },
    { id: 'ideas' as TabType, label: 'Ideas', icon: MapPin },
    { id: 'audit' as TabType, label: 'Audit', icon: MapPin }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#101010]">Road Map</h1>
          <p className="text-gray-600 mt-1">Manage projects, budgets, and strategic initiatives</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <Card>
        <div className="border-b border-gray-200">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#7B68EE] border-b-2 border-[#7B68EE]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#7B68EE] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'projects' && (
                <ProjectsList
                  projects={projects}
                  onEdit={handleEditProject}
                  onRefresh={loadData}
                />
              )}
              {activeTab === 'forecast' && (
                <ForecastView projects={projects.filter(p => p.status === 'Approved')} />
              )}
              {activeTab === 'ideas' && (
                <IdeasBoard ideas={ideas} onRefresh={loadData} />
              )}
              {activeTab === 'audit' && (
                <AuditTrail projects={projects} />
              )}
            </>
          )}
        </div>
      </Card>

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onClose={handleCloseModal}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default RoadMap;
