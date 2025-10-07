import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check, XCircle } from 'lucide-react';
import { commentService } from '../../services/commentService';
import type { ChangeRequest, UserRole } from '../../types/comment';

interface ChangeRequestModalProps {
  cellReference: string;
  currentValue?: number;
  onClose: () => void;
  onApprove?: (newValue: number) => void;
  userId: string;
  mode?: 'create' | 'review';
  requestId?: string;
}

export const ChangeRequestModal: React.FC<ChangeRequestModalProps> = ({
  cellReference,
  currentValue,
  onClose,
  onApprove,
  userId,
  mode = 'create',
  requestId,
}) => {
  const [proposedValue, setProposedValue] = useState('');
  const [justification, setJustification] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [request, setRequest] = useState<ChangeRequest | null>(null);

  useEffect(() => {
    loadUserRole();
    if (mode === 'review' && requestId) {
      loadRequest();
    }
  }, [requestId, mode]);

  const loadUserRole = async () => {
    try {
      const role = await commentService.getUserRole(userId);
      setUserRole(role);
    } catch (error) {
      console.error('Error loading user role:', error);
    }
  };

  const loadRequest = async () => {
    if (!requestId) return;

    try {
      const requests = await commentService.getChangeRequests();
      const found = requests.find((r) => r.id === requestId);
      if (found) {
        setRequest(found);
        setProposedValue(found.proposed_value.toString());
        setJustification(found.justification);
      }
    } catch (error) {
      console.error('Error loading request:', error);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedValue || !justification.trim()) return;

    setLoading(true);
    try {
      await commentService.createChangeRequest({
        cell_reference: cellReference,
        current_value: currentValue,
        proposed_value: parseFloat(proposedValue),
        justification,
        requester_id: userId,
      });

      alert('Change request submitted for approval');
      onClose();
    } catch (error) {
      console.error('Error submitting change request:', error);
      alert('Failed to submit change request');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (approved: boolean) => {
    if (!requestId) return;

    setLoading(true);
    try {
      await commentService.reviewChangeRequest(requestId, {
        status: approved ? 'approved' : 'rejected',
        reviewer_id: userId,
        review_notes: reviewNotes,
      });

      if (approved && onApprove && request) {
        onApprove(request.proposed_value);
      }

      alert(`Change request ${approved ? 'approved' : 'rejected'}`);
      onClose();
    } catch (error) {
      console.error('Error reviewing change request:', error);
      alert('Failed to review change request');
    } finally {
      setLoading(false);
    }
  };

  const canApprove = userRole === 'approver' || userRole === 'admin';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Request Change' : 'Review Change Request'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Cell</div>
                <div className="font-medium">{cellReference}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Value</div>
                <div className="font-medium">
                  {currentValue !== undefined
                    ? currentValue.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {mode === 'create' ? (
            <form onSubmit={handleSubmitRequest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Value
                  </label>
                  <input
                    type="number"
                    value={proposedValue}
                    onChange={(e) => setProposedValue(e.target.value)}
                    placeholder="Enter new value"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    step="any"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justification
                  </label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Explain why this change is necessary..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    required
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Provide detailed reasoning to help approvers make a decision
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    <strong>Note:</strong> This change request will be sent to approvers for
                    review. You will be notified once a decision is made.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !proposedValue || !justification.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {request && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Proposed Value
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {request.proposed_value.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Change:{' '}
                        {request.current_value !== undefined
                          ? (
                              ((request.proposed_value - request.current_value) /
                                request.current_value) *
                              100
                            ).toFixed(1)
                          : 'N/A'}
                        %
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Justification
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                        {request.justification}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Requested by
                      </div>
                      <div className="text-sm">
                        {request.requester_name || 'User'} on{' '}
                        {new Date(request.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {canApprove && request.status === 'pending' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Notes
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add notes about your decision..."
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleReview(false)}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleReview(true)}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-4 rounded-lg ${
                        request.status === 'approved'
                          ? 'bg-green-50 border border-green-200'
                          : request.status === 'rejected'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <div className="font-medium mb-2">
                        Status:{' '}
                        <span className="uppercase">{request.status}</span>
                      </div>
                      {request.review_notes && (
                        <div className="text-sm">
                          <strong>Review Notes:</strong> {request.review_notes}
                        </div>
                      )}
                      {request.reviewed_at && (
                        <div className="text-sm text-gray-600 mt-1">
                          Reviewed on {new Date(request.reviewed_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
