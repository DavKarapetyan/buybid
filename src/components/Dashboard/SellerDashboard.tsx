import React from 'react';
import { Plus, Edit, Trash2, Eye, Heart, MessageCircle, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { mockProducts, mockUsers } from '../../data/mockData';
import { PageType } from '../../types';

interface SellerDashboardProps {
  onNavigate: (page: PageType) => void;
}

export default function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Mock seller data
  const sellerProducts = mockProducts.slice(0, 3);
  const sellerStats = {
    totalProducts: 12,
    totalViews: 1847,
    totalLikes: 142,
    totalMessages: 34,
    totalEarnings: 4250,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seller Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your listings and track your performance
            </p>
          </div>
          <button 
            onClick={() => onNavigate('add-product')}
            className="mt-4 lg:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.totalLikes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{sellerStats.totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(sellerStats.totalEarnings)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'products', name: 'My Products', icon: Package },
                { id: 'messages', name: 'Messages', icon: MessageCircle },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Eye className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New views on iPhone 15 Pro</p>
                        <p className="text-sm text-gray-500">23 new views in the last 24 hours</p>
                      </div>
                      <span className="text-sm text-gray-400">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New message about MacBook Air</p>
                        <p className="text-sm text-gray-500">Buyer asking about condition</p>
                      </div>
                      <span className="text-sm text-gray-400">5 hours ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Someone liked your Nike Air Jordan</p>
                        <p className="text-sm text-gray-500">Your listing is getting attention</p>
                      </div>
                      <span className="text-sm text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Your Products</h3>
                  <button 
                    onClick={() => onNavigate('add-product')}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sellerProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-xl overflow-hidden">
                      <div className="aspect-square">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h4>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          {formatPrice(product.price)}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{product.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{product.likes}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
                  <button
                    onClick={() => onNavigate('chat')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All Messages
                  </button>
                </div>

                <div className="space-y-4">
                  {mockUsers.slice(1, 3).map((user, index) => (
                    <div key={user.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <span className="text-sm text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {index === 0 
                            ? "Hi, is the MacBook still available? I'm interested in purchasing it."
                            : "Thank you for the quick response! When can we arrange the pickup?"
                          }
                        </p>
                      </div>
                      <div className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}