import { useState, useEffect, useCallback } from 'react';
import { Channel, Thread, Message, ChatUser, Reaction } from '../types/chat';

// Mock data for demonstration
const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'General',
    type: 'team',
    description: 'Company-wide announcements and discussions',
    createdAt: new Date('2025-01-01'),
    createdBy: 'user1',
    memberCount: 12,
    unreadCount: 3,
    lastMessage: {
      content: 'Great work on the Q4 results everyone!',
      timestamp: new Date(),
      author: 'Sarah Johnson'
    }
  },
  {
    id: '2',
    name: 'Finance Team',
    type: 'team',
    description: 'Finance department discussions',
    createdAt: new Date('2025-01-01'),
    createdBy: 'user2',
    memberCount: 5,
    unreadCount: 1,
    lastMessage: {
      content: 'Monthly close is complete',
      timestamp: new Date(Date.now() - 3600000),
      author: 'Michael Chen'
    }
  },
  {
    id: '3',
    name: 'Q1 Planning',
    type: 'project',
    description: 'Q1 2025 strategic planning',
    createdAt: new Date('2025-01-10'),
    createdBy: 'user1',
    memberCount: 8,
    unreadCount: 0,
    lastMessage: {
      content: 'Budget allocations look good',
      timestamp: new Date(Date.now() - 7200000),
      author: 'David Kim'
    }
  },
  {
    id: '4',
    name: 'Client: Acme Corp',
    type: 'client',
    description: 'Acme Corp project discussions',
    createdAt: new Date('2025-01-05'),
    createdBy: 'user3',
    memberCount: 4,
    unreadCount: 2,
    lastMessage: {
      content: 'Meeting scheduled for tomorrow',
      timestamp: new Date(Date.now() - 1800000),
      author: 'Emily Rodriguez'
    }
  }
];

const mockThreads: { [channelId: string]: Thread[] } = {
  '1': [
    {
      id: 't1',
      channelId: '1',
      title: 'Q4 Results Discussion',
      createdAt: new Date(Date.now() - 86400000),
      createdBy: 'user1',
      messageCount: 12,
      lastActivity: new Date(),
      participants: ['user1', 'user2', 'user3'],
      isAISummarized: true
    },
    {
      id: 't2',
      channelId: '1',
      title: 'New Employee Onboarding',
      createdAt: new Date(Date.now() - 172800000),
      createdBy: 'user2',
      messageCount: 8,
      lastActivity: new Date(Date.now() - 3600000),
      participants: ['user2', 'user4']
    }
  ],
  '2': [
    {
      id: 't3',
      channelId: '2',
      title: 'Monthly Close Process',
      createdAt: new Date(Date.now() - 259200000),
      createdBy: 'user2',
      messageCount: 15,
      lastActivity: new Date(Date.now() - 3600000),
      participants: ['user2', 'user3', 'user5'],
      isAISummarized: true
    }
  ]
};

const mockMessages: { [threadId: string]: Message[] } = {
  't1': [
    {
      id: 'm1',
      threadId: 't1',
      authorId: 'user1',
      authorName: 'Sarah Johnson',
      body: 'Great work everyone! Our Q4 results exceeded expectations with 15% revenue growth.',
      mentions: [],
      attachments: [],
      reactions: [
        { id: 'r1', messageId: 'm1', userId: 'user2', userName: 'Michael Chen', emoji: '👏', createdAt: new Date() },
        { id: 'r2', messageId: 'm1', userId: 'user3', userName: 'Emily Rodriguez', emoji: '🎉', createdAt: new Date() }
      ],
      createdAt: new Date(Date.now() - 1800000)
    },
    {
      id: 'm2',
      threadId: 't1',
      authorId: 'user2',
      authorName: 'Michael Chen',
      body: 'The profit margins improved significantly. @Sarah Johnson should we schedule a team meeting to discuss Q1 strategy?',
      mentions: ['user1'],
      attachments: [],
      reactions: [],
      createdAt: new Date(Date.now() - 900000)
    },
    {
      id: 'm3',
      threadId: 't1',
      authorId: 'user3',
      authorName: 'Emily Rodriguez',
      body: 'I can prepare the Q1 forecast presentation. When works best for everyone?',
      mentions: [],
      attachments: [
        {
          id: 'a1',
          name: 'Q1_Forecast_Draft.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 245760,
          url: '#'
        }
      ],
      reactions: [
        { id: 'r3', messageId: 'm3', userId: 'user1', userName: 'Sarah Johnson', emoji: '👍', createdAt: new Date() }
      ],
      createdAt: new Date(Date.now() - 300000)
    }
  ]
};

