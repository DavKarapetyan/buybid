import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  MessageCircle,
  Plus,
  Menu,
  Heart,
  ShoppingBag,
  Sparkles,
  Gavel,
  BarChart3,
  X,
  Home,
  Package,
  Users,
  Bell,
  ArrowRightLeft,
} from "lucide-react";
import { AppState, PageType } from "../../types";
import { useAuth } from "../Auth/AuthContext";
import SearchModal from "../Search/SearchModal";

interface HeaderProps {
  appState: AppState;
  onNavigate: (page: PageType, param?: string) => void;
  onSearch: (query: string) => void;
}

export default function Header({
  appState,
  onNavigate,
  onSearch,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(appState.searchQuery);
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate("category");
  };

  const handleSearchModalOpen = () => {
    setShowSearchModal(true);
  };

  const handleSearchModalClose = () => {
    setShowSearchModal(false);
  };

  const handleMenuItemClick = (page: PageType) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <motion.button
                onClick={() => onNavigate("home")}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="https://buybidbucket.s3.eu-north-1.amazonaws.com/BuyBid+logo+png.png"
                  className="w-10"
                />
                <span className="text-xl font-bold hidden sm:block">
                  Buy Bid
                </span>
                <span className="text-xl font-bold sm:hidden">BB</span>
              </motion.button>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <button
                onClick={handleSearchModalOpen}
                className="w-full flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors text-left"
              >
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-500">
                  Search products, categories...
                </span>
              </button>
            </div>

            {/* Mobile Top Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              <motion.button
                onClick={handleSearchModalOpen}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="h-6 w-6" />
              </motion.button>

              {appState.isAuthenticated && (
                <motion.button
                  className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="h-6 w-6" />
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    3
                  </motion.span>
                </motion.button>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              <motion.button
                onClick={() => onNavigate("category")}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse
              </motion.button>

              <motion.button
                onClick={() => onNavigate("auctions")}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gavel className="h-4 w-4" />
                <span>Auctions</span>
              </motion.button>

              <motion.button
                onClick={() => onNavigate("ai-helper")}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Helper</span>
              </motion.button>

              {appState.isAuthenticated ? (
                <>
                  <motion.button
                    onClick={() => onNavigate("trades")}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Trades</span>
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate("addProduct")}
                    className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Sell</span>
                  </motion.button>

                  {user?.role === "Admin" && (
                    <motion.button
                      onClick={() => onNavigate("business-analytics")}
                      className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BarChart3 className="h-5 w-5" />
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => onNavigate("chat")}
                    className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </motion.button>

                  <motion.button
                    onClick={() => onNavigate("liked")}
                    className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>

                  <motion.button
                    onClick={() => onNavigate("dashboard")}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2"
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => onNavigate("login")}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate("register")}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        {/* Bottom Navigation Bar */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg rounded-lg m-2 py-1"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
            {/* Home */}
            <motion.button
              onClick={() => onNavigate("home")}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                appState.currentPage === "home"
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="h-6 w-6" />
              {/* <span className="text-xs font-medium">Home</span> */}
            </motion.button>

            {/* Browse */}
            <motion.button
              onClick={() => onNavigate("category")}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                appState.currentPage === "category"
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="h-6 w-6" />
              {/* <span className="text-xs font-medium">Browse</span> */}
            </motion.button>

            {/* Auctions */}
            <motion.button
              onClick={() => onNavigate("auctions")}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                appState.currentPage === "auctions"
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gavel className="h-6 w-6" />
              {/* <span className="text-xs font-medium">Auctions</span> */}
            </motion.button>

            {/* AI Helper */}
            <motion.button
              onClick={() => onNavigate("ai-helper")}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                appState.currentPage === "ai-helper"
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-6 w-6" />
              {/* <span className="text-xs font-medium">AI</span> */}
            </motion.button>

            {/* Messages (if authenticated) */}
            {appState.isAuthenticated && (
              <motion.button
                onClick={() => onNavigate("chat")}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors relative ${
                  appState.currentPage === "chat"
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-primary-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="h-6 w-6" />
                {/* <span className="text-xs font-medium">Chat</span> */}
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  3
                </motion.span>
              </motion.button>
            )}

            {/* Profile/More */}
            <motion.button
              onClick={() => {
                if (appState.isAuthenticated) {
                  onNavigate("dashboard");
                } else {
                  setIsMenuOpen(true);
                }
              }}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                appState.currentPage === "dashboard" ||
                appState.currentPage === "profile"
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {appState.isAuthenticated ? (
                <>
                  <img
                    src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2"
                    alt="Profile"
                    className="h-6 w-6 rounded-full"
                  />
                  {/* <span className="text-xs font-medium">Profile</span> */}
                </>
              ) : (
                <>
                  <Menu className="h-6 w-6" />
                  {/* <span className="text-xs font-medium">More</span> */}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Action Button for Sell (if authenticated) */}
        {appState.isAuthenticated && (
          <motion.button
            onClick={() => onNavigate("addProduct")}
            className="fixed bottom-20 right-4 z-50 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        )}

        {/* Mobile Menu Modal (for non-authenticated users) */}
        <AnimatePresence>
          {isMenuOpen && !appState.isAuthenticated && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Modal */}
              <motion.div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50 max-h-[70vh] overflow-y-auto"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Account
                    </h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <motion.button
                      onClick={() => handleMenuItemClick("login")}
                      className="w-full flex items-center justify-center px-4 py-3 text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.button>

                    <motion.button
                      onClick={() => handleMenuItemClick("register")}
                      className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.button>
                  </div>

                  {/* Additional Options */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-1">
                      <motion.button
                        onClick={() => handleMenuItemClick("about")}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Users className="h-5 w-5" />
                        <span className="font-medium">About</span>
                      </motion.button>

                      <motion.button
                        onClick={() => handleMenuItemClick("contact")}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">Contact</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={handleSearchModalClose}
        onNavigate={onNavigate}
        onSearch={onSearch}
        initialQuery={searchQuery}
      />
    </>
  );
}
