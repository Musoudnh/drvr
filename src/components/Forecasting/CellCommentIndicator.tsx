import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { commentService } from '../../services/commentService';

interface CellCommentIndicatorProps {
  cellReference: string;
  className?: string;
}

export const CellCommentIndicator: React.FC<CellCommentIndicatorProps> = ({
  cellReference,
  className = '',
}) => {
  const [commentCount, setCommentCount] = useState(0);
  const [hasUnresolved, setHasUnresolved] = useState(false);

  useEffect(() => {
    loadCommentCount();
  }, [cellReference]);

  const loadCommentCount = async () => {
    try {
      const comments = await commentService.getCommentsByCell(cellReference);
      setCommentCount(comments.length);
      setHasUnresolved(comments.some((c) => !c.is_resolved));
    } catch (error) {
      console.error('Error loading comment count:', error);
    }
  };

  if (commentCount === 0) return null;

  return (
    <div
      className={`absolute top-0 right-0 flex items-center gap-1 ${className}`}
      title={`${commentCount} comment${commentCount > 1 ? 's' : ''}${hasUnresolved ? ' (unresolved)' : ''}`}
    >
      <MessageSquare
        className={`w-3 h-3 ${hasUnresolved ? 'text-orange-500' : 'text-blue-500'}`}
      />
      {commentCount > 1 && (
        <span className="text-xs font-medium text-gray-600">{commentCount}</span>
      )}
    </div>
  );
};