const mockUsers: ChatUser[] = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Finance Manager',
    status: 'online'
  },
  {
    id: 'user2',
    name: 'Michael Chen',
    email: 'michael.c@company.com',
    role: 'Senior Accountant',
    status: 'online'
  },
  {
    id: 'user3',
    name: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    role: 'Financial Analyst',
    status: 'away'
  },
  {
    id: 'user4',
    name: 'David Kim',
    email: 'david.k@company.com',
    role: 'Controller',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000)
  }
];

export const useChat = () => {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [threads, setThreads] = useState<{ [channelId: string]: Thread[] }>(mockThreads);
  const [messages, setMessages] = useState<{ [threadId: string]: Message[] }>(mockMessages);
  const [users, setUsers] = useState<ChatUser[]>(mockUsers);
  const [currentUser] = useState<ChatUser>(mockUsers[0]); // Current logged-in user

  // Send a new message
  const sendMessage = useCallback((threadId: string, content: string, mentions: string[] = [], attachments: MessageAttachment[] = []) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      threadId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      body: content,
      mentions,
      attachments,
      reactions: [],
      createdAt: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMessage]
    }));

    // Update thread last activity
    setThreads(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(channelId => {
        updated[channelId] = updated[channelId].map(thread =>
          thread.id === threadId
            ? { ...thread, lastActivity: new Date(), messageCount: thread.messageCount + 1 }
            : thread
        );
      });
      return updated;
    });

    // Update channel last message
    const thread = Object.values(threads).flat().find(t => t.id === threadId);
    if (thread) {
      setChannels(prev => prev.map(channel =>
        channel.id === thread.channelId
          ? {
              ...channel,
              lastMessage: {
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                timestamp: new Date(),
                author: currentUser.name
              }
            }
          : channel
      ));
    }
  }, [currentUser, threads]);

  // Add reaction to message
  const addReaction = useCallback((messageId: string, emoji: string) => {
    const newReaction: Reaction = {
      id: `r${Date.now()}`,
      messageId,
      userId: currentUser.id,
      userName: currentUser.name,
      emoji,
      createdAt: new Date()
    };

    setMessages(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(threadId => {
        updated[threadId] = updated[threadId].map(message =>
          message.id === messageId
            ? {
                ...message,
                reactions: message.reactions.some(r => r.userId === currentUser.id && r.emoji === emoji)
                  ? message.reactions.filter(r => !(r.userId === currentUser.id && r.emoji === emoji))
                  : [...message.reactions, newReaction]
              }
            : message
        );
      });
      return updated;
    });
  }, [currentUser]);

  // Create new thread
  const createThread = useCallback((channelId: string, title: string) => {
    const newThread: Thread = {
      id: `t${Date.now()}`,
      channelId,
      title,
      createdAt: new Date(),
      createdBy: currentUser.id,
      messageCount: 0,
      lastActivity: new Date(),
      participants: [currentUser.id]
    };

    setThreads(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newThread]
    }));

    return newThread.id;
  }, [currentUser]);

  // Create new channel
  const createChannel = useCallback((name: string, type: Channel['type'], description?: string) => {
    const newChannel: Channel = {
      id: `c${Date.now()}`,
      name,
      type,
      description,
      createdAt: new Date(),
      createdBy: currentUser.id,
      memberCount: 1,
      unreadCount: 0
    };

    setChannels(prev => [...prev, newChannel]);
    return newChannel.id;
  }, [currentUser]);

  // Delete channel
  const deleteChannel = useCallback((channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
    
    // Also remove all threads and messages for this channel
    setThreads(prev => {
      const updated = { ...prev };
      delete updated[channelId];
      return updated;
    });
    
    // Remove messages for all threads in this channel
    setMessages(prev => {
      const updated = { ...prev };
      const channelThreads = threads[channelId] || [];
      channelThreads.forEach(thread => {
        delete updated[thread.id];
      });
      return updated;
    });
  }, [threads]);
  // Mark channel as read
  const markChannelAsRead = useCallback((channelId: string) => {
    setChannels(prev => prev.map(channel =>
      channel.id === channelId ? { ...channel, unreadCount: 0 } : channel
    ));
  }, []);

  // Search functionality
  const searchMessages = useCallback((query: string) => {
    const results: { message: Message; thread: Thread; channel: Channel }[] = [];
    
    Object.values(messages).flat().forEach(message => {
      if (message.body.toLowerCase().includes(query.toLowerCase()) || 
          message.authorName.toLowerCase().includes(query.toLowerCase())) {
        const thread = Object.values(threads).flat().find(t => t.id === message.threadId);
        const channel = channels.find(c => c.id === thread?.channelId);
        if (thread && channel) {
          results.push({ message, thread, channel });
        }
      }
    });
    
    return results;
  }, [messages, threads, channels]);

  return {
    channels,
    threads,
    messages,
    users,
    currentUser,
    sendMessage,
    addReaction,
    createThread,
    createChannel,
    deleteChannel,
    markChannelAsRead,
    searchMessages
  };
};