import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Shield,
  AlertTriangle,
  Package,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";
import { PageType } from "../../types";
import { apiService111, convertApiTradeToInternal } from "../../services/api";
import { useAuth } from "../Auth/AuthContext";

interface TradeDetailsProps {
  onNavigate: (page: PageType) => void;
  tradeId: string;
}

export default function TradeDetails({
  onNavigate,
  tradeId,
}: TradeDetailsProps) {
  const [activeTab, setActiveTab] = React.useState<
    "details" | "messages" | "timeline"
  >("details");
  const [showAcceptModal, setShowAcceptModal] = React.useState(false);
  const [showDeclineModal, setShowDeclineModal] = React.useState(false);
  const [trade, setTrade] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [updating, setUpdating] = React.useState(false);
  const { user } = useAuth();

  // Mock current user ID - in real app, this would come from auth context
  const currentUserId = user?.id || "";
  console.log(tradeId);
  React.useEffect(() => {
    loadTradeDetails();
  }, [tradeId]);

  const loadTradeDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiTrade = await apiService111.getTrade(tradeId, currentUserId);
      const convertedTrade = convertApiTradeToInternal(apiTrade);
      setTrade(convertedTrade);
    } catch (err) {
      console.error("Failed to load trade details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load trade details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTradeStatus = async (status: "accepted" | "declined") => {
    try {
      setUpdating(true);

      await apiService111.updateTradeStatus({
        id: parseInt(tradeId),
        status: status === "accepted" ? "Accepted" : "Declined",
      });

      onNavigate("home");
      // Reload trade details to get updated status
      //await loadTradeDetails();

      setShowAcceptModal(false);
      setShowDeclineModal(false);
    } catch (err) {
      console.error("Failed to update trade status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update trade status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading trade details...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the trade information.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading trade
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={loadTradeDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => onNavigate("trades")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Trades
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trade not found
          </h2>
          <button
            onClick={() => onNavigate("trades")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Trades
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "accepted":
        return <CheckCircle className="h-5 w-5" />;
      case "declined":
        return <XCircle className="h-5 w-5" />;
      case "completed":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const tradeTimeline = [
    {
      id: "1",
      title: "Trade Offer Created",
      description: `${trade.fromUser.name} created this trade offer`,
      timestamp: trade.createdAt,
      icon: Package,
      color: "blue",
    },
    {
      id: "2",
      title: "Offer Sent",
      description: "Trade offer was sent for review",
      timestamp: trade.createdAt,
      icon: ArrowRight,
      color: "purple",
    },
    ...(trade.status === "accepted"
      ? [
          {
            id: "3",
            title: "Offer Accepted",
            description: "Trade offer was accepted",
            timestamp: trade.updatedAt,
            icon: CheckCircle,
            color: "green",
          },
        ]
      : []),
    ...(trade.status === "declined"
      ? [
          {
            id: "3",
            title: "Offer Declined",
            description: "Trade offer was declined",
            timestamp: trade.updatedAt,
            icon: XCircle,
            color: "red",
          },
        ]
      : []),
  ];

  const isCurrentUserRecipient = trade.toUser.id === currentUserId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate("trades")}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Trades</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Trade Details</h1>
          </div>

          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(
              trade.status
            )}`}
          >
            {getStatusIcon(trade.status)}
            <span className="font-medium capitalize">{trade.status}</span>
          </div>
        </motion.div>

        {/* Trade Overview */}
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Offered Item */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={trade.fromUser.avatar}
                  alt={trade.fromUser.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {trade.fromUser.name} is offering
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {trade.fromUser.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <img
                  src={trade.offeredItem.images[0]}
                  alt={trade.offeredItem.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900 mb-2">
                  {trade.offeredItem.title}
                </h4>
                <p className="text-blue-600 font-bold text-lg">
                  {formatPrice(trade.offeredItem.price)}
                </p>
                {trade.additionalCash > 0 && (
                  <div className="mt-3 bg-green-100 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-green-800 font-semibold">
                        + {formatPrice(trade.additionalCash)} cash
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trade Arrow */}
            <div className="flex items-center justify-center">
              <motion.div
                className="bg-gray-100 p-6 rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <ArrowRight className="h-8 w-8 text-gray-600" />
              </motion.div>
            </div>

            {/* Requested Item */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={trade.toUser.avatar}
                  alt={trade.toUser.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-green-900">
                    For {trade.toUser.name}'s
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {trade.toUser.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <img
                  src={trade.requestedItem.images[0]}
                  alt={trade.requestedItem.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900 mb-2">
                  {trade.requestedItem.title}
                </h4>
                <p className="text-green-600 font-bold text-lg">
                  {formatPrice(trade.requestedItem.price)}
                </p>
              </div>
            </div>
          </div>

          {/* Trade Value Summary */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trade Value Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Offered Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(
                    trade.offeredItem.price + (trade.additionalCash || 0)
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Requested Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(trade.requestedItem.price)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Difference</p>
                <p
                  className={`text-2xl font-bold ${
                    trade.offeredItem.price + (trade.additionalCash || 0) >
                    trade.requestedItem.price
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatPrice(
                    Math.abs(
                      trade.offeredItem.price +
                        (trade.additionalCash || 0) -
                        trade.requestedItem.price
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { key: "details", label: "Details", icon: FileText },
                { key: "timeline", label: "Timeline", icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.key
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Message */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Trade Message
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-700 leading-relaxed">
                      {trade.message}
                    </p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Offered Product Details
                    </h3>
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">Category</p>
                      <p className="font-medium text-gray-900 mb-4">
                        {trade.offeredItem.category}
                      </p>

                      <p className="text-sm text-gray-600 mb-2">Location</p>
                      <p className="font-medium text-gray-900 mb-4">
                        {trade.offeredItem.location}
                      </p>

                      <p className="text-sm text-gray-600 mb-2">Description</p>
                      <p className="text-gray-700">
                        {trade.offeredItem.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Requested Product Details
                    </h3>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">Category</p>
                      <p className="font-medium text-gray-900 mb-4">
                        {trade.requestedItem.category}
                      </p>

                      <p className="text-sm text-gray-600 mb-2">Location</p>
                      <p className="font-medium text-gray-900 mb-4">
                        {trade.requestedItem.location}
                      </p>

                      <p className="text-sm text-gray-600 mb-2">Description</p>
                      <p className="text-gray-700">
                        {trade.requestedItem.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Safety Guidelines */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Safety Guidelines
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-6 w-6 text-yellow-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">
                          Safe Trading Tips
                        </h4>
                        <ul className="space-y-2 text-yellow-700">
                          <li>• Meet in a public, well-lit location</li>
                          <li>• Bring a friend or family member</li>
                          <li>• Inspect items thoroughly before trading</li>
                          <li>
                            • Trust your instincts - if something feels wrong,
                            walk away
                          </li>
                          <li>
                            • Use our in-app messaging for all communications
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "timeline" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-6">
                  {tradeTimeline.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`p-3 rounded-full bg-${event.color}-100`}>
                        <event.icon
                          className={`h-5 w-5 text-${event.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 mb-1">
                          {event.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        {trade.status === "pending" && isCurrentUserRecipient && (
          <motion.div
            className="flex items-center justify-center space-x-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => setShowDeclineModal(true)}
              disabled={updating}
              className="flex items-center space-x-2 px-8 py-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {updating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>Decline Trade</span>
            </motion.button>

            <motion.button
              onClick={() => setShowAcceptModal(true)}
              disabled={updating}
              className="flex items-center space-x-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {updating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              <span>Accept Trade</span>
            </motion.button>
          </motion.div>
        )}

        {/* Accept Modal */}
        {showAcceptModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white p-8 rounded-2xl max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Accept Trade Offer
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to accept this trade offer? This action
                cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateTradeStatus("accepted")}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {updating ? "Accepting..." : "Accept Trade"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white p-8 rounded-2xl max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Decline Trade Offer
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to decline this trade offer? The other
                user will be notified.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateTradeStatus("declined")}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {updating ? "Declining..." : "Decline Trade"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
