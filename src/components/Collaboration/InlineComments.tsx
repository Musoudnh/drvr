import React, { useState } from 'react';
import { MessageSquare, Plus, X, Send, AtSign, Clock, User } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  mentions: string[];
  replies: Comment[];
}

interface InlineCommentsProps {
  entityId: string;
  entityType: 'line_item' | 'driver' | 'scenario' | 'forecast';
  comments: Comment[];
  onAddComment: (content: string, mentions: string[]) => void;
  onReply: (commentId: string, content: string, mentions: string[]) => void;
  className?: string;
}

const InlineComments: React.FC<InlineCommentsProps> = ({
  entityId,
  entityType,
  comments,
  onAddComment,
  onReply,
  className = ''
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const teamMembers = [
    { id: 'user1', name: 'Sarah Johnson', role: 'Finance Manager' },
    { id: 'user2', name: 'Michael Chen', role: 'Senior Accountant' },
    { id: 'user3', name: 'Emily Rodriguez', role: 'Financial Analyst' },
    { id: 'user4', name: 'David Kim', role: 'Controller' }
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      const mentions = extractMentions(newComment);
      onAddComment(newComment, mentions);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      const mentions = extractMentions(replyContent);
      onReply(commentId, replyContent, mentions);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const renderMentions = (text: string, mentions: string[]) => {
    if (mentions.length === 0) return text;
    
    let result = text;
    mentions.forEach(userId => {
      const user = teamMembers.find(u => u.id === userId);
      if (user) {
        result = result.replace(
          new RegExp(`@${userId}`, 'g'), 
          `<span class="bg-[#3AB7BF]/20 text-[#3AB7BF] px-1 rounded">@${user.name}</span>`
        );
      }
    });
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Comment Trigger Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center p-1 hover:bg-gray-100 rounded transition-colors"
        title={`${comments.length} comment(s)`}
      >
        <MessageSquare className="w-4 h-4 text-gray-400" />
        {comments.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-[#3AB7BF] text-white text-xs rounded-full">
            {comments.length}
          </span>
        )}
      </button>

      {/* Comments Panel */}
      {showComments && (
        <div className="absolute top-8 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[#1E2A38]">Comments</h4>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {entityType.replace('_', ' ')} • {entityId}
            </p>
          </div>

          {/* Comments List */}
          <div className="max-h-64 overflow-y-auto p-4 space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No comments yet</p>
                <p className="text-xs">Start the conversation</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-[#1E2A38] text-sm">{comment.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {renderMentions(comment.content, comment.mentions)}
                    </div>
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs text-[#3AB7BF] hover:underline mt-2"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="ml-4 p-2 bg-white border border-gray-200 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#1E2A38] text-xs">{reply.author}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                      </div>
                      <div className="text-xs text-gray-700">
                        {renderMentions(reply.content, reply.mentions)}
                      </div>
                    </div>
                  ))}

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-4 flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleReply(comment.id)}
                        placeholder="Write a reply... Use @ to mention"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#3AB7BF] focus:border-transparent"
                      />
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="px-2 py-1 bg-[#3AB7BF] text-white rounded text-xs hover:bg-[#2A9BA3] transition-colors"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment... Use @ to mention"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-3 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use @username to mention team members
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineComments;