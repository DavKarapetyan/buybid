// Combined ProductDetail component with model-viewer integration and like/unlike functionality
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  MessageCircle,
  Shield,
  Truck,
  RotateCcw,
  Cuboid as Cube,
  Eye,
  Smartphone,
  Maximize,
  ArrowRightLeft,
} from "lucide-react";
import { PageType } from "../../types";
import { motion } from "framer-motion";
import { calculateTransportCostFromCities } from "../../services/calculateTransportCostFromCities";

interface ProductApiResponse {
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
  modelUrl?: string;
  images: string[];
  userName: string;
}

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: PageType, param?: string) => void;
  userId?: string; // Add userId prop for like/unlike functionality
}

export default function ProductDetail({
  productId,
  onNavigate,
}: ProductDetailProps) {
  const [product, setProduct] = React.useState<ProductApiResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isLikeLoading, setIsLikeLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<
    "images" | "3d" | "model-viewer"
  >("images");
  const [isARSupported, setIsARSupported] = React.useState(false);
  const [isModelLoading, setIsModelLoading] = React.useState(true);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [result, setResult] = useState<{
    distanceKm: number;
    cost: number;
  } | null>(null);

  const modelViewerRef = React.useRef<any>(null);

  const modelUrl = product?.modelUrl;

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://seregamars-001-site9.ntempurl.com/products/${productId}`
        );
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    checkARSupport();
  }, [productId]);

  const checkARSupport = async () => {
    try {
      if ("xr" in navigator) {
        const isSupported = await (navigator as any).xr?.isSessionSupported(
          "immersive-ar"
        );
        if (isSupported) return setIsARSupported(true);
      }
      if (navigator.mediaDevices?.getUserMedia) setIsARSupported(true);
    } catch {
      setIsARSupported(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!product || !product.createdByUserId || isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      const url = isLiked
        ? "https://seregamars-001-site9.ntempurl.com/unlike"
        : "https://seregamars-001-site9.ntempurl.com/like";

      const payload = {
        userid: product.createdByUserId,
        productid: product.id,
      };

      console.log("Sending like/unlike payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Like API error response:", errorText);
        throw new Error(`Failed to ${isLiked ? "unlike" : "like"} product`);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
      alert(
        `Failed to ${isLiked ? "unlike" : "like"} product. Please try again.`
      );
    } finally {
      setIsLikeLoading(false);
    }
  };

  const getRealWorldScale = () => {
    if (!product) return undefined;
    const name = product.name.toLowerCase();
    const category = product.categoryDto.name.toLowerCase();

    if (category.includes("car"))
      return { width: 4.5, height: 1.8, depth: 1.5 };
    if (category.includes("electronics")) {
      if (name.includes("iphone"))
        return { width: 0.147, height: 0.072, depth: 0.008 };
      if (name.includes("macbook"))
        return { width: 0.304, height: 0.212, depth: 0.016 };
      return { width: 0.2, height: 0.15, depth: 0.05 };
    }
    if (category.includes("furniture"))
      return { width: 2.1, height: 0.9, depth: 0.9 };
    return { width: 0.3, height: 0.3, depth: 0.3 };
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  const handleModelLoad = () => {
    setIsModelLoading(false);
  };

  const handleViewInAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  useEffect(() => {
    const calculate = async () => {
      if (!product || !product.location) return;

      const result = await calculateTransportCostFromCities({
        fromCity: "Vanadzor",
        toCity: product.location,
        pricePerKm: 0.4,
        baseFee: 0.9,
      });

      setResult(result);
    };

    calculate();
  }, [product]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this product: ${product?.name}`,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Loading product...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {error || "Product not found"}
          </h2>
          <button
            onClick={() => onNavigate("home")}
            className="mt-4 bg-primary-600 text-white px-5 py-3 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => onNavigate("category")}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Media Gallery */}
          <div className="space-y-4">
            {/* View Mode Toggle */}
            <motion.div
              className="flex items-center space-x-2 mb-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => setViewMode("images")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "images"
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Photos</span>
              </button>

              {modelUrl != null ? (
                <button
                  onClick={() => setViewMode("model-viewer")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "model-viewer"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>AR View</span>
                </button>
              ) : (
                <></>
              )}
            </motion.div>

            {/* Main Display */}
            <motion.div
              className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {viewMode === "images" ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {isModelLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </div>
                  )}

                  <model-viewer
                    ref={modelViewerRef}
                    src={modelUrl}
                    alt={product.name}
                    poster={product.images[0]}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    ar-scale="auto"
                    camera-controls
                    touch-action="pan-y"
                    auto-rotate
                    auto-rotate-delay={3000}
                    rotation-per-second="30deg"
                    shadow-intensity="1"
                    shadow-softness="0.5"
                    interaction-prompt="auto"
                    interaction-prompt-style="wiggle"
                    loading="lazy"
                    reveal="auto"
                    onLoad={handleModelLoad}
                    className="w-full h-full"
                    style={{ backgroundColor: "transparent" }}
                  />

                  <button
                    onClick={() => setIsExpanded(true)}
                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>

                  {isARSupported && (
                    <button
                      onClick={handleViewInAR}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Launch AR</span>
                    </button>
                  )}
                </>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            {viewMode === "images" && product.images.length > 1 && (
              <motion.div
                className="grid grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary-600 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.categoryDto.name}
                    </span>
                    {product.categoryDto.parentCategoryName && (
                      <span className="text-sm text-gray-500">
                        in {product.categoryDto.parentCategoryName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() =>
                      onNavigate("create-trade", product.createdByUserId)
                    }
                    className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    onClick={handleLikeToggle}
                    disabled={isLikeLoading}
                    className={`p-3 rounded-full transition-all relative ${
                      isLiked
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    whileHover={{ scale: isLikeLoading ? 1 : 1.1 }}
                    whileTap={{ scale: isLikeLoading ? 1 : 0.9 }}
                  >
                    {isLikeLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : (
                      <Heart
                        className="h-5 w-5"
                        fill={isLiked ? "currentColor" : "none"}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
              <h5>Transportation price: {result?.cost}</h5>
              <h5>Distance: {result?.distanceKm}</h5>

              {/* Location */}
              <div className="flex items-center space-x-2 text-gray-600 mb-6">
                <MapPin className="h-5 w-5" />
                <span>{product.location}</span>
              </div>
            </div>

            {/* AR Features Highlight */}
            {modelUrl != null && (
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Augmented Reality Preview
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  See this {product.name} in your actual space using AR
                  technology. Perfect for checking size and fit!
                </p>
                {getRealWorldScale() && (
                  <div className="bg-white/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">
                      Real-world dimensions:
                    </p>
                    <p className="text-sm text-gray-600">
                      {getRealWorldScale()?.width}m ×{" "}
                      {getRealWorldScale()?.height}m ×{" "}
                      {getRealWorldScale()?.depth}m
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Seller Info */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.userName}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => onNavigate("chat", product.createdByUserId)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Message Seller</span>
              </motion.button>
            </motion.div>

            {/* Description */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>

              {product.attributes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Specifications
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {product.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-600">{attr.name}:</span>
                        <span className="font-medium text-gray-900">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Safety & Guarantees */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Safety & Guarantees
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Buyer Protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Safe Meeting Places</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Return Policy Available</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 3D Model Fullscreen Viewer */}
      {/* <Model3DViewer
        isOpen={show3DViewer}
        onClose={() => setShow3DViewer(false)}
        modelUrl={modelUrl}
        productTitle={product.name}
        fallbackImage={product.images[0]}
      /> */}

      {/* Expanded Model Viewer Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h3 className="text-xl font-semibold text-white">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="h-96 relative">
              <model-viewer
                src={modelUrl}
                alt={product.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                shadow-intensity="1"
                shadow-softness="0.5"
                className="w-full h-full"
              />
              {isARSupported && (
                <button
                  onClick={() => {
                    const modalViewer = document.querySelector(
                      ".fixed model-viewer"
                    ) as any;
                    if (modalViewer) {
                      modalViewer.activateAR();
                    }
                  }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch AR</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AR Viewer */}
      {/* Uncomment if you have ARViewer component */}
      {/* <ARViewer
        isOpen={showARViewer}
        onClose={() => setShowARViewer(false)}
        modelUrl={modelUrl}
        productTitle={product.name}
        productCategory={product.categoryDto.name}
        realWorldScale={getRealWorldScale()}
      /> */}
    </div>
  );
}
