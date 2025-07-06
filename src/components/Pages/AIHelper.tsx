import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  Search,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Shield,
} from "lucide-react";
import { PageType } from "../../types";

interface AIHelperProps {
  onNavigate: (page: PageType) => void;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryDto: {
    id: number;
    name: string;
    parentCategoryId: number;
    parentCategoryName: string;
  };
  createdByUserId: string;
  attributes: Array<{
    name: string;
    value: string;
    dataType: number;
  }>;
  images: string[];
  isLiked?: boolean; // Optional for local state management
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  message: string;
  timestamp: string;
}

export default function AIHelper({ onNavigate }: AIHelperProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      message:
        "Hi! I'm your AI shopping assistant powered by Gemini. I can help you find products, compare prices, get recommendations, and provide shopping insights. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(
    "AIzaSyA4WazItdk6gpjHZW_I9QNyZkFii4Fu_EQ"
  );
  const [showApiKeyInput, setShowApiKeyInput] = React.useState(false);
  const [error, setError] = React.useState("");

  const aiFeatures = [
    {
      icon: Search,
      title: "Smart Product Search",
      description: "Find exactly what you need with natural language search",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Price Predictions",
      description: "Get insights on price trends and best times to buy",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Discover products tailored to your preferences",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description: "AI-powered protection against scams and fake listings",
      color: "bg-red-100 text-red-600",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          " https://seregamars-001-site9.ntempurl.com/products"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Add default values for missing properties and take first 8 products
        const processedProducts = data
          .sort(() => 0.5 - Math.random())
          .map((product: any) => ({
            ...product,
            isLiked: false, // Default value
            // Ensure images array exists
            images:
              product.images && product.images.length > 0
                ? product.images
                : [
                    "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400",
                  ],
            // Ensure attributes array exists
            attributes: product.attributes || [],
          }));

        setProducts(processedProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
        console.error("Error fetching products:", err);
      } finally {
      }
    };

    fetchProducts();
  }, []);

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are AI Shopping Assistant, you have products list, which I provided you in json format, you gonna help users based on that data. Please provide helpful, friendly responses focused on shopping assistance. ${JSON.stringify(
                      products
                    )} please analyze that data and use only that data, without external resources for answering questions. Please provide answers like you are human, with stickers, and other things. User question: ${message}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  };

  const handleSendMessage = async (
    e?: React.FormEvent | React.KeyboardEvent
  ) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setError("");

    try {
      const aiResponse = await callGeminiAPI(inputMessage);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setError("Failed to get response from AI. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Shopping Assistant
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Get personalized recommendations, price insights, and smart
              shopping advice powered by Google Gemini AI
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12">
          {/* AI Chat Interface */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gemini AI Assistant</h3>
                  <p className="text-purple-100 text-sm">Always here to help</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-red-100 border border-red-200 px-4 py-3 rounded-2xl">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isTyping) {
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ask me anything about shopping..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isTyping}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  whileHover={{ scale: isTyping ? 1 : 1.05 }}
                  whileTap={{ scale: isTyping ? 1 : 0.95 }}
                >
                  <MessageCircle className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* AI Features */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                AI-Powered Features
              </h2>
              <p className="text-gray-600 mb-8">
                Our advanced Gemini AI helps you make smarter shopping decisions
                with personalized insights and recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => onNavigate("category")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Products
                </motion.button>
                <motion.button
                  onClick={() => onNavigate("auctions")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Live Auctions
                </motion.button>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Try asking me:
              </h3>
              <div className="space-y-2">
                {[
                  "What are the best deals on electronics this week?",
                  "Help me find a gift for my tech-savvy friend",
                  "What should I look for when buying used items?",
                  "Compare prices for smartphones under $500",
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Insights Section */}
        <motion.section
          className="mt-20 bg-white rounded-2xl p-12 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI Market Insights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get real-time market analysis and trends powered by Gemini AI
              algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">
                ↗ 15%
              </div>
              <div className="text-sm text-gray-600">
                Electronics prices trending up
              </div>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                🔥 Hot
              </div>
              <div className="text-sm text-gray-600">
                Vintage items in high demand
              </div>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">
                💎 Best
              </div>
              <div className="text-sm text-gray-600">
                Fashion deals this week
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
