export interface Channel {
  id: string;
  name: string;
  type: 'team' | 'project' | 'client' | 'private';
  description?: string;
  createdAt: Date;
  createdBy: string;
  memberCount: number;
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
    author: string;
  };
}

export interface Thread {
  id: string;
  channelId: string;
  title: string;
  createdAt: Date;
  createdBy: string;
  messageCount: number;
  lastActivity: Date;
  participants: string[];
  isAISummarized?: boolean;
}

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  mentions: string[];
  attachments: MessageAttachment[];
  reactions: Reaction[];
  createdAt: Date;
  editedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Reaction {
  id: string;
  messageId: string;
  userId: string;
  userName: string;
  emoji: string;
  createdAt: Date;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}