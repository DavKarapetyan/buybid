import React, { useEffect, useState } from "react";
import { AlertCircle, Package } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../Products/ProductCard";
import { PageType } from "../../types";

// Product interface matching your API response
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
  isLiked?: boolean; // Optional for local state management
}

interface FeaturedProductsProps {
  onNavigate: (page: PageType, param?: string) => void;
}

export default function FeaturedProducts({
  onNavigate,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://seregamars-001-site9.ntempurl.com/products"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Add default values for missing properties and take first 8 products
        const processedProducts = data
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle like toggle
  const handleToggleLike = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id.toString() === productId
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    );
  };

  // Handle message seller
  const handleMessageSeller = (sellerId: string) => {
    // You can implement this based on your messaging system
    console.log("Message seller:", sellerId);
    // For example: onNavigate('chat', sellerId);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Loading handpicked deals from our trusted sellers...
              </p>
            </div>
            <div className="mt-6 md:mt-0 bg-gray-200 animate-pulse h-12 w-40 rounded-xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-6">
                  <div className="bg-gray-200 h-6 rounded mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-4"></div>
                  <div className="bg-gray-200 h-8 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Discover handpicked deals from our trusted sellers
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to load products
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Discover handpicked deals from our trusted sellers
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products available
              </h3>
              <p className="text-gray-600">
                Featured products will appear here once they're available.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover handpicked deals from our trusted sellers
            </p>
          </div>
          <motion.button
            onClick={() => onNavigate("category")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              onToggleLike={handleToggleLike}
              onMessageSeller={handleMessageSeller}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
