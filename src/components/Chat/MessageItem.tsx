import React, { useState } from 'react';
import { MoreHorizontal, Reply, Smile, Download, FileText, Image } from 'lucide-react';
import { Message, ChatUser } from '../../types/chat';

interface MessageItemProps {
  message: Message;
  currentUser: ChatUser;
  showAvatar: boolean;
  showTimestamp: boolean;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  showAvatar,
  showTimestamp,
  onAddReaction
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const commonEmojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = (attachment: any) => {
    const isImage = attachment.type.startsWith('image/');
    
    return (
      <div key={attachment.id} className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-sm">
        <div className="flex items-center">
          {isImage ? (
            <Image className="w-4 h-4 text-gray-400 mr-2" />
          ) : (
            <FileText className="w-4 h-4 text-gray-400 mr-2" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#101010] truncate">{attachment.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
          </div>
          <button className="ml-2 p-1 hover:bg-gray-200 rounded">
            <Download className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>
    );
  };

  const renderMentions = (text: string, mentions: string[]) => {
    if (mentions.length === 0) return text;
    
    let result = text;
    mentions.forEach(userId => {
      // Simple mention highlighting - in a real app, you'd map userId to username
      result = result.replace(new RegExp(`@${userId}`, 'g'), `<span class="bg-[#3AB7BF]/20 text-[#3AB7BF] px-1 rounded">@${userId}</span>`);
    });
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const groupedReactions = message.reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as { [emoji: string]: typeof message.reactions });

  return (
    <div 
      className={`group relative ${showAvatar ? 'mt-4' : 'mt-1'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start">
        {/* Avatar */}
        <div className="mr-3">
          {showAvatar ? (
            <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {message.authorName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          ) : (
            <div className="w-8 h-8" /> // Spacer
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Author and Timestamp */}
          {showAvatar && (
            <div className="flex items-center mb-1">
              <span className="font-semibold text-[#101010] text-xs mr-2">
                {message.authorName}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(message.createdAt)}
              </span>
            </div>
          )}

          {/* Message Body */}
          <div className="text-xs text-gray-800 leading-relaxed">
            {renderMentions(message.body, message.mentions)}
          </div>

          {/* Attachments */}
          {message.attachments.map(renderAttachment)}

          {/* Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(groupedReactions).map(([emoji, reactions]) => (
                <button
                  key={emoji}
                  onClick={() => onAddReaction(message.id, emoji)}
                  className={`flex items-center px-2 py-1 rounded-full text-xs border transition-colors ${
                    reactions.some(r => r.userId === currentUser.id)
                      ? 'bg-[#3AB7BF]/20 border-[#3AB7BF]/30 text-[#3AB7BF]'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{emoji}</span>
                  <span>{reactions.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Actions */}
        {showActions && (
          <div className="absolute top-0 right-0 flex items-center bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-2 hover:bg-gray-100 rounded-l-lg"
              title="Add reaction"
            >
              <Smile className="w-4 h-4 text-gray-500" />
            </button>
            <button
              className="p-2 hover:bg-gray-100"
              title="Reply"
            >
              <Reply className="w-4 h-4 text-gray-500" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-r-lg"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Reaction Picker */}
      {showReactions && (
        <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
          <div className="flex gap-1">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onAddReaction(message.id, emoji);
                  setShowReactions(false);
                }}
                className="p-2 hover:bg-gray-100 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;