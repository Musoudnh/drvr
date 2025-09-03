import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Thread, Message } from '../../types/chat';
import Button from '../UI/Button';

interface AISummaryPanelProps {
  thread: Thread | null;
  messages: Message[];
  isVisible: boolean;
}

interface AISummary {
  keyPoints: string[];
  decisions: string[];
  actionItems: {
    task: string;
    assignee?: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  participants: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
}

const AISummaryPanel: React.FC<AISummaryPanelProps> = ({
  thread,
  messages,
  isVisible
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<AISummary | null>(null);

  const generateSummary = async () => {
    if (!thread || messages.length === 0) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockSummary: AISummary = {
        keyPoints: [
          'Q4 results exceeded expectations with 15% revenue growth',
          'Profit margins improved significantly compared to Q3',
          'Team performance metrics are above industry benchmarks',
          'Cash flow projections remain positive for Q1 2025'
        ],
        decisions: [
          'Approved Q1 marketing budget increase of 20%',
          'Decided to hire 2 additional finance team members',
          'Agreed to implement new forecasting software by March'
        ],
        actionItems: [
          {
            task: 'Prepare Q1 forecast presentation',
            assignee: 'Emily Rodriguez',
            dueDate: 'Jan 20, 2025',
            priority: 'high'
          },
          {
            task: 'Schedule team meeting for Q1 strategy',
            assignee: 'Sarah Johnson',
            dueDate: 'Jan 18, 2025',
            priority: 'medium'
          },
          {
            task: 'Review and approve new hire job descriptions',
            assignee: 'Michael Chen',
            dueDate: 'Jan 25, 2025',
            priority: 'medium'
          }
        ],
        participants: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'],
        sentiment: 'positive',
        topics: ['Q4 Results', 'Q1 Planning', 'Team Expansion', 'Budget Allocation']
      };

      setSummary(mockSummary);
      setIsGenerating(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[#F87171] bg-[#F87171]/10';
      case 'medium': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'low': return 'text-[#4ADE80] bg-[#4ADE80]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  if (!isVisible || !thread) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#1E2A38] flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-[#F59E0B]" />
            AI Summary
          </h3>
          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className="p-1 hover:bg-gray-100 rounded text-[#3AB7BF] disabled:opacity-50"
            title="Generate summary"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          AI-powered thread analysis and insights
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isGenerating ? (
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-[#F59E0B] mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-gray-600">Analyzing conversation...</p>
          </div>
        ) : summary ? (
          <div className="space-y-6">
            {/* Key Points */}
            <div>
              <h4 className="font-semibold text-[#1E2A38] mb-3 text-sm">Key Points</h4>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="w-1.5 h-1.5 bg-[#3AB7BF] rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decisions */}
            {summary.decisions.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-3 text-sm">Decisions Made</h4>
                <ul className="space-y-2">
                  {summary.decisions.map((decision, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="w-3 h-3 text-[#4ADE80] mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {summary.actionItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-3 text-sm">Action Items</h4>
                <div className="space-y-3">
                  {summary.actionItems.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-[#1E2A38] flex-1">{item.task}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getPriorityColor(item.priority)}`}>
                          {getPriorityIcon(item.priority)}
                          <span className="ml-1">{item.priority}</span>
                        </span>
                      </div>
                      {item.assignee && (
                        <p className="text-xs text-gray-600 mb-1">
                          Assigned to: {item.assignee}
                        </p>
                      )}
                      {item.dueDate && (
                        <p className="text-xs text-gray-600">
                          Due: {item.dueDate}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics */}
            <div>
              <h4 className="font-semibold text-[#1E2A38] mb-3 text-sm">Topics Discussed</h4>
              <div className="flex flex-wrap gap-2">
                {summary.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#3AB7BF]/10 text-[#3AB7BF] rounded-full text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3 h-3 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3 h-3 mr-1" />
                  Notes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">No summary generated yet</p>
            <Button variant="outline" size="sm" onClick={generateSummary}>
              Generate Summary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummaryPanel;