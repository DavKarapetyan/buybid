import React from "react";
import { Filter, Grid, List, Search, Loader } from "lucide-react";
import ProductCard from "../Products/ProductCard";

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
  isLiked?: boolean;
}

// Category interface for the categories sidebar
interface Category {
  id: number;
  name: string;
  parentCategoryId?: number;
  parentCategoryName?: string;
  productCount?: number;
}

interface CategoryBrowseProps {
  selectedCategory?: string;
  searchQuery?: string;
  onNavigate: (page: string, param?: string) => void;
}

export default function CategoryBrowse({
  selectedCategory,
  searchQuery,
  onNavigate,
}: CategoryBrowseProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState("newest");
  const [priceRange, setPriceRange] = React.useState([0, 1000000]); // Adjusted for AMD currency
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    []
  );
  const [showFilters, setShowFilters] = React.useState(false);

  // API data states
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch products and categories from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products
        const productsResponse = await fetch(
          "https://seregamars-001-site9.ntempurl.com/products"
        );
        if (!productsResponse.ok) {
          throw new Error(
            `Failed to fetch products: ${productsResponse.status}`
          );
        }
        const productsData = await productsResponse.json();

        // Process products data
        const processedProducts = productsData.map((product: any) => ({
          ...product,
          isLiked: false,
          images:
            product.images && product.images.length > 0
              ? product.images
              : [
                  "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400",
                ],
          attributes: product.attributes || [],
        }));

        setProducts(processedProducts);

        // Extract unique categories from products
        const uniqueCategories = new Map<number, Category>();

        productsData.forEach((product: any) => {
          if (product.categoryDto) {
            // Add main category
            uniqueCategories.set(product.categoryDto.id, {
              id: product.categoryDto.id,
              name: product.categoryDto.name,
              parentCategoryId: product.categoryDto.parentCategoryId,
              parentCategoryName: product.categoryDto.parentCategoryName,
              productCount: 0,
            });

            // Add parent category if exists
            if (
              product.categoryDto.parentCategoryId &&
              product.categoryDto.parentCategoryName
            ) {
              if (!uniqueCategories.has(product.categoryDto.parentCategoryId)) {
                uniqueCategories.set(product.categoryDto.parentCategoryId, {
                  id: product.categoryDto.parentCategoryId,
                  name: product.categoryDto.parentCategoryName,
                  productCount: 0,
                });
              }
            }
          }
        });

        // Count products per category
        uniqueCategories.forEach((category, categoryId) => {
          const count = productsData.filter(
            (product: any) =>
              product.categoryDto &&
              (product.categoryDto.id === categoryId ||
                product.categoryDto.parentCategoryId === categoryId)
          ).length;
          category.productCount = count;
        });

        setCategories(Array.from(uniqueCategories.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category and search query
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Filter by selected category
    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(
        (product) =>
          product.categoryDto &&
          (product.categoryDto.id === categoryId ||
            product.categoryDto.parentCategoryId === categoryId)
      );
    }

    // Filter by selected categories from sidebar
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.categoryDto &&
          (selectedCategories.includes(product.categoryDto.id) ||
            selectedCategories.includes(
              product.categoryDto.parentCategoryId || 0
            ))
      );
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.categoryDto?.name.toLowerCase().includes(query) ||
          product.attributes.some(
            (attr) =>
              attr.name.toLowerCase().includes(query) ||
              attr.value.toLowerCase().includes(query)
          )
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Since we don't have createdAt, sort by ID (assuming higher ID = newer)
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategory,
    selectedCategories,
    searchQuery,
    priceRange,
    sortBy,
  ]);

  const getCurrentTitle = () => {
    if (searchQuery && searchQuery.trim()) {
      return `Search results for "${searchQuery}"`;
    }
    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      const category = categories.find((c) => c.id === categoryId);
      return category ? category.name : "Browse Products";
    }
    return "Browse Products";
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
    console.log("Message seller:", sellerId);
    // Implement your messaging logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getCurrentTitle()}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h3>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 mb-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex justify-between items-center flex-1">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-400">
                        {category.productCount}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Range (AMD)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                    onToggleLike={handleToggleLike}
                    onMessageSeller={handleMessageSeller}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse different
                  categories
                </p>
                <button
                  onClick={() => onNavigate("home")}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
