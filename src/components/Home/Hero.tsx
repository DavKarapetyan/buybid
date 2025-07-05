import React from "react";
import {
  TrendingUp,
  Shield,
  Users,
  Sparkles,
  Gavel,
  Zap,
  Star,
  ArrowRight,
  Play,
  ShoppingBag,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageType } from "../../types";

interface HeroProps {
  onNavigate: (page: PageType) => void;
  onSearch: (query: string) => void;
}

export default function Hero({ onNavigate, onSearch }: HeroProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStartShopping = () => {
    onNavigate("category");
  };

  const handleLiveAuctions = () => {
    onNavigate("auctions");
  };

  const handleAIHelper = () => {
    onNavigate("ai-helper");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Best Deals",
      description: "Find amazing prices and exclusive offers",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Shield,
      title: "Secure Trading",
      description: "Safe transactions with buyer protection",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join millions of satisfied users",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const stats = [
    { number: "2M+", label: "Active Users", icon: Users },
    { number: "500K+", label: "Products", icon: ShoppingBag },
    { number: "4.9★", label: "Rating", icon: Star },
  ];

  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          style={{ y: y1 }}
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-green-300/20 rounded-full blur-lg"
          style={{ y: y2 }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/15 rounded-full blur-lg"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />

        {/* Interactive Cursor Effect */}
        <motion.div
          className="absolute w-6 h-6 bg-white/20 rounded-full blur-sm pointer-events-none"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px, 40px 40px",
          }}
        ></div>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">
                  New Features Available
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Buy & Sell
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-green-200 to-yellow-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Anything
                </motion.span>
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Online
                </motion.span>
              </h1>

              <motion.p
                className="text-xl md:text-2xl text-green-100 mb-12 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Discover amazing deals from trusted sellers worldwide. Your
                marketplace for everything.
              </motion.p>
            </motion.div>

            {/* Interactive CTA Buttons */}
            {/* <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-16"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleStartShopping}
                className="group relative bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Start Shopping</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                onClick={handleLiveAuctions}
                className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center space-x-2">
                  <Gavel className="h-5 w-5" />
                  <span>Live Auctions</span>
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    variants={pulseVariants}
                    animate="animate"
                  />
                </span>
              </motion.button>

              <motion.button
                onClick={handleAIHelper}
                className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>AI Helper</span>
                  <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </span>
              </motion.button>
            </motion.div> */}

            {/* Interactive Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mb-12"
              variants={itemVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/20 transition-all duration-300">
                    <stat.icon className="h-6 w-6 text-green-200 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-green-100 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Interactive Feature Cards */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`relative p-6 rounded-2xl backdrop-blur-sm border border-white/20 cursor-pointer overflow-hidden ${
                  hoveredCard === index ? "bg-white/20" : "bg-white/10"
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02, x: 10 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 transition-opacity duration-300`}
                  animate={{ opacity: hoveredCard === index ? 0.1 : 0 }}
                />

                <div className="relative flex items-center space-x-4">
                  <motion.div
                    className={`p-3 rounded-xl ${feature.bgColor}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-green-100 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <motion.div
                    className="text-white/60"
                    animate={{ x: hoveredCard === index ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Interactive Demo Button */}
            <motion.button
              className="group w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <div className="flex items-center justify-center space-x-3 text-white">
                <motion.div
                  className="bg-white/20 p-3 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Play className="h-6 w-6" />
                </motion.div>
                <div className="text-left">
                  <div className="font-semibold">Watch Demo</div>
                  <div className="text-sm text-green-100">See how it works</div>
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
