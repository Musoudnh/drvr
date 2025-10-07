import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Check, User } from 'lucide-react';
import { commentService } from '../../services/commentService';
import type { ForecastComment } from '../../types/comment';

interface CommentThreadProps {
  cellReference: string;
  onClose: () => void;
  userId: string;
  position?: { top: number; left: number };
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  cellReference,
  onClose,
  userId,
  position,
}) => {
  const [comments, setComments] = useState<ForecastComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [cellReference]);

  const loadComments = async () => {
    try {
      const data = await commentService.getCommentsByCell(cellReference);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.trim()) {
      console.log('Comment is empty, not submitting');
      return;
    }

    console.log('Submitting comment:', {
      cellReference,
      content: newComment,
      userId,
      parentId,
    });

    setLoading(true);
    try {
      const mentions = extractMentions(newComment);
      const result = await commentService.createComment({
        cell_reference: cellReference,
        content: newComment,
        author_id: userId,
        parent_id: parentId,
        mentions,
      });

      console.log('Comment created successfully:', result);
      setNewComment('');
      setReplyingTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error creating comment:', error);
      alert(`Failed to create comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map((m) => m.substring(1)) : [];
  };

  const handleResolve = async (commentId: string, currentStatus: boolean) => {
    try {
      await commentService.updateComment(commentId, { is_resolved: !currentStatus });
      await loadComments();
    } catch (error) {
      console.error('Error resolving comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderComment = (comment: ForecastComment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} border-l-2 ${
        comment.is_resolved ? 'border-green-500' : 'border-blue-500'
      } pl-3`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-sm">
              {comment.author_email || comment.author_name || 'User'}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isReply && (
            <button
              onClick={() => handleResolve(comment.id, comment.is_resolved)}
              className="p-1 hover:bg-gray-100 rounded"
              title={comment.is_resolved ? 'Unresolve' : 'Mark as resolved'}
            >
              <Check
                className={`w-4 h-4 ${
                  comment.is_resolved ? 'text-green-600' : 'text-gray-400'
                }`}
              />
            </button>
          )}
          {comment.author_id === userId && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="p-1 hover:bg-red-100 rounded"
              title="Delete comment"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</div>

      {!isReply && (
        <button
          onClick={() => setReplyingTo(comment.id)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700"
        >
          Reply
        </button>
      )}

      {replyingTo === comment.id && (
        <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a reply... (use @username to mention)"
            className="w-full p-2 border rounded text-sm"
            rows={2}
            autoFocus
          />
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              Reply
            </button>
            <button
              type="button"
              onClick={() => {
                setReplyingTo(null);
                setNewComment('');
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[600px] flex flex-col z-50"
      style={
        position
          ? {
              top: `${position.top}px`,
              left: `${position.left}px`,
            }
          : {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }
      }
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Comments: {cellReference}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="Close comments"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div>{comments.map((comment) => renderComment(comment))}</div>
        )}
      </div>

      {!replyingTo && (
        <form onSubmit={(e) => handleSubmit(e)} className="p-4 border-t">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment... (use @username to mention)"
            className="w-full p-2 border rounded text-sm resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Comment
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
