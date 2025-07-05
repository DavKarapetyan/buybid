import React from "react";
import { AppState, PageType, User } from "./types";
import { mockUsers } from "./data/mockData";

// Layout Components
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

// Page Components
import Home from "./components/Pages/Home";
import CategoryBrowse from "./components/Pages/CategoryBrowse";
import ProductDetail from "./components/Pages/ProductDetail";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SellerDashboard from "./components/Dashboard/SellerDashboard";
import ChatInterface from "./components/Chat/ChatInterface";
import About from "./components/Pages/About";
import Contact from "./components/Pages/Contact";
import Auctions from "./components/Pages/Auctions";
import AuctionDetail from "./components/Pages/AuctionDetail";
import AIHelper from "./components/Pages/AIHelper";
import BusinessAnalytics from "./components/Pages/BusinessAnalytics";
import { AuthProvider } from "./components/Auth/AuthContext";
import AddProduct from "./components/Pages/AddProduct";
import LikedProducts from "./components/Pages/LikedProducts";
import TradeCreation from "./components/Pages/TradeCreation";
import TradesPage from "./components/Pages/TradesPage";
import TradeDetails from "./components/Pages/TradeDetails";

function App() {
  const [appState, setAppState] = React.useState<AppState>({
    currentPage: "home",
    searchQuery: "",
    isAuthenticated: false,
  });

  const handleNavigate = (
    page: PageType,
    param?: string,
    toUserId?: string
  ) => {
    setAppState((prev) => ({
      ...prev,
      currentPage: page,
      selectedProduct:
        page === "product" && param ? ({ id: param } as any) : undefined,
      selectedCategory:
        page === "category" && param ? param : prev.selectedCategory,
      selectedAuction: page === "auction-detail" && param ? param : undefined,
      selectedTrade: page === "trade" && param ? param : prev.selectedTrade,
      selectedToUser:
        page === "chat" && toUserId ? toUserId : prev.selectedToUser,
    }));
  };

  const handleNavigate2 = (page: PageType) => {
    setAppState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleSearch = (query: string) => {
    setAppState((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  };

  const handleLogin = (email: string, password: string) => {
    const isBusinessEmail =
      email.includes("business") || email.includes("company");
    const user: User = {
      ...mockUsers[0],
      businessType: isBusinessEmail ? "business" : "individual",
      businessName: isBusinessEmail ? "Tech Solutions Inc." : undefined,
    };

    setAppState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user,
      currentPage: "home",
    }));
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const isBusinessEmail =
      email.includes("business") || email.includes("company");
    const newUser: User = {
      id: "new-user",
      name,
      email,
      avatar:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      joinedDate: new Date().toISOString(),
      businessType: isBusinessEmail ? "business" : "individual",
      businessName: isBusinessEmail ? name : undefined,
    };

    setAppState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: newUser,
      currentPage: "home",
    }));
  };

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case "home":
        return <Home onNavigate={handleNavigate} onSearch={handleSearch} />;
      case "category":
        return (
          <CategoryBrowse
            selectedCategory={appState.selectedCategory}
            searchQuery={appState.searchQuery}
            onNavigate={handleNavigate}
          />
        );
      case "product":
        return (
          <ProductDetail
            productId={appState.selectedProduct?.id || ""}
            onNavigate={handleNavigate}
          />
        );
      case "auction-detail":
        return (
          <AuctionDetail
            auctionId={appState.selectedAuction || ""}
            onNavigate={handleNavigate}
          />
        );
      case "login":
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case "register":
        return (
          <Register onRegister={handleRegister} onNavigate={handleNavigate} />
        );
      case "dashboard":
        return <SellerDashboard onNavigate={handleNavigate} />;
      case "addProduct":
        return <AddProduct onNavigate={handleNavigate} />;
      case "chat":
        return (
          <ChatInterface
            onNavigate={handleNavigate}
            user1Id={appState.user?.id}
            user2Id={appState.selectedToUser}
          />
        );
      case "about":
        return <About onNavigate={handleNavigate} />;
      case "contact":
        return <Contact onNavigate={handleNavigate} />;
      case "auctions":
        return <Auctions onNavigate={handleNavigate} />;
      case "ai-helper":
        return <AIHelper onNavigate={handleNavigate2} />;
      case "business-analytics":
        return <BusinessAnalytics onNavigate={handleNavigate} />;
      case "liked":
        return <LikedProducts onNavigate={handleNavigate} />;
      case "trades":
        return <TradesPage onNavigate={handleNavigate} />;
      case "trade":
        return (
          <TradeDetails
            onNavigate={handleNavigate}
            tradeId={appState.selectedTrade || ""}
          />
        );
      case "create-trade":
        return (
          <TradeCreation
            onNavigate={handleNavigate}
            toUserId={appState.selectedToUser || ""}
          />
        );
      default:
        return <Home onNavigate={handleNavigate} onSearch={handleSearch} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          appState={appState}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
        <main>{renderCurrentPage()}</main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </AuthProvider>
  );
}

export default App;
