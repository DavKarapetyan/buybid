import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Globe,
  Award,
  Heart,
  Zap,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Target,
  Sparkles,
} from "lucide-react";
import { PageType } from "../../types";

interface AboutProps {
  onNavigate: (page: PageType) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  const [hoveredStat, setHoveredStat] = React.useState<number | null>(null);

  // Enhanced stats with more dynamic data
  const stats = [
    {
      number: "2M+",
      label: "Active Users",
      icon: Users,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      description: "Growing community worldwide",
    },
    {
      number: "500K+",
      label: "Products Listed",
      icon: Target,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      description: "New listings every day",
    },
    {
      number: "1M+",
      label: "Successful Deals",
      icon: CheckCircle,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      description: "Completed transactions",
    },
    {
      number: "150+",
      label: "Countries Served",
      icon: Globe,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      description: "Global marketplace reach",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer Obsession",
      description:
        "We start with the customer and work backwards, ensuring every feature and decision serves their needs.",
      color: "from-red-400 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We operate with transparency, honesty, and ethical practices in all our interactions.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously evolve and improve our platform to meet the changing needs of our community.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      icon: Users,
      title: "Inclusivity",
      description:
        "We welcome everyone and strive to create an accessible platform for all users.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We set high standards for ourselves and continuously strive to exceed expectations.",
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description:
        "We promote sustainable commerce practices and support the circular economy.",
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Every transaction is protected by our comprehensive safety measures and buyer protection policies.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe in building strong communities where buyers and sellers support each other's success.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with buyers and sellers from around the world, expanding your market beyond borders.",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

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
      transition: { duration: 0.6, ease: "easeOut" },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Icons */}
          {[
            { icon: Heart, delay: 0, x: "10%", y: "20%" },
            { icon: Shield, delay: 1, x: "85%", y: "15%" },
            { icon: Users, delay: 2, x: "15%", y: "80%" },
            { icon: Globe, delay: 3, x: "90%", y: "75%" },
            { icon: Sparkles, delay: 4, x: "50%", y: "10%" },
            { icon: Award, delay: 5, x: "75%", y: "85%" },
          ].map((element, index) => (
            <motion.div
              key={index}
              className="absolute opacity-10"
              style={{ left: element.x, top: element.y }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-10, 10, -10],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 6 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: element.delay,
              }}
            >
              <element.icon className="h-16 w-16" />
            </motion.div>
          ))}

          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-48 h-48 bg-green-300/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-green-200" />
              </motion.div>
              <span className="text-white font-semibold">
                Building the Future of Commerce
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                About
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-green-200 to-blue-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Buy Bid
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              We're building the world's most trusted marketplace where anyone
              can buy and sell with confidence, connecting communities globally.
            </motion.p>

            {/* Interactive CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.button
                onClick={() => onNavigate("register")}
                className="group relative bg-white text-primary-700 hover:text-primary-800 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden min-w-[200px]"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-3">
                  <Users className="h-6 w-6" />
                  <span>Join Community</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.button>

              <motion.button
                className="group relative bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden min-w-[200px]"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-3">
                  <Play className="h-6 w-6" />
                  <span>Watch Story</span>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Mission Section */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To democratize commerce by providing a safe, simple, and
              accessible platform where individuals and businesses can connect,
              trade, and grow together in a global marketplace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`${feature.bgColor} rounded-3xl p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className={`h-12 w-12 ${feature.iconColor}`} />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Interactive Stats */}
      <motion.section
        className="py-20 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real metrics that reflect our commitment to building a thriving
              marketplace community worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center cursor-pointer overflow-hidden group ${
                  hoveredStat === index ? "shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon with Animation */}
                <motion.div
                  className={`${stat.bgColor} rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center relative`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </motion.div>

                {/* Number with Counter Animation */}
                <motion.div
                  className="text-4xl font-bold text-gray-900 mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <div className="text-lg font-medium text-gray-700 mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <motion.div
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredStat === index ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.description}
                </motion.div>

                {/* Hover Effect Particles */}
                {hoveredStat === index && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary-400 rounded-full"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                          y: [-10, -20, -10],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Values Section */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The fundamental principles that guide everything we do and every
              decision we make in building our marketplace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className={`relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group cursor-pointer overflow-hidden ${
                  hoveredValue === index ? "shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <motion.div
                  className={`${value.bgColor} rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                </motion.div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>

                {/* Hover Indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: hoveredValue === index ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5 text-primary-600" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-primary-600 to-blue-600 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Animation */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 bg-green-300/20 rounded-full blur-lg"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto">
              Start your journey today on the platform trusted by millions of
              buyers and sellers worldwide. Experience the future of commerce.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => onNavigate("register")}
                className="group relative bg-white text-primary-700 hover:text-primary-800 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-3">
                  <Users className="h-6 w-6" />
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.button>

              <motion.button
                onClick={() => onNavigate("contact")}
                className="group relative bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-primary-500 overflow-hidden"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-3">
                  <Heart className="h-6 w-6" />
                  <span>Contact Us</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
