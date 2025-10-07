import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, Filter, X } from 'lucide-react';
import { CommentThread } from './CommentThread';
import { ChangeRequestModal } from './ChangeRequestModal';
import { ActivityFeed } from './ActivityFeed';
import { NotificationPanel } from './NotificationPanel';
import { commentService } from '../../services/commentService';
import type { CommentFilter, ChangeRequest } from '../../types/comment';

interface CommentsAndChangeRequestsProps {
  userId: string;
  forecastId?: string;
}

export const CommentsAndChangeRequests: React.FC<CommentsAndChangeRequestsProps> = ({
  userId,
  forecastId,
}) => {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [showCommentFilter, setShowCommentFilter] = useState(false);
  const [pendingChangeRequests, setPendingChangeRequests] = useState<ChangeRequest[]>([]);
  const [commentFilter, setCommentFilter] = useState<CommentFilter>({});

  useEffect(() => {
    loadPendingChangeRequests();
  }, []);

  const loadPendingChangeRequests = async () => {
    try {
      const requests = await commentService.getChangeRequests('pending');
      setPendingChangeRequests(requests);
    } catch (error) {
      console.error('Error loading change requests:', error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowActivityFeed(!showActivityFeed)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <AlertCircle className="w-4 h-4" />
          Activity Feed
          {pendingChangeRequests.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingChangeRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowCommentFilter(!showCommentFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Filter Comments
        </button>

        <div className="ml-auto">
          <NotificationPanel userId={userId} />
        </div>
      </div>

      {showCommentFilter && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Comment Filters</h3>
            <button
              onClick={() => setShowCommentFilter(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={commentFilter.category || ''}
                onChange={(e) =>
                  setCommentFilter({ ...commentFilter, category: e.target.value })
                }
                placeholder="e.g., Revenue, Marketing"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={commentFilter.date_from || ''}
                onChange={(e) =>
                  setCommentFilter({ ...commentFilter, date_from: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={commentFilter.date_to || ''}
                onChange={(e) =>
                  setCommentFilter({ ...commentFilter, date_to: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={commentFilter.is_resolved === false}
                onChange={(e) =>
                  setCommentFilter({
                    ...commentFilter,
                    is_resolved: e.target.checked ? false : undefined,
                  })
                }
                className="rounded"
              />
              Show only unresolved
            </label>
          </div>
        </div>
      )}

      {showActivityFeed && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 z-40">
          <ActivityFeed
            forecastId={forecastId}
            userId={userId}
            onClose={() => setShowActivityFeed(false)}
          />
        </div>
      )}

      {activeCell && (
        <CommentThread
          cellReference={activeCell}
          onClose={() => setActiveCell(null)}
          userId={userId}
        />
      )}
    </div>
  );
};

export const useCellComments = (userId: string) => {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [cellData, setCellData] = useState<{
    cellReference: string;
    currentValue?: number;
  } | null>(null);

  const openComments = (cellReference: string) => {
    console.log('Opening comments for cell:', cellReference);
    setActiveCell(cellReference);
  };

  const openChangeRequest = (cellReference: string, currentValue?: number) => {
    console.log('Opening change request for cell:', cellReference, 'value:', currentValue);
    setCellData({ cellReference, currentValue });
    setShowChangeRequest(true);
  };

  const closeAll = () => {
    setActiveCell(null);
    setShowChangeRequest(false);
    setCellData(null);
  };

  const renderCommentUI = () => {
    console.log('renderCommentUI called - activeCell:', activeCell, 'showChangeRequest:', showChangeRequest);
    return (
      <>
        {activeCell && (
          <CommentThread
            cellReference={activeCell}
            onClose={() => {
              console.log('Closing comment thread');
              setActiveCell(null);
            }}
            userId={userId}
          />
        )}
        {showChangeRequest && cellData && (
          <ChangeRequestModal
            cellReference={cellData.cellReference}
            currentValue={cellData.currentValue}
            onClose={() => {
              console.log('Closing change request modal');
              setShowChangeRequest(false);
              setCellData(null);
            }}
            userId={userId}
          />
        )}
      </>
    );
  };

  return {
    openComments,
    openChangeRequest,
    closeAll,
    renderCommentUI,
  };
};
