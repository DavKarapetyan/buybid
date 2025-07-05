import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, DollarSign, Package, Users, Eye, MessageCircle, ShoppingCart, Target, ArrowUp, ArrowDown, Activity, Zap, Star, Award, Calendar, Filter } from 'lucide-react';
import { PageType, BusinessAnalytics } from '../../types';

interface BusinessAnalyticsProps {
  onNavigate: (page: PageType) => void;
}

export default function BusinessAnalyticsPage({ onNavigate }: BusinessAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState('30d');
  const [hoveredMetric, setHoveredMetric] = React.useState<number | null>(null);
  const [selectedChart, setSelectedChart] = React.useState('revenue');

  // Enhanced analytics data with more metrics
  const analyticsData: BusinessAnalytics = {
    totalRevenue: 45250,
    totalOrders: 234,
    totalProducts: 45,
    totalViews: 12450,
    conversionRate: 3.2,
    averageOrderValue: 193.38,
    topCategories: [
      { name: 'Electronics', value: 15420, percentage: 34 },
      { name: 'Fashion', value: 12300, percentage: 27 },
      { name: 'Home & Garden', value: 8950, percentage: 20 },
      { name: 'Sports', value: 5680, percentage: 13 },
      { name: 'Others', value: 2900, percentage: 6 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 3200, orders: 18, views: 890, conversion: 2.8 },
      { month: 'Feb', revenue: 3800, orders: 22, views: 1120, conversion: 3.1 },
      { month: 'Mar', revenue: 4200, orders: 25, views: 1340, conversion: 3.4 },
      { month: 'Apr', revenue: 3900, orders: 21, views: 1180, conversion: 2.9 },
      { month: 'May', revenue: 4800, orders: 28, views: 1560, conversion: 3.6 },
      { month: 'Jun', revenue: 5200, orders: 32, views: 1780, conversion: 3.8 },
      { month: 'Jul', revenue: 4600, orders: 26, views: 1420, conversion: 3.2 },
      { month: 'Aug', revenue: 5800, orders: 35, views: 1890, conversion: 4.1 },
      { month: 'Sep', revenue: 6200, orders: 38, views: 2100, conversion: 4.3 },
      { month: 'Oct', revenue: 5900, orders: 34, views: 1950, conversion: 3.9 },
      { month: 'Nov', revenue: 6800, orders: 42, views: 2340, conversion: 4.5 },
      { month: 'Dec', revenue: 7200, orders: 45, views: 2580, conversion: 4.7 },
    ],
    recentActivity: [
      { id: '1', type: 'sale', description: 'iPhone 15 Pro sold', timestamp: '2 hours ago', amount: 899 },
      { id: '2', type: 'message', description: 'New message about MacBook', timestamp: '4 hours ago' },
      { id: '3', type: 'view', description: '23 new views on Nike shoes', timestamp: '6 hours ago' },
      { id: '4', type: 'listing', description: 'New product listed: Camera', timestamp: '1 day ago' },
      { id: '5', type: 'sale', description: 'Vintage watch sold', timestamp: '1 day ago', amount: 450 },
    ],
  };

  // Enhanced metrics with more detailed data
  const keyMetrics = [
    {
      title: "Total Revenue",
      value: analyticsData.totalRevenue,
      change: 12.5,
      trend: "up",
      icon: DollarSign,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      format: "currency",
      description: "Monthly recurring revenue"
    },
    {
      title: "Total Orders",
      value: analyticsData.totalOrders,
      change: 8.3,
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      format: "number",
      description: "Completed transactions"
    },
    {
      title: "Active Products",
      value: analyticsData.totalProducts,
      change: 15.7,
      trend: "up",
      icon: Package,
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      format: "number",
      description: "Live product listings"
    },
    {
      title: "Total Views",
      value: analyticsData.totalViews,
      change: 23.1,
      trend: "up",
      icon: Eye,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      format: "number",
      description: "Product page visits"
    },
    {
      title: "Conversion Rate",
      value: analyticsData.conversionRate,
      change: 5.2,
      trend: "up",
      icon: Target,
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      format: "percentage",
      description: "Views to sales ratio"
    },
    {
      title: "Avg Order Value",
      value: analyticsData.averageOrderValue,
      change: -2.1,
      trend: "down",
      icon: TrendingUp,
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      format: "currency",
      description: "Average transaction size"
    }
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'view':
        return <Eye className="h-4 w-4 text-purple-600" />;
      case 'listing':
        return <Package className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Business Analytics
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive insights into your marketplace performance and growth metrics
              </p>
            </div>
            
            {/* Period Selector */}
            <div className="mt-6 lg:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                {['7d', '30d', '90d', '1y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Key Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              className={`relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer overflow-hidden group ${
                hoveredMetric === index ? 'shadow-xl' : ''
              }`}
              onMouseEnter={() => setHoveredMetric(index)}
              onMouseLeave={() => setHoveredMetric(null)}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.bgColor} p-3 rounded-xl`}>
                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {formatValue(metric.value, metric.format)}
                  </motion.p>
                </div>
                
                <p className="text-xs text-gray-500">{metric.description}</p>

                {/* Progress Bar */}
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(metric.change * 2, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend Chart */}
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="orders">Orders</option>
                  <option value="views">Views</option>
                  <option value="conversion">Conversion</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => [formatValue(value as number, selectedChart === 'revenue' ? 'currency' : selectedChart === 'conversion' ? 'percentage' : 'number'), selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)]} 
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedChart} 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Sales by Category</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatValue(value as number, 'currency'), 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Performance Overview */}
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={analyticsData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Performance Metrics */}
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
            <div className="space-y-6">
              {[
                { label: "Customer Satisfaction", value: 4.8, max: 5, icon: Star, color: "bg-yellow-500" },
                { label: "Response Time", value: 85, max: 100, icon: Zap, color: "bg-blue-500" },
                { label: "Quality Score", value: 92, max: 100, icon: Award, color: "bg-green-500" },
                { label: "Seller Rating", value: 4.6, max: 5, icon: Users, color: "bg-purple-500" }
              ].map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${kpi.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                      <kpi.icon className={`h-5 w-5 ${kpi.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{kpi.label}</p>
                      <p className="text-sm text-gray-500">
                        {kpi.max === 5 ? `${kpi.value}/5.0` : `${kpi.value}%`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${kpi.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(kpi.value / kpi.max) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {kpi.max === 5 ? kpi.value : `${kpi.value}%`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Recent Activity */}
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  {activity.amount && (
                    <div className="text-sm font-bold text-green-600">
                      {formatValue(activity.amount, 'currency')}
                    </div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUp className="h-4 w-4 text-gray-400 rotate-45" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Action Buttons */}
        <motion.div 
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.button
            onClick={() => onNavigate('dashboard')}
            className="group relative bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            />
            <div className="relative flex items-center justify-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Go to Dashboard</span>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate('category')}
            className="group relative bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Package className="h-5 w-5" />
              <span>View Products</span>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate('add-product')}
            className="group relative bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            />
            <div className="relative flex items-center justify-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Add Product</span>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}