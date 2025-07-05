export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  businessType?: 'individual' | 'business';
  businessName?: string;
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

export interface AuctionItem extends Product {
  isAuction: true;
  auctionEndTime: string;
  currentBid: number;
  bidCount: number;
  startingBid: number;
  reservePrice?: number;
  bids: Bid[];
}

export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  productCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: User[];
  lastMessage: ChatMessage;
  unreadCount: number;
  productId?: string;
}

export interface BusinessAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalViews: number;
  conversionRate: number;
  averageOrderValue: number;
  topCategories: Array<{ name: string; value: number; percentage: number }>;
  monthlyRevenue: Array<{ 
    month: string; 
    revenue: number; 
    orders: number;
    views?: number;
    conversion?: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'sale' | 'view' | 'message' | 'listing';
    description: string;
    timestamp: string;
    amount?: number;
  }>;
}

export type PageType = 
  | 'home' 
  | 'category' 
  | 'product' 
  | 'auction-detail'
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'chat' 
  | 'about' 
  | 'contact'
  | 'auctions'
  | 'ai-helper'
  | 'business-analytics'
  | 'addProduct'
  | 'featured-products'
  | "liked"
  | "trades"
  | "trade"
  | "create-trade";

export interface DraggedItem {
  id: string;
  type: 'product' | 'cash';
  data: Product | { amoung: number };
}

export interface TradeSlot {
  id: string;
  type: 'offered' | 'requested';
  items: DraggedItem[];
  maxItems: number;
}

export interface AppState {
  currentPage: PageType;
  selectedProduct?: Product;
  selectedCategory?: string;
  selectedAuction?: string;
  selectedTrade?: string;
  selectedToUser?: string;
  user?: User;
  searchQuery: string;
  isAuthenticated: boolean;
}