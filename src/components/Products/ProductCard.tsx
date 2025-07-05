import React from "react";
import { Heart, MessageCircle, Tag } from "lucide-react";
import { PageType } from "../../types";

// Updated Product interface to match your API response
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
    parentCategoryId: number | null;
    parentCategoryName: string | null;
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

interface ProductCardProps {
  product: Product;
  onNavigate: (page: PageType, productId: string) => void;
  onToggleLike?: (productId: string) => void;
  onMessageSeller?: (sellerId: string) => void;
}

export default function ProductCard({
  product,
  onNavigate,
  onToggleLike,
  onMessageSeller,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get key attributes to display
  const getKeyAttributes = () => {
    return product.attributes.slice(0, 2); // Show first 2 attributes
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {onToggleLike && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(product.id.toString());
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                product.isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
              }`}
            >
              <Heart
                className="h-4 w-4"
                fill={product.isLiked ? "currentColor" : "none"}
              />
            </button>
          )}
        </div>

        <div className="absolute top-3 left-3">
          {product.categoryDto && (
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
              {product.categoryDto.name}
            </span>
          )}
          {product.modelUrl != null && (
            <span className="bg-purple-100 text-purple-800 ml-2 px-2 py-1 rounded-full text-xs font-medium">
              AR
            </span>
          )}
        </div>
        {/* Category Badge */}

        {/* Multiple Images Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              +{product.images.length - 1}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3
            className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={() => onNavigate("product", product.id.toString())}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Attributes */}
        {getKeyAttributes().length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {getKeyAttributes().map((attr, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded"
                >
                  <Tag className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-700">
                    {attr.name}: {attr.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Path */}
        {product.categoryDto && (
          <div className="mb-4">
            <span className="text-xs text-gray-500">
              {product.categoryDto.parentCategoryName ?? "Main"} →{" "}
              {product.categoryDto.name}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onNavigate("product", product.id.toString())}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Details
          </button>
          {onMessageSeller && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMessageSeller(product.createdByUserId);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
