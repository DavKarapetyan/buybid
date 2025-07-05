import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageType } from "../../types";
import * as Icons from "lucide-react";

interface Category {
  id: number;
  name: string;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
}

interface FeaturedCategoriesProps {
  onNavigate: (page: PageType, category?: string) => void;
}

// Default icon mapping for categories
const categoryIcons: { [key: string]: keyof typeof Icons } = {
  Electronics: "Smartphone",
  Phones: "Phone",
  Laptops: "Laptop",
  Computers: "Monitor",
  Accessories: "Headphones",
  Gaming: "Gamepad2",
  Audio: "Speaker",
  Cameras: "Camera",
  Tablets: "Tablet",
  Wearables: "Watch",
  Home: "Home",
  Sports: "Trophy",
  Fashion: "Shirt",
  Books: "Book",
  Health: "Heart",
  Beauty: "Sparkles",
  Vehicles: "CarFront",
  "Real Estate": "Home",
};

// Generate a random product count for display purposes
const getRandomProductCount = () => Math.floor(Math.random() * 1000) + 50;

export default function FeaturedCategories({
  onNavigate,
}: FeaturedCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://seregamars-001-site9.ntempurl.com/categories"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Filter to show only parent categories (top-level categories)
  const parentCategories = categories.filter(
    (category) => category.parentCategoryId === null
  );

  // If you want to show all categories including subcategories, use this instead:
  // const displayCategories = categories;

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="text-center">
                  <div className="bg-gray-200 rounded-xl w-16 h-16 mx-auto mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4 mx-auto"></div>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-primary-200 rounded-xl p-8 max-w-md mx-auto">
              <Icons.AlertCircle className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Failed to load categories
              </h3>
              <p className="text-primary-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
              <Icons.Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600">
                Categories will appear here once they're available.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're
            looking for
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {parentCategories.map((category) => {
            // Get icon for category, fallback to Package if not found
            const iconName = categoryIcons[category.name] || "Package";
            const IconComponent = Icons[iconName] as React.ComponentType<any>;

            // Count subcategories for this parent category
            const subcategoryCount = categories.filter(
              (cat) => cat.parentCategoryId === category.id
            ).length;
            const displayCount =
              subcategoryCount > 0 ? subcategoryCount : getRandomProductCount();
            const displayText =
              subcategoryCount > 0 ? "subcategories" : "items";

            return (
              <motion.button
                key={category.id}
                onClick={() => onNavigate("category", category.id.toString())}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <motion.div
                    className="bg-primary-50 group-hover:bg-primary-100 rounded-xl p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-colors"
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {displayCount.toLocaleString()} {displayText}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={() => onNavigate("category")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Categories
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
