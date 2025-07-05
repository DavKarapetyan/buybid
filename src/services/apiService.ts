import axios from 'axios';

const API_BASE_URL = 'https://seregamars-001-site9.ntempurl.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export const apiService = {
  // Get all conversations for current user
  getConversations: async (userId: string = 'current-user'): Promise<Conversation[]> => {
    const response = await apiClient.get(`/conversations?userId=${userId}`);
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: string, userId: string = 'current-user'): Promise<Message[]> => {
    const response = await apiClient.get(`/conversations/${conversationId}/messages?userId=${userId}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId: string, text: string, userId: string = 'current-user'): Promise<Message> => {
    const response = await apiClient.post(`/conversations/${conversationId}/messages?userId=${userId}`, {
      conversationId,
      text
    });
    return response.data;
  },

  createConversation: async (user1Id: string, user2Id: string) : Promise<Conversation> => {
    const response = await apiClient.post(`/conversations`, {
      user1Id,
      user2Id
    });
    return response.data;
  },

  // Get user info
  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  }
};