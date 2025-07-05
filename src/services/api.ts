// API configuration and service functions
const API_BASE_URL = 'https://seregamars-001-site9.ntempurl.com';

export interface ApiUser {
  id: string;
  userName: string;
  email: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
}

export interface ApiProduct {
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
  modelUrl: string | null;
  location: string;
  attributes: Array<{
    name: string;
    value: string;
    dataType: number;
  }>;
  images: string[];
  type: number;
}

export interface ApiTradeResponse {
  id: number;
  fromUser: ApiUser;
  toUser: ApiUser;
  offeredProducts: ApiProduct[];
  requestedProducts: ApiProduct[];
  message: string;
  fromUserCash: number;
  toUserCash: number;
  status: string | null;
  createdAt: string;
  offeredProduct: ApiProduct | null;
  requestedProduct: ApiProduct | null;
  additionalCash: number;
}

export interface CreateTradeRequest {
  fromUserId: string;
  toUserId: string;
  offeredItemId: number;
  requestedItemId: number;
  additionalCash?: number;
  message: string;
  meetingLocation?: string;
  meetingTime?: string;
}

export interface UpdateTradeStatusRequest {
  id: number;
  status: 'Accepted' | 'Declined';
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
   
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
     
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async getTrade(tradeId: string, userId: string): Promise<ApiTradeResponse> {
    return this.request<ApiTradeResponse>(`/trade/${tradeId}?userId=${userId}`);
  }

  async getUserTrades(
    userId: string,
    sentOffers: boolean = false
  ): Promise<ApiTradeResponse[]> {
    const endpoint = `/trade?userId=${userId}&sentOffers=${sentOffers}`;
    return this.request<ApiTradeResponse[]>(endpoint);
  }

  async createTrade(request: CreateTradeRequest): Promise<ApiTradeResponse> {
    return this.request<ApiTradeResponse>('/trade', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateTradeStatus(request: UpdateTradeStatusRequest): Promise<ApiTradeResponse> {
    return this.request<ApiTradeResponse>(`/trade`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }
}

export const apiService111 = new ApiService();

// Helper function to convert API response to internal format
export const convertApiTradeToInternal = (apiTrade: ApiTradeResponse) => {
  // Handle cases where offeredProduct or requestedProduct might be null
  const offeredProduct = apiTrade.offeredProduct || (apiTrade.offeredProducts.length > 0 ? apiTrade.offeredProducts[0] : null);
  const requestedProduct = apiTrade.requestedProduct || (apiTrade.requestedProducts.length > 0 ? apiTrade.requestedProducts[0] : null);

  // Create a placeholder product if none exists
  const createPlaceholderProduct = (name: string, price: number = 0) => ({
    id: 0,
    name,
    description: 'No description available',
    price,
    categoryId: 0,
    categoryDto: {
      id: 0,
      name: 'Unknown',
      parentCategoryId: 0,
      parentCategoryName: 'Unknown'
    },
    createdByUserId: '',
    modelUrl: null,
    location: 'Unknown',
    attributes: [],
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'],
    type: 0
  });

  const finalOfferedProduct = offeredProduct || createPlaceholderProduct('Cash Offer', apiTrade.fromUserCash);
  const finalRequestedProduct = requestedProduct || createPlaceholderProduct('Cash Request', apiTrade.toUserCash);

  return {
    id: apiTrade.id.toString(),
    fromUser: {
      id: apiTrade.fromUser.id,
      name: apiTrade.fromUser.userName,
      avatar: `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150`,
      rating: apiTrade.fromUser.rating,
      reviewCount: apiTrade.fromUser.reviewCount,
      isVerified: true,
      joinedDate: '2022-01-01',
      location: finalOfferedProduct.location || 'Unknown'
    },
    toUser: {
      id: apiTrade.toUser.id,
      name: apiTrade.toUser.userName,
      avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150`,
      rating: apiTrade.toUser.rating,
      reviewCount: apiTrade.toUser.reviewCount,
      isVerified: true,
      joinedDate: '2022-01-01',
      location: finalRequestedProduct.location || 'Unknown'
    },
    offeredItem: {
      id: finalOfferedProduct.id.toString(),
      title: finalOfferedProduct.name,
      price: finalOfferedProduct.price,
      condition: 'good' as const,
      location: finalOfferedProduct.location,
      images: finalOfferedProduct.images.length > 0
        ? finalOfferedProduct.images
        : ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: finalOfferedProduct.description,
      category: finalOfferedProduct.categoryDto.name,
      seller: {
        id: apiTrade.fromUser.id,
        name: apiTrade.fromUser.userName,
        avatar: `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150`,
        rating: apiTrade.fromUser.rating,
        reviewCount: apiTrade.fromUser.reviewCount,
        isVerified: true,
        joinedDate: '2022-01-01',
        location: finalOfferedProduct.location
      },
      views: 0,
      tags: [],
      postedDate: apiTrade.createdAt
    },
    requestedItem: {
      id: finalRequestedProduct.id.toString(),
      title: finalRequestedProduct.name,
      price: finalRequestedProduct.price,
      condition: 'good' as const,
      location: finalRequestedProduct.location,
      images: finalRequestedProduct.images.length > 0
        ? finalRequestedProduct.images
        : ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: finalRequestedProduct.description,
      category: finalRequestedProduct.categoryDto.name,
      seller: {
        id: apiTrade.toUser.id,
        name: apiTrade.toUser.userName,
        avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150`,
        rating: apiTrade.toUser.rating,
        reviewCount: apiTrade.toUser.reviewCount,
        isVerified: true,
        joinedDate: '2022-01-01',
        location: finalRequestedProduct.location
      },
      views: 0,
      tags: [],
      postedDate: apiTrade.createdAt
    },
    additionalCash: apiTrade.additionalCash || apiTrade.fromUserCash || 0,
    message: apiTrade.message,
    status: apiTrade.status ? apiTrade.status.toLowerCase() as 'pending' | 'accepted' | 'declined' | 'completed' : 'pending',
    createdAt: apiTrade.createdAt,
    updatedAt: apiTrade.createdAt,
    meetingLocation: undefined,
    meetingTime: undefined
  };
};