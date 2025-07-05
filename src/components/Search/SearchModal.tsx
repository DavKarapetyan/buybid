import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, Star, MapPin } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
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
}

interface SearchResult {
  type: "product" | "category" | "suggestion";
  data: Product | string;
  relevance: number;
}

export default function SearchModal({
  isOpen,
  onClose,
  onNavigate,
  onSearch,
  initialQuery = "",
}: SearchModalProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([
    "iPhone",
    "Electronics",
    "Phone",
    "8GB RAM",
  ]);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    if (products.length > 0) return; // Don't fetch if already loaded

    setIsLoadingProducts(true);
    try {
      const response = await fetch(
        "https://seregamars-001-site9.ntempurl.com/products"
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array and has the expected structure
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Expected array of products, got:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoadingProducts(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      fetchProducts();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Don't search if products haven't loaded yet
    if (isLoadingProducts || !Array.isArray(products)) {
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      const searchResults = performSearch(query);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, products, isLoadingProducts]);

  const performSearch = (searchQuery: string): SearchResult[] => {
    // Safety check: ensure products is an array
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    const lowerQuery = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search products
    products.forEach((product) => {
      // Safety checks for product properties
      if (!product || typeof product !== "object") {
        return;
      }

      let relevance = 0;

      // Search in product name
      if (
        product.name &&
        typeof product.name === "string" &&
        product.name.toLowerCase().includes(lowerQuery)
      ) {
        relevance += 15;
      }

      // Search in description
      if (
        product.description &&
        typeof product.description === "string" &&
        product.description.toLowerCase().includes(lowerQuery)
      ) {
        relevance += 8;
      }

      // Search in category (with safety checks)
      if (
        product.categoryDto &&
        product.categoryDto.name &&
        typeof product.categoryDto.name === "string" &&
        product.categoryDto.name.toLowerCase().includes(lowerQuery)
      ) {
        relevance += 12;
      }

      // Search in parent category (with safety checks)
      if (
        product.categoryDto &&
        product.categoryDto.parentCategoryName &&
        typeof product.categoryDto.parentCategoryName === "string" &&
        product.categoryDto.parentCategoryName
          .toLowerCase()
          .includes(lowerQuery)
      ) {
        relevance += 10;
      }

      // Search in attributes (with safety checks)
      if (Array.isArray(product.attributes)) {
        product.attributes.forEach((attr) => {
          if (attr && typeof attr === "object" && attr.name && attr.value) {
            if (
              (typeof attr.name === "string" &&
                attr.name.toLowerCase().includes(lowerQuery)) ||
              (typeof attr.value === "string" &&
                attr.value.toLowerCase().includes(lowerQuery))
            ) {
              relevance += 6;
            }
          }
        });
      }

      // Search by price range
      if (lowerQuery.includes("under") || lowerQuery.includes("below")) {
        const match = lowerQuery.match(/(\d+)/);
        if (match && typeof product.price === "number") {
          const priceLimit = parseInt(match[1]);
          if (product.price < priceLimit * 1000) {
            // Assuming search in thousands
            relevance += 5;
          }
        }
      }

      if (relevance > 0) {
        results.push({
          type: "product",
          data: product,
          relevance,
        });
      }
    });

    // Get unique categories for category suggestions (with safety checks)
    const uniqueCategories = [
      ...new Set(
        products
          .filter((p) => p && p.categoryDto && p.categoryDto.name)
          .map((p) => p.categoryDto.name)
      ),
    ];
    const uniqueParentCategories = [
      ...new Set(
        products
          .filter((p) => p && p.categoryDto && p.categoryDto.parentCategoryName)
          .map((p) => p.categoryDto.parentCategoryName)
      ),
    ];

    // Add category suggestions
    [...uniqueCategories, ...uniqueParentCategories].forEach((categoryName) => {
      if (
        categoryName &&
        typeof categoryName === "string" &&
        categoryName.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: "category",
          data: `Browse ${categoryName}`,
          relevance: 8,
        });
      }
    });

    // Add search suggestions
    const suggestions = [
      `"${searchQuery}" in Electronics`,
      `"${searchQuery}" in Phones`,
      `"${searchQuery}" under 300,000 AMD`,
      `Cheap "${searchQuery}"`,
    ];

    suggestions.forEach((suggestion) => {
      results.push({
        type: "suggestion",
        data: suggestion,
        relevance: 3,
      });
    });

    // Sort by relevance and limit results
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 12);
  };

  const handleProductClick = (product: Product) => {
    addToRecentSearches(query);
    onNavigate("product", product.id.toString());
    onClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    addToRecentSearches(query);
    onNavigate("category", categoryName);
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cleanQuery = suggestion.split('"')[1] || suggestion;
    setQuery(cleanQuery);
    addToRecentSearches(cleanQuery);
    onSearch(cleanQuery);
    onNavigate("category");
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToRecentSearches(query);
      onSearch(query);
      onNavigate("category");
      onClose();
    }
  };

  const addToRecentSearches = (searchQuery: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 5);
    });
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    onSearch(recentQuery);
    onNavigate("category");
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };
  const renderSearchResult = (result: SearchResult, index: number) => {
    switch (result.type) {
      case "product":
        const product = result.data as Product;
        return (
          <motion.button
            key={`product-${product.id}`}
            onClick={() => handleProductClick(product)}
            className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {Array.isArray(product.images) && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name || "Product"}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {product.name || "Unnamed Product"}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(product.price || 0)}
                </span>
                {product.categoryDto && product.categoryDto.name && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.categoryDto.name}
                  </span>
                )}
              </div>
              {Array.isArray(product.attributes) &&
                product.attributes.length > 0 && (
                  <div className="flex items-center space-x-2 mt-1">
                    {product.attributes.slice(0, 2).map((attr, i) =>
                      attr && attr.name && attr.value ? (
                        <span key={i} className="text-xs text-gray-500">
                          {attr.name}: {attr.value}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
            </div>
          </motion.button>
        );

      case "category":
        const categoryName = result.data as string;
        return (
          <motion.button
            key={`category-${index}`}
            onClick={() => handleCategoryClick(categoryName)}
            className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{categoryName}</h4>
              <p className="text-sm text-gray-500">Category</p>
            </div>
          </motion.button>
        );

      case "suggestion":
        const suggestion = result.data as string;
        return (
          <motion.button
            key={`suggestion-${index}`}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-700">{suggestion}</h4>
            </div>
          </motion.button>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Search Modal */}
        <motion.div
          className="relative max-w-2xl mx-auto mt-16 bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Search for products, categories, or specifications..."
                className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:ring-0 focus:outline-none bg-gray-50 rounded-xl"
                disabled={isLoadingProducts}
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isLoadingProducts && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                Loading products...
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : query.trim().length === 0 ? (
              /* Recent Searches */
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((recentQuery, index) => (
                    <motion.button
                      key={recentQuery}
                      onClick={() => handleRecentSearchClick(recentQuery)}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      {recentQuery}
                    </motion.button>
                  ))}
                </div>

                {Array.isArray(products) && products.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      {products.length} products available to search
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ...new Set(
                          products
                            .filter(
                              (p) => p && p.categoryDto && p.categoryDto.name
                            )
                            .map((p) => p.categoryDto.name)
                        ),
                      ]
                        .slice(0, 4)
                        .map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setQuery(category);
                              handleRecentSearchClick(category);
                            }}
                            className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : results.length > 0 ? (
              /* Search Results */
              <div className="divide-y divide-gray-100">
                {results.map((result, index) =>
                  renderSearchResult(result, index)
                )}
              </div>
            ) : (
              /* No Results */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or browse our categories
                </p>
                <button
                  onClick={() => {
                    onNavigate("category");
                    onClose();
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Browse All Products
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {query.trim().length > 0 && results.length > 0 && !isSearching && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSearchSubmit}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search for "{query}"</span>
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
