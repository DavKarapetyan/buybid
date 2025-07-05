import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Star,
  MessageCircle,
  Eye,
  RefreshCw,
  Loader2,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { PageType } from "../../types";
import { apiService111, convertApiTradeToInternal } from "../../services/api";
import { useAuth } from "../Auth/AuthContext";

interface TradesPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function TradesPage({ onNavigate }: TradesPageProps) {
  const [activeTab, setActiveTab] = React.useState<"received" | "sent">(
    "received"
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "pending" | "accepted" | "declined"
  >("all");
  const [trades, setTrades] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuth();

  // Mock current user ID - in real app, this would come from auth context
  const currentUserId = user?.id || "";

  React.useEffect(() => {
    loadTrades();
  }, [activeTab]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      // For sent trades, sentOffers=true; for received trades, sentOffers=false
      const sentOffers = activeTab === "sent";
      const response = await apiService111.getUserTrades(
        currentUserId,
        sentOffers
      );

      const convertedTrades = response.map(convertApiTradeToInternal);
      setTrades(convertedTrades);
    } catch (err) {
      console.error("Failed to load trades:", err);
      setError(err instanceof Error ? err.message : "Failed to load trades");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
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
        return "bg-primary-100 text-primary-800 border-primary-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.offeredItem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trade.requestedItem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || trade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTradeStats = () => {
    const activeTrades = trades.filter((t) => t.status === "pending").length;
    const completedTrades = trades.filter(
      (t) => t.status === "accepted" || t.status === "completed"
    ).length;
    const pendingReview = trades.filter(
      (t) => t.status === "pending" && activeTab === "received"
    ).length;
    const totalTrades = trades.length;

    return { activeTrades, completedTrades, pendingReview, totalTrades };
  };

  const stats = getTradeStats();

  if (loading && trades.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading trades...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your trade information.
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
            Error loading trades
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTrades}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              onClick={() => onNavigate("home")}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Trade Center</h1>
          </div>

          <motion.button
            onClick={() => onNavigate("create-trade")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5" />
            <span>Create Trade Offer</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {[
            {
              label: "Active Trades",
              value: stats.activeTrades.toString(),
              color: "blue",
              icon: RefreshCw,
            },
            {
              label: "Completed",
              value: stats.completedTrades.toString(),
              color: "green",
              icon: CheckCircle,
            },
            {
              label: "Pending Review",
              value: stats.pendingReview.toString(),
              color: "yellow",
              icon: Clock,
            },
            {
              label: "Total Trades",
              value: stats.totalTrades.toString(),
              color: "purple",
              icon: Star,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              {[
                { key: "received", label: "Received Offers" },
                { key: "sent", label: "Sent Offers" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "received" | "sent")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Trade Offers List */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading trades...</p>
            </div>
          )}

          {!loading && filteredTrades.length === 0 ? (
            <motion.div
              className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <RefreshCw className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No trades found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : `No ${activeTab} trades yet. Start trading by creating your first offer!`}
              </p>
              <button
                onClick={() => onNavigate("create-trade")}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Trade Offer
              </button>
            </motion.div>
          ) : (
            trades.map((offer, index) => (
              <motion.div
                key={offer.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => onNavigate("trade", { tradeId: offer.id })}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {offer.fromUser.name}
                        </h3>
                        {offer.fromUser.isVerified && (
                          <div className="bg-primary-100 text-primary-700 rounded-full p-1">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>
                          {offer.fromUser.rating} ({offer.fromUser.reviewCount}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        offer.status
                      )}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(offer.status)}
                        <span className="capitalize">{offer.status}</span>
                      </div>
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(offer.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Trade Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Offered Item */}
                  <div className="bg-primary-50 p-4 rounded-xl border border-primary-200">
                    <h4 className="font-semibold text-primary-900 mb-3">
                      Offering
                    </h4>
                    <div className="flex items-center space-x-3">
                      <img
                        src={offer.offeredItem.images[0]}
                        alt={offer.offeredItem.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 line-clamp-2">
                          {offer.offeredItem.title}
                        </h5>
                        <p className="text-primary-600 font-semibold">
                          {formatPrice(offer.offeredItem.price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trade Arrow */}
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <ArrowRight className="h-6 w-6 text-gray-600" />
                    </div>
                    {offer.additionalCash > 0 && (
                      <div className="ml-3 bg-green-100 px-3 py-1 rounded-full">
                        <span className="text-green-800 font-semibold text-sm">
                          + {formatPrice(offer.additionalCash)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Requested Item */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">For</h4>
                    {offer.requestedItem.title === "Cash Request" ? (
                      <div className="flex items-center space-x-3">
                        <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center">
                          <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            Cash Only
                          </h5>
                          <p className="text-green-600 font-semibold">
                            {formatPrice(offer.requestedItem.price)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <img
                          src={offer.requestedItem.images[0]}
                          alt={offer.requestedItem.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 line-clamp-2">
                            {offer.requestedItem.title}
                          </h5>
                          <p className="text-green-600 font-semibold">
                            {formatPrice(offer.requestedItem.price)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Preview */}
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700 line-clamp-2">{offer.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate("trade", offer.id);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-primary-600 hover:text-primary-700 border-primary-600 border-2 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>

                  {/* {offer.status === "pending" &&
                    activeTab === "received" &&
                    offer.toUser.id === currentUserId && (
                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={(e) => e.stopPropagation()}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Decline
                        </motion.button>
                        <motion.button
                          onClick={(e) => e.stopPropagation()}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Accept Trade
                        </motion.button>
                      </div>
                    )} */}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
