import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Shield,
} from "lucide-react";
import * as signalR from "@microsoft/signalr";
import { apiService, Conversation, Message } from "../../services/apiService";
import { useAuth } from "../Auth/AuthContext";

interface ChatInterfaceProps {
  onNavigate: (page: string) => void;
  user2Id?: string;
}

export default function ChatInterface({
  onNavigate,
  user2Id,
}: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const { user } = useAuth();
  const CURRENT_USER_ID = user?.id;

  const user1Id = CURRENT_USER_ID;

  // Ref for auto-scrolling
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load or create conversation
  const loadOrCreateConversation = useCallback(async () => {
    if (!CURRENT_USER_ID) {
      console.warn("Cannot load conversations: missing userId");
      setLoading(false);
      return;
    }

    try {
      const data = await apiService.getConversations(CURRENT_USER_ID);
      console.log(`Loaded ${data.length} conversations:`, data);
      setConversations(data);

      // If user1Id and user2Id are provided, try to find or create conversation
      if (user1Id && user2Id) {
        const targetConversation = data.find(
          (conv) =>
            (conv.user.id === user1Id && conv.participantId === user2Id) ||
            (conv.user.id === user2Id && conv.participantId === user1Id)
        );

        if (targetConversation) {
          console.log(`Found existing conversation: ${targetConversation.id}`);
          setSelectedChat(targetConversation.id);
        } else {
          try {
            console.log(
              `Creating new conversation between ${user1Id} and ${user2Id}`
            );
            const newConversation = await apiService.createConversation(
              user1Id,
              user2Id
            );
            console.log(`Created new conversation: ${newConversation.id}`);
            setConversations((prev) => [...prev, newConversation]);
            setSelectedChat(newConversation.id);
          } catch (error) {
            console.error("Failed to create conversation:", error);
          }
        }
      } else if (data.length > 0) {
        // If no user IDs provided, select first conversation
        console.log("No user IDs provided, selecting first conversation");
        setSelectedChat(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [CURRENT_USER_ID, user1Id, user2Id]);

  // Load messages for selected conversation
  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !CURRENT_USER_ID) {
        console.warn("Cannot load messages: missing conversationId or userId");
        return;
      }

      console.log(`Loading messages for conversation: ${conversationId}`);
      setLoadingMessages(true);

      try {
        const data = await apiService.getMessages(
          conversationId,
          CURRENT_USER_ID
        );
        console.log(
          `Loaded ${data.length} messages for conversation ${conversationId}:`,
          data
        );
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    },
    [CURRENT_USER_ID]
  );

  // Initialize SignalR connection
  useEffect(() => {
    if (!CURRENT_USER_ID) {
      console.error("User ID is required for SignalR connection");
      setConnectionStatus("disconnected");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://seregamars-001-site9.ntempurl.com/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    // Setup event handlers
    newConnection.on("ReceiveMessage", (message: any) => {
      console.log("Received message:", message);

      const receivedMessage: Message = {
        id: message.id,
        senderId: message.senderId,
        text: message.text,
        timestamp: message.timestamp,
        isOwn: false,
      };

      setMessages((prev) => [...prev, receivedMessage]);
      loadOrCreateConversation();
    });

    newConnection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      setConnectionStatus("disconnected");
    });

    newConnection.onreconnecting((error) => {
      console.log("SignalR reconnecting:", error);
      setConnectionStatus("connecting");
    });

    newConnection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      setConnectionStatus("connected");
    });

    // Start connection
    const startConnection = async () => {
      try {
        setConnectionStatus("connecting");
        console.log("Starting SignalR connection...");
        await newConnection.start();
        setConnectionStatus("connected");
        setConnection(newConnection);
        console.log("SignalR Connected successfully");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setConnectionStatus("disconnected");
      }
    };

    startConnection();

    // Cleanup on unmount
    return () => {
      if (newConnection) {
        console.log("Stopping SignalR connection...");
        newConnection.stop();
      }
    };
  }, [CURRENT_USER_ID, loadOrCreateConversation]);

  // Load conversations on mount
  useEffect(() => {
    if (CURRENT_USER_ID) {
      loadOrCreateConversation();
    }
  }, [CURRENT_USER_ID, loadOrCreateConversation]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [loading]);

  // Handle conversation selection and join
  useEffect(() => {
    if (!selectedChat) {
      console.log("No chat selected, clearing messages");
      setMessages([]);
      return;
    }

    console.log(`Chat selection changed to: ${selectedChat}`);

    // Load messages for the selected conversation
    loadMessages(selectedChat);

    // Join conversation via SignalR if connected
    if (connection && connectionStatus === "connected" && CURRENT_USER_ID) {
      const joinConversation = async () => {
        try {
          console.log(
            `Attempting to join conversation: ${selectedChat} for user: ${CURRENT_USER_ID}`
          );
          await connection.invoke(
            "JoinConversation",
            String(selectedChat),
            String(CURRENT_USER_ID)
          );
          console.log(`Successfully joined conversation: ${selectedChat}`);
        } catch (error) {
          console.error("Failed to join conversation:", error);
        }
      };

      joinConversation();
    }
  }, [
    selectedChat,
    connection,
    connectionStatus,
    CURRENT_USER_ID,
    loadMessages,
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat || !CURRENT_USER_ID) return;

    const text = messageText.trim();
    setMessageText("");

    try {
      console.log(`Sending message to conversation ${selectedChat}: ${text}`);

      if (connection && connectionStatus === "connected") {
        await connection.invoke(
          "SendMessage",
          String(selectedChat),
          String(CURRENT_USER_ID),
          String(text)
        );
        console.log("Message sent via SignalR");

        const tempMessage: Message = {
          id: `temp-${Date.now()}`,
          senderId: CURRENT_USER_ID,
          text: text,
          timestamp: new Date().toLocaleTimeString(),
          isOwn: true,
        };
        setMessages((prev) => [...prev, tempMessage]);
      }

      loadOrCreateConversation();
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageText(text);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">
          Loading conversations...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen container px-10 py-10 bg-gray-50 flex">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-bounce-gentle {
          animation: bounce 0.6s ease-out;
        }

        .message-enter {
          opacity: 0;
          transform: translateY(10px) scale(0.95);
        }

        .message-enter-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: all 0.3s ease-out;
        }
      `}</style>

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button
              onClick={() => onNavigate("marketplace")}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          {/* Connection Status */}
          <div className="mt-2 flex items-center text-sm">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-gray-500 capitalize">{connectionStatus}</span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              onClick={() => {
                console.log(`Selecting conversation: ${conversation.id}`);
                setSelectedChat(conversation.id);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 animate-fade-in ${
                selectedChat === conversation.id
                  ? "bg-primary-50 border-r-2 border-r-primary-500"
                  : " "
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.user.userName}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full animate-pulse">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1 space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">
                      {conversation.user.rating} (
                      {conversation.user.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h2 className="text-lg font-medium text-gray-900">
                        {selectedConversation.user.userName}
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span
                        className={`transition-colors duration-200 ${
                          selectedConversation.isOnline ? "text-green-600" : ""
                        }`}
                      >
                        {selectedConversation.isOnline ? "Online" : "Offline"}
                      </span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span>
                          {selectedConversation.user.rating} (
                          {selectedConversation.user.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center">
                  <div className="text-gray-500 animate-pulse">
                    Loading messages...
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center">
                  <div className="text-gray-500 animate-fade-in">
                    No messages yet. Start the conversation!
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isOwn ? "justify-end" : "justify-start"
                    } animate-slide-up`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transform transition-all duration-200 hover:scale-105 ${
                        message.isOwn
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-md hover:shadow-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.isOwn ? "text-primary-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start animate-slide-up">
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-200 rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={connectionStatus !== "connected" || loadingMessages}
                />
                <button
                  type="submit"
                  disabled={
                    !messageText.trim() ||
                    connectionStatus !== "connected" ||
                    loadingMessages
                  }
                  className={`p-3 rounded-full transition-all duration-200 transform ${
                    messageText.trim() && connectionStatus === "connected"
                      ? "bg-primary-500 text-white hover:bg-primary-600 hover:scale-105 animate-bounce-gentle"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
