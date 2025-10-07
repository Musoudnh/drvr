import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, Plus, X, ArrowRight, ChevronDown } from 'lucide-react';
import type { RoadmapIdea } from '../../types/roadmap';
import { roadmapService } from '../../services/roadmapService';
import { useAuth } from '../../context/AuthContext';

interface IdeasBoardProps {
  ideas: RoadmapIdea[];
  onRefresh: () => void;
}

const IdeasBoard: React.FC<IdeasBoardProps> = ({ ideas, onRefresh }) => {
  const { user } = useAuth();
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    department: ''
  });
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await roadmapService.createIdea({
        ...newIdea,
        user_id: user.id,
        status: 'pitched',
        converted_to_project_id: null
      });
      setNewIdea({ title: '', description: '', department: '' });
      setShowNewIdeaModal(false);
      onRefresh();
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  const handleUpvote = async (ideaId: string) => {
    if (!user) return;

    try {
      await roadmapService.upvoteIdea(ideaId, user.id);
      onRefresh();
    } catch (error) {
      console.error('Error upvoting idea:', error);
    }
  };

  const handleConvertToProject = async (ideaId: string) => {
    if (!user) return;

    try {
      await roadmapService.convertIdeaToProject(ideaId, user.id);
      setShowStatusMenu(null);
      onRefresh();
    } catch (error) {
      console.error('Error converting idea:', error);
    }
  };

  const handleRejectIdea = async (ideaId: string) => {
    try {
      await roadmapService.updateIdeaStatus(ideaId, 'rejected');
      setShowStatusMenu(null);
      onRefresh();
    } catch (error) {
      console.error('Error rejecting idea:', error);
    }
  };

  const handleRequestMoreInput = async () => {
    if (!selectedIdeaId || !adminFeedback.trim()) return;

    try {
      await roadmapService.updateIdeaStatus(selectedIdeaId, 'more_input_needed', adminFeedback);
      setShowFeedbackModal(false);
      setShowStatusMenu(null);
      setSelectedIdeaId(null);
      setAdminFeedback('');
      onRefresh();
    } catch (error) {
      console.error('Error requesting more input:', error);
    }
  };

  const activeIdeas = ideas.filter(i => i.status === 'pitched' || i.status === 'more_input_needed');
  const convertedIdeas = ideas.filter(i => i.status === 'converted');
  const rejectedIdeas = ideas.filter(i => i.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#101010]">Idea Board</h3>
          <p className="text-xs text-gray-600">Pitch and vote on new project ideas</p>
        </div>
        <button
          onClick={() => setShowNewIdeaModal(true)}
          className="px-4 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6B58DE] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Idea
        </button>
      </div>

      {activeIdeas.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No ideas yet. Be the first to pitch one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeIdeas.map((idea) => {
            const hasUpvoted = user && idea.upvoted_by.includes(user.id);

            return (
              <div
                key={idea.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-[#FBBF24]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#101010] mb-1">{idea.title}</h4>
                    {idea.department && (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {idea.department}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 line-clamp-3">{idea.description}</p>

                {idea.status === 'more_input_needed' && idea.admin_feedback && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">Admin Feedback:</p>
                    <p className="text-xs text-yellow-700">{idea.admin_feedback}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleUpvote(idea.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      hasUpvoted
                        ? 'bg-[#7B68EE] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{idea.upvotes}</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(showStatusMenu === idea.id ? null : idea.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                    >
                      Status
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {showStatusMenu === idea.id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleConvertToProject(idea.id)}
                          className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                        >
                          <ArrowRight className="w-4 h-4 text-green-600" />
                          <span>Convert to Project</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedIdeaId(idea.id);
                            setShowFeedbackModal(true);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                        >
                          <span className="text-yellow-600">⚠</span>
                          <span>Request More Input</span>
                        </button>
                        <button
                          onClick={() => handleRejectIdea(idea.id)}
                          className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {convertedIdeas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#101010] mb-4">Converted to Projects</h3>
          <div className="space-y-2">
            {convertedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#101010]">{idea.title}</p>
                  <p className="text-xs text-gray-600">Successfully converted to project</p>
                </div>
                <div className="text-green-600 font-medium text-xs">✓ Converted</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rejectedIdeas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#101010] mb-4">Rejected Ideas</h3>
          <div className="space-y-2">
            {rejectedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#101010]">{idea.title}</p>
                  <p className="text-xs text-gray-600">Rejected by admin</p>
                </div>
                <div className="text-red-600 font-medium text-xs">✗ Rejected</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNewIdeaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#101010]">New Idea</h2>
              <button
                onClick={() => setShowNewIdeaModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={newIdea.department}
                  onChange={(e) => setNewIdea({ ...newIdea, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="R&D">R&D</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewIdeaModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors"
                >
                  Submit Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#101010]">Request More Input</h2>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedIdeaId(null);
                  setAdminFeedback('');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Admin Feedback *
              </label>
              <textarea
                value={adminFeedback}
                onChange={(e) => setAdminFeedback(e.target.value)}
                rows={4}
                placeholder="Explain what additional information is needed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedIdeaId(null);
                    setAdminFeedback('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestMoreInput}
                  disabled={!adminFeedback.trim()}
                  className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeasBoard;
