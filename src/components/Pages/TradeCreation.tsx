import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  DollarSign,
  Search,
  Filter,
  Star,
  CheckCircle,
  AlertCircle,
  Send,
  Shuffle,
  Target,
  Zap,
} from "lucide-react";
import { PageType, DraggedItem, TradeSlot } from "../../types";
import { useAuth } from "../Auth/AuthContext";

interface TradeCreationProps {
  onNavigate: (page: PageType, data?: any) => void;
  toUserId: string;
}

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

export default function TradeCreation({
  onNavigate,
  toUserId,
}: TradeCreationProps) {
  const [step, setStep] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [draggedItem, setDraggedItem] = React.useState<DraggedItem | null>(
    null
  );
  const [tradeSlots, setTradeSlots] = React.useState<TradeSlot[]>([
    { id: "offered", type: "offered", items: [], maxItems: 3 },
    {
      id: "requested",
      type: "requested",
      items: [],
      maxItems: 3,
    },
  ]);
  const { user } = useAuth();
  const [cashAmount, setCashAmount] = React.useState(0);
  const [message, setMessage] = React.useState("");
  const [isDragOver, setIsDragOver] = React.useState<string | null>(null);

  const fromUserId = user?.id;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "like-new":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    item: Product | { amount: number },
    type: "product" | "cash"
  ) => {
    const draggedData: DraggedItem = {
      id: type === "product" ? (item as Product).id : "cash",
      type,
      data: item,
    };
    setDraggedItem(draggedData);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(slotId);
  };

  const handleDragLeave = () => {
    setIsDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setIsDragOver(null);

    if (!draggedItem) return;

    const slot = tradeSlots.find((s) => s.id === slotId);
    if (!slot || slot.items.length >= slot.maxItems) return;

    // For products, check if already exists
    if (draggedItem.type === "product") {
      const itemExists = slot.items.some(
        (item) => String(item.id) === String(draggedItem.id)
      );
      if (itemExists) return;
    }

    // For cash, remove existing cash from target slot first
    let updatedSlots = tradeSlots.map((s) => ({
      ...s,
      items: s.items.filter((item) =>
        // Remove the dragged item from other slots (for products) or same type cash from target slot
        draggedItem.type === "product"
          ? String(item.id) !== String(draggedItem.id)
          : s.id === slotId && item.type === "cash"
          ? false
          : true
      ),
    }));

    // Add item to target slot
    const targetSlot = updatedSlots.find((s) => s.id === slotId);
    if (targetSlot && targetSlot.items.length < targetSlot.maxItems) {
      targetSlot.items.push(draggedItem);
    }

    setTradeSlots(updatedSlots);
    setDraggedItem(null);
  };

  const removeFromSlot = (slotId: string, itemId: string | number) => {
    setTradeSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              items: slot.items.filter(
                (item) => String(item.id) !== String(itemId)
              ),
            }
          : slot
      )
    );
  };

  // Update the cash addition function to handle unique cash items properly
  const addCashToSlot = (slotId: string) => {
    if (cashAmount <= 0 || isNaN(cashAmount)) return;

    const cashItem: DraggedItem = {
      id: `cash-${slotId}-${Date.now()}`,
      type: "cash",
      data: { amount: Number(cashAmount) }, // Ensure it's a number
    };

    setTradeSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const withoutCash = slot.items.filter((item) => item.type !== "cash");

          if (withoutCash.length >= slot.maxItems) {
            return slot;
          }

          return { ...slot, items: [...withoutCash, cashItem] };
        }
        return slot;
      })
    );
    setCashAmount(0);
  };

  const calculateTradeValue = (slotId: string) => {
    const slot = tradeSlots.find((s) => s.id === slotId);
    if (!slot) return 0;

    return slot.items.reduce((total: number, item) => {
      if (item.type === "product") {
        return total + (item.data as Product).price;
      } else {
        return total + (item.data as { amount: number }).amount;
      }
    }, 0);
  };

  const getTradeBalance = () => {
    const offeredValue = calculateTradeValue("offered");
    const requestedValue = calculateTradeValue("requested");
    return offeredValue - requestedValue;
  };

  const canProceed = () => {
    const offeredSlot = tradeSlots.find((s) => s.id === "offered");
    const requestedSlot = tradeSlots.find((s) => s.id === "requested");
    return offeredSlot?.items.length > 0 && requestedSlot?.items.length > 0;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      product.categoryDto.name.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.categoryDto.name))),
  ];

  const handleSendTradeOffer = async () => {
    const offeredItems =
      tradeSlots.find((s) => s.id === "offered")?.items || [];
    const requestedItems =
      tradeSlots.find((s) => s.id === "requested")?.items || [];

    const offeredProductIds = offeredItems
      .filter((item) => item.type === "product")
      .map((item) => (item.data as Product).id);
    const requestedProductIds = requestedItems
      .filter((item) => item.type === "product")
      .map((item) => (item.data as Product).id);

    const fromUserCashItem = offeredItems.find((item) => item.type === "cash");
    const toUserCashItem = requestedItems.find((item) => item.type === "cash");

    const fromUserCash = fromUserCashItem
      ? (fromUserCashItem.data as { amount: number }).amount
      : 0;
    const toUserCash = toUserCashItem
      ? (toUserCashItem.data as { amount: number }).amount
      : 0;

    try {
      const response = await fetch("https://localhost:7207/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          createTradeOfferDto: {
            fromUserId,
            toUserId,
            offeredProductIds,
            requestedProductIds,
            message,
            fromUserCash,
            toUserCash,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = null;
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
        console.log("Trade offer sent:", data);
      } else {
        console.log("Trade offer sent: No content returned.");
      }

      alert("Trade offer sent successfully!");
      onNavigate("trades");
    } catch (error) {
      console.error("Failed to send trade offer:", error);
      //alert("Failed to send trade offer.");
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.div
          className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Shuffle className="h-10 w-10 text-blue-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Create Your Trade
        </h2>
        <p className="text-gray-600 text-lg">
          Drag and drop items to create the perfect trade offer
        </p>
      </div>

      {/* Trade Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Offered Items */}
        <motion.div
          className={`bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border-2 border-dashed transition-all ${
            isDragOver === "offered"
              ? "border-blue-500 bg-blue-100"
              : "border-blue-300"
          }`}
          onDragOver={(e) => handleDragOver(e, "offered")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "offered")}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900">You're Offering</h3>
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {formatPrice(calculateTradeValue("offered"))}
            </span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            <AnimatePresence>
              {tradeSlots
                .find((s) => s.id === "offered")
                ?.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex items-center justify-between"
                  >
                    {item.type === "product" ? (
                      <div className="flex items-center space-x-3">
                        <img
                          src={(item.data as Product).images[0]}
                          alt={(item.data as Product).name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 line-clamp-1">
                            {(item.data as Product).name}
                          </h4>
                          <p className="text-blue-600 font-semibold">
                            {formatPrice((item.data as Product).price)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Cash</h4>
                          <p className="text-green-600 font-semibold">
                            {formatPrice(
                              (item.data as { amount: number }).amount
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromSlot("offered", item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
            </AnimatePresence>

            {tradeSlots.find((s) => s.id === "offered")?.items.length === 0 && (
              <div className="flex items-center justify-center h-32 text-blue-600">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Drag items here</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Requested Items */}
        <motion.div
          className={`bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border-2 border-dashed transition-all ${
            isDragOver === "requested"
              ? "border-green-500 bg-green-100"
              : "border-green-300"
          }`}
          onDragOver={(e) => handleDragOver(e, "requested")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "requested")}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-900">You Want</h3>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {formatPrice(calculateTradeValue("requested"))}
            </span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            <AnimatePresence>
              {tradeSlots
                .find((s) => s.id === "requested")
                ?.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-green-200 flex items-center justify-between"
                  >
                    {item.type === "product" ? (
                      <div className="flex items-center space-x-3">
                        <img
                          src={(item.data as Product).images[0]}
                          alt={(item.data as Product).name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-1">
                            {(item.data as Product).name}
                          </h4>
                          <p className="text-blue-600 font-semibold">
                            {formatPrice((item.data as Product).price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(item.data as Product).categoryDto.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Cash</h4>
                          <p className="text-green-600 font-semibold">
                            {formatPrice(
                              (item.data as { amount: number }).amount
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromSlot("requested", item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
            </AnimatePresence>

            {tradeSlots.find((s) => s.id === "requested")?.items.length ===
              0 && (
              <div className="flex items-center justify-center h-32 text-green-600">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Drag items here</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Trade Balance */}
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Trade Balance
            </h3>
            <p className="text-gray-600">Difference in trade values</p>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${
                getTradeBalance() > 0
                  ? "text-green-600"
                  : getTradeBalance() < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {getTradeBalance() > 0 ? "+" : ""}
              {formatPrice(Math.abs(getTradeBalance()))}
            </div>
            <p className="text-sm text-gray-500">
              {getTradeBalance() > 0
                ? "You receive extra"
                : getTradeBalance() < 0
                ? "You pay extra"
                : "Even trade"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cash Addition */}
      {/* Cash Addition - Updated version */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add Cash to Trade
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="number"
              value={cashAmount || ""} // Handle empty state better
              onChange={(e) => {
                const value = e.target.value;
                setCashAmount(value === "" ? 0 : Number(value));
              }}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => addCashToSlot("offered")}
            disabled={cashAmount <= 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Add to Offer
          </button>
          <button
            onClick={() => addCashToSlot("requested")}
            disabled={cashAmount <= 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Request Cash
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            💡 <strong>Tip:</strong> Adding cash can help balance trades and
            make offers more attractive.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.div
          className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Send className="h-10 w-10 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Review & Send Trade
        </h2>
        <p className="text-gray-600 text-lg">
          Add a personal message and send your trade offer
        </p>
      </div>

      {/* Trade Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Trade Summary</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Offer */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-3">
              You're Offering
            </h4>
            <div className="space-y-2">
              {tradeSlots
                .find((s) => s.id === "offered")
                ?.items.map((item, index) => (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      {item.type === "product"
                        ? (item.data as Product).name
                        : "Cash"}
                    </span>
                    <span className="font-medium text-blue-600">
                      {item.type === "product"
                        ? formatPrice((item.data as Product).price)
                        : formatPrice((item.data as { amount: number }).amount)}
                    </span>
                  </div>
                ))}
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">
                    {formatPrice(calculateTradeValue("offered"))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Arrow */}
          <div className="flex items-center justify-center">
            <motion.div
              className="bg-gray-100 p-4 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ArrowRight className="h-8 w-8 text-gray-600" />
            </motion.div>
          </div>

          {/* Their Items */}
          <div className="bg-green-50 p-4 rounded-xl">
            <h4 className="font-semibold text-green-900 mb-3">You Want</h4>
            <div className="space-y-2">
              {tradeSlots
                .find((s) => s.id === "requested")
                ?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      {item.type === "product"
                        ? (item.data as Product).name
                        : "Cash"}
                    </span>
                    <span className="font-medium text-green-600">
                      {item.type === "product"
                        ? formatPrice((item.data as Product).price)
                        : formatPrice((item.data as { amount: number }).amount)}
                    </span>
                  </div>
                ))}
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">
                    {formatPrice(calculateTradeValue("requested"))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Message
        </h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message to explain your trade offer..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">
          A friendly message increases your chances of acceptance!
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate("trades")}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Trades</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Trade Offer
            </h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                step === 1
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="font-medium">1. Build Trade</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                step === 2
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="font-medium">2. Review & Send</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <AnimatePresence mode="wait">
              {step === 1 ? renderStep1() : renderStep2()}
            </AnimatePresence>

            {/* Navigation */}
            <motion.div
              className="flex items-center justify-between mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() =>
                  step > 1 ? setStep(step - 1) : onNavigate("trades")
                }
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{step > 1 ? "Previous" : "Cancel"}</span>
              </button>

              {step === 1 ? (
                <motion.button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => {
                    // Create trade offer
                    handleSendTradeOffer();
                  }}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="h-4 w-4" />
                  <span>Send Trade Offer</span>
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Available Items */}
          {step === 1 && (
            <motion.div
              className="xl:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Items
                </h3>

                {/* Search and Filter */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Your Items */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Your Items</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {products
                      .filter((p) => p.createdByUserId == fromUserId)
                      .map((product) => (
                        <motion.div
                          key={product.id}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, product, "product")
                          }
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm line-clamp-1">
                              {product.name}
                            </h5>
                            <p className="text-blue-600 font-semibold text-sm">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* Available Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Marketplace Items
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredProducts
                      .filter((p) => p.createdByUserId == toUserId)
                      .map((product) => (
                        <motion.div
                          key={product.id}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, product, "product")
                          }
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm line-clamp-1">
                              {product.name}
                            </h5>
                            <div className="flex items-center justify-between">
                              <p className="text-green-600 font-semibold text-sm">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
