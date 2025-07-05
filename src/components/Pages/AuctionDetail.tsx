import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Gavel,
  Clock,
  Users,
  Eye,
  Heart,
  Share2,
  Star,
  MapPin,
  Shield,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "../Auth/AuthContext";

interface Bid {
  //id: number;
  userId: string;
  amount: number;
  placedAt: string;
  auctionId: number;
  username?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
}

interface AuctionData {
  id: number;
  startDate: string;
  endDate: string;
  product: Product;
  isActive: boolean;
  bids: Bid[];
}

interface AuctionDetailProps {
  auctionId: string;
  onNavigate: (page: string) => void;
}

export default function AuctionDetail({
  auctionId,
  onNavigate,
}: AuctionDetailProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [bidAmount, setBidAmount] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState("");
  const [auction, setAuction] = React.useState<AuctionData | null>(null);
  const [currentBid, setCurrentBid] = React.useState<number>(0);
  const [bidCount, setBidCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [connection, setConnection] =
    React.useState<signalR.HubConnection | null>(null);
  const [isSubmittingBid, setIsSubmittingBid] = React.useState(false);
  const { user, logout, updateUser } = useAuth();

  // Initialize SignalR connection
  React.useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://seregamars-001-site9.ntempurl.com/auctionHub") // Adjust this URL to match your SignalR hub endpoint
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  // Start connection and join auction group
  React.useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");
          // Join the auction group
          connection.invoke("JoinAuction", auctionId);
        })
        .catch((err) => console.error("Error connecting to SignalR hub:", err));

      // Listen for bid updates
      connection.on(
        "ReceiveBid",
        (
          auctionIdReceived: string,
          userId: string,
          userName: string,
          bidAmount: number
        ) => {
          if (auctionIdReceived === auctionId) {
            // Update auction data with new bid
            const newBid: Bid = {
              userId: userId,
              amount: bidAmount,
              placedAt: new Date().toISOString(),
              auctionId: Number.parseInt(auctionId),
              username: userName,
            };

            setAuction((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                bids: [newBid, ...prev.bids],
              };
            });

            setCurrentBid(bidAmount);
            setBidCount((prev) => prev + 1);
          }
        }
      );

      return () => {
        connection.invoke("LeaveAuction", auctionId);
        connection.off("ReceiveBid");
      };
    }
  }, [connection, auctionId]);

  // Fetch auction data from API
  React.useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://localhost:7207/auctions/` + auctionId
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const auctionData = await response.json();
        setAuction(auctionData);
        setBidCount(auctionData.bids.length);

        // Calculate current bid from bids array
        if (auctionData.bids.length > 0) {
          const highestBid = Math.max(
            ...auctionData.bids.map((bid: { amount: any }) => bid.amount)
          );
          setCurrentBid(highestBid);
        } else {
          setCurrentBid(1000); // Starting bid - adjust as needed
        }

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch auction data"
        );
        console.error("Error fetching auction:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId]);

  // Timer for auction countdown using endDate from API
  React.useEffect(() => {
    if (!auction?.endDate) return;

    const timer = setInterval(() => {
      const endTime = new Date(auction.endDate).getTime();
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
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft("Auction Ended");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction?.endDate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connection || !auction) return;

    const amount = parseFloat(bidAmount);
    if (amount <= currentBid) {
      alert("Bid must be higher than current bid");
      return;
    }

    setIsSubmittingBid(true);

    try {
      // Replace 'current-user-id' with actual user ID from your auth system
      const userId = user?.id;

      // Send bid through SignalR hub
      await connection.invoke("SendBid", auctionId, userId, amount);
      setBidAmount("");

      console.log(`Bid placed successfully for ${formatPrice(amount)}!`);
    } catch (err) {
      console.error("Error placing bid:", err);
      alert("Failed to place bid. Please try again.");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Auction
          </h2>
          <p className="text-gray-600 mb-4">{error || "Auction not found"}</p>
          <button
            onClick={() => onNavigate("auctions")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const suggestedBid = Math.ceil((currentBid + 200) / 100) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => onNavigate("auctions")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Auctions</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={auction.product.images[selectedImage]}
                  alt={auction.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {auction.product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {auction.product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`${auction.product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {auction.product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    auction.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {auction.isActive ? "Active" : "Ended"}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {auction.product.description}
              </p>
            </motion.div>

            {/* Bid History */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Bid History
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {auction.bids.length > 0 ? (
                  auction.bids
                    .sort((a, b) => b.amount - a.amount)
                    .map((bid, index) => (
                      <motion.div
                        key={bid.placedAt}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          index === 0
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0
                                ? "bg-green-600 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {bid.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(bid.placedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              index === 0 ? "text-green-600" : "text-gray-900"
                            }`}
                          >
                            {formatPrice(bid.amount)}
                          </p>
                          {index === 0 && (
                            <p className="text-sm text-green-600">
                              Current High Bid
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No bids yet. Be the first to bid!
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Bidding Panel */}
          <div className="space-y-6">
            {/* Auction Status */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-center mb-6">
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full inline-flex items-center space-x-2 mb-4">
                  <Clock className="h-4 w-4" />
                  <span className="font-bold">{timeLeft}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Current Bid
                </h2>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {formatPrice(currentBid)}
                </p>
                <p className="text-sm text-gray-600">{bidCount} bids</p>
              </div>

              {/* Bidding Form */}
              {auction.isActive && timeLeft !== "Auction Ended" && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={suggestedBid.toString()}
                        min={currentBid + 1}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                        disabled={isSubmittingBid}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum bid: {formatPrice(currentBid + 1)}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[200, 500, 1000].map((increment) => (
                      <button
                        key={increment}
                        type="button"
                        onClick={() =>
                          setBidAmount((currentBid + increment).toString())
                        }
                        className="py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isSubmittingBid}
                      >
                        +${increment}
                      </button>
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmittingBid ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmittingBid ? 1 : 0.98 }}
                    disabled={isSubmittingBid}
                  >
                    <Gavel className="h-5 w-5" />
                    <span>
                      {isSubmittingBid ? "Placing Bid..." : "Place Bid"}
                    </span>
                  </motion.button>
                </form>
              )}

              {(!auction.isActive || timeLeft === "Auction Ended") && (
                <div className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-500">
                    Auction has ended
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure bidding with buyer protection</span>
                </div>
              </div>
            </motion.div>

            {/* Auction Details */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Auction Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">
                    {formatTime(auction.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">
                    {formatTime(auction.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      auction.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {auction.isActive ? "Active" : "Ended"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
