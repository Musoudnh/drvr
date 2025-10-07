import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Send, Clock, User, Calendar } from 'lucide-react';
import type { RoadmapProject, RoadmapApproval } from '../../types/roadmap';
import { roadmapService } from '../../services/roadmapService';

interface AuditTrailProps {
  projects: RoadmapProject[];
}

interface AuditEntry extends RoadmapApproval {
  project_header: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ projects }) => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected' | 'submitted'>('all');

  useEffect(() => {
    loadAuditData();
  }, [projects]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      const allApprovals: AuditEntry[] = [];

      for (const project of projects) {
        const approvals = await roadmapService.getApprovals(project.id);
        approvals.forEach(approval => {
          allApprovals.push({
            ...approval,
            project_header: project.header
          });
        });
      }

      allApprovals.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAuditEntries(allApprovals);
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-[#4ADE80]" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-[#F87171]" />;
      case 'submitted':
        return <Send className="w-5 h-5 text-[#3AB7BF]" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredEntries = auditEntries.filter(entry => {
    if (filter === 'all') return true;
    return entry.action === filter;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-[#3AB7BF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Loading audit trail...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#101010]">Audit Trail</h3>
          <p className="text-xs text-gray-600">Track all project approvals and rejections</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#3AB7BF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'submitted'
                ? 'bg-[#3AB7BF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-[#3AB7BF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-[#3AB7BF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No audit entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(entry.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[#101010] mb-1">
                        {entry.project_header}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        <span>User ID: {entry.user_id.slice(0, 8)}...</span>
                        <Calendar className="w-3 h-3 ml-2" />
                        <span>{new Date(entry.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getActionColor(entry.action)}`}>
                      {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                    </span>
                  </div>

                  {entry.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-700">{entry.notes}</p>
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

export default AuditTrail;
