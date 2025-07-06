import React from "react";
import {
  Gavel,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Trophy,
  Star,
  DollarSign,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

// Types based on your API response
interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
}

interface AuctionItem {
  id: number;
  startDate: string;
  endDate: string;
  product: Product;
  isActive: boolean;
  bids: any[] | null;
}

interface AuctionsProps {
  onNavigate?: (page: string, param?: string) => void;
}

export default function Auctions({ onNavigate }: AuctionsProps) {
  const [auctionItems, setAuctionItems] = React.useState<AuctionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [timeLeft, setTimeLeft] = React.useState<Record<number, string>>({});
  const [hoveredStat, setHoveredStat] = React.useState<number | null>(null);

  // Fetch auction data from API
  React.useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://seregamars-001-site9.ntempurl.com/auctions"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AuctionItem[] = await response.json();
        setAuctionItems(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Timer effect for countdown
  React.useEffect(() => {
    if (auctionItems.length === 0) return;

    const timer = setInterval(() => {
      const newTimeLeft: Record<number, string> = {};

      auctionItems.forEach((item) => {
        const endTime = new Date(item.endDate).getTime();
        const now = new Date().getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          if (days > 0) {
            newTimeLeft[item.id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeLeft[item.id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[item.id] = `${minutes}m ${seconds}s`;
          }
        } else {
          newTimeLeft[item.id] = "Ended";
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionItems]);

  const handleNavigation = (page: string, param?: string) => {
    if (onNavigate) {
      onNavigate(page, param);
    } else {
      console.log(`Navigate to ${page}`, param);
    }
  };

  // Enhanced stats with more dynamic data
  const auctionStats = [
    {
      icon: TrendingUp,
      number: auctionItems.length,
      label: "Live Auctions",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "Active right now",
    },
    {
      icon: Users,
      number: "2.3K",
      label: "Active Bidders",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Online bidding",
    },
    {
      icon: DollarSign,
      number: "$1.2M",
      label: "Total Bids Today",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "In the last 24h",
    },
    {
      icon: Timer,
      number: "24",
      label: "Ending Soon",
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Next 2 hours",
    },
  ];

  const floatingElements = [
    { icon: Gavel, delay: 0, x: "10%", y: "20%" },
    { icon: Trophy, delay: 1, x: "85%", y: "15%" },
    { icon: Star, delay: 2, x: "15%", y: "80%" },
    { icon: Target, delay: 3, x: "90%", y: "75%" },
    { icon: Sparkles, delay: 4, x: "50%", y: "10%" },
    { icon: Zap, delay: 5, x: "75%", y: "85%" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auctions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Auctions
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Icons */}
          {floatingElements.map((element, index) => (
            <motion.div
              key={index}
              className="absolute opacity-10"
              style={{ left: element.x, top: element.y }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-10, 10, -10],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 6 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: element.delay,
              }}
            >
              <element.icon className="h-16 w-16" />
            </motion.div>
          ))}

          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                radial-gradient(circle at 25% 25%, white 3px, transparent 3px),
                radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
              `,
                backgroundSize: "80px 80px, 60px 60px",
              }}
            ></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-yellow-200" />
              </motion.div>
              <span className="text-white font-semibold">
                🔥 Hot Auctions Live Now!
              </span>
              <motion.div
                className="w-3 h-3 bg-red-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Main Title with Staggered Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Live
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Auctions
                </motion.span>
                <motion.div
                  className="flex items-center justify-center space-x-4 mt-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Gavel className="h-16 w-16 text-yellow-200" />
                  </motion.div>
                  <motion.span
                    className="text-white text-2xl md:text-3xl font-light"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Happening Now
                  </motion.span>
                </motion.div>
              </motion.h1>
            </motion.div>

            {/* Enhanced Description */}
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <p className="text-xl md:text-2xl text-orange-100 mb-6 leading-relaxed">
                Discover extraordinary treasures and rare collectibles in our
                thrilling live auctions
              </p>
              <motion.div
                className="flex flex-wrap justify-center gap-4 text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                {[
                  "🏆 Authenticated Items",
                  "⚡ Real-time Bidding",
                  "🛡️ Buyer Protection",
                  "🌟 Expert Curation",
                ].map((feature, index) => (
                  <motion.span
                    key={feature}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {feature}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Interactive CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.button
                className="group relative bg-white text-orange-600 hover:text-orange-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden min-w-[200px]"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Gavel className="h-6 w-6" />
                  </motion.div>
                  <span>Start Bidding</span>
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.button>

              <motion.button
                onClick={() => onNavigate("ai-helper")}
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden min-w-[200px]"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <span>AI Bidding Tips</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Interactive Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {auctionStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center cursor-pointer overflow-hidden group ${
                hoveredStat === index ? "shadow-xl" : ""
              }`}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {/* Animated Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon with Animation */}
              <motion.div
                className={`${stat.bgColor} rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center relative`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                {index === 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Number with Counter Animation */}
              <motion.div
                className="text-3xl font-bold text-gray-900 mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                {stat.number}
              </motion.div>

              {/* Label */}
              <div className="text-sm font-medium text-gray-700 mb-1">
                {stat.label}
              </div>

              {/* Description */}
              <motion.div
                className="text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredStat === index ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {stat.description}
              </motion.div>

              {/* Hover Effect Particles */}
              {hoveredStat === index && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary-400 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [-10, -20, -10],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
        {/* Featured Auctions */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Auctions
          </h2>

          {auctionItems.length === 0 ? (
            <div className="text-center py-12">
              <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Auctions
              </h3>
              <p className="text-gray-600">
                Check back later for new auction listings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {auctionItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                  onClick={() =>
                    handleNavigation("auction-detail", item.id.toString())
                  }
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={item.product.images[0] || "/api/placeholder/400/400"}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/400";
                      }}
                    />

                    {/* Time Left Badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 ${
                          item.isActive
                            ? "bg-red-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span>{timeLeft[item.id] || "Loading..."}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {!item.isActive && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Inactive
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.product.description}
                    </p>

                    {/* Auction Info */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">
                        Auction ID
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        #{item.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.bids?.length || 0} bids
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                      <div>
                        <div>
                          Started:{" "}
                          {new Date(item.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          Ends: {new Date(item.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation("auction-detail", item.id.toString());
                      }}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        item.isActive
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!item.isActive}
                    >
                      {item.isActive ? "View Auction" : "Auction Ended"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <motion.section
          className="mt-20 bg-white rounded-2xl p-12 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Auctions Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Browse & Find
              </h3>
              <p className="text-gray-600">
                Discover unique items and rare collectibles in our auction
                listings.
              </p>
            </motion.div>

            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Place Your Bid
              </h3>
              <p className="text-gray-600">
                Enter your maximum bid and let our system bid automatically for
                you.
              </p>
            </motion.div>

            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="bg-purple-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Win & Pay
              </h3>
              <p className="text-gray-600">
                If you win, complete the secure payment and arrange delivery.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
