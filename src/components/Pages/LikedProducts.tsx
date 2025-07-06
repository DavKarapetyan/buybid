import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  Share2,
  ShoppingCart,
  Grid,
  List,
  Trash2,
  Star,
  MapPin,
  Eye,
  MessageCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Package,
  Loader2,
} from "lucide-react";
import { PageType } from "../../types";
import ProductCard from "../Products/ProductCard";
import { useAuth } from "../Auth/AuthContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  location: string;
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
  modelUrl?: string;
  isLiked?: boolean;
}

interface LikedProductsProps {
  onNavigate: (page: PageType, param?: string) => void;
}

export default function LikedProducts({ onNavigate }: LikedProductsProps) {
  const [likedProducts, setLikedProducts] = React.useState<Product[]>([]);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuth();

  // Fetch liked products from API
  React.useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://seregamars-001-site9.ntempurl.com/user/" + user?.id
        );

        if (!response.ok) {
          throw new Error("Failed to fetch liked products");
        }

        const data = await response.json();
        setLikedProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

  const handleRemoveFromLiked = (productId: number) => {
    setLikedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleBulkRemove = () => {
    if (selectedItems.length === 0) return;

    setLikedProducts((prev) =>
      prev.filter((p) => !selectedItems.includes(p.id))
    );
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const handleSelectItem = (productId: number) => {
    setSelectedItems((prev) => {
      const newSelection = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === likedProducts.length) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      setSelectedItems(likedProducts.map((p) => p.id));
      setShowBulkActions(true);
    }
  };

  const handleToggleLike = (productId: number) => {
    handleRemoveFromLiked(productId);
  };

  const handleMessageSeller = (productId: number) => {
    // Handle messaging seller logic here
    console.log("Message seller for product:", productId);
  };

  const handleShare = async (product: Product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} for $${product.price}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${product.name} - $${product.price}`);
      alert("Product details copied to clipboard!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading your liked products...
          </h2>
          <p className="text-gray-600">This won't take long</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <X className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load liked products
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-red-100 p-3 rounded-xl">
                  <Heart className="h-8 w-8 text-red-600 fill-current" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Liked Products
                  </h1>
                  <p className="text-gray-600">
                    {likedProducts.length} products in your wishlist
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {likedProducts.length}
                </div>
                <div className="text-sm text-gray-600">Total Liked</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(
                    likedProducts.reduce((sum, p) => sum + p.price, 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(likedProducts.map((p) => p.categoryDto.name)).size}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Bulk Actions */}
            <div className="flex items-center space-x-4">
              <AnimatePresence>
                {showBulkActions && (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} selected
                    </span>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {selectedItems.length === likedProducts.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                    <button
                      onClick={handleBulkRemove}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Mode and Select Mode */}
            <div className="flex items-center space-x-4">
              {/* Select Mode Toggle */}
              <button
                onClick={() => {
                  setShowBulkActions(!showBulkActions);
                  if (showBulkActions) {
                    setSelectedItems([]);
                  }
                }}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  showBulkActions
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Select
              </button>

              {/* View Mode */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        {likedProducts.length > 0 ? (
          <motion.div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {likedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onToggleLike={handleToggleLike}
                onMessageSeller={handleMessageSeller}
                isSelected={selectedItems.includes(product.id)}
                onSelect={
                  showBulkActions
                    ? () => handleSelectItem(product.id)
                    : undefined
                }
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No liked products yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing and like products to see them here
            </p>
            <motion.button
              onClick={() => onNavigate("category")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="h-5 w-5" />
              <span>Browse Products</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Recommendations */}
        {likedProducts.length > 0 && (
          <motion.section
            className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-center text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Animation */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-10 right-10 w-24 h-24 bg-pink-300/20 rounded-full blur-lg"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Sparkles className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">
                  Discover Similar Products
                </h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  Based on your liked products, we think you'll love these
                  recommendations
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => onNavigate("category")}
                    className="group relative bg-white text-purple-700 hover:text-purple-800 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center space-x-3">
                      <TrendingUp className="h-6 w-6" />
                      <span>View Recommendations</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => onNavigate("ai-helper")}
                    className="group relative bg-purple-700 hover:bg-purple-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border-2 border-purple-500 overflow-hidden"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center space-x-3">
                      <Sparkles className="h-6 w-6" />
                      <span>AI Suggestions</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
