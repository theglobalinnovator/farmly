// src/app/context/AppContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  location: string;
  rating: number;
  isCluster: boolean;
  clusterRemainingPercent?: number;
  description?: string;
  stockUnit?: string;
  tag?: "standard" | "cluster" | "distress";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  name: string;
  stars: number;
  comment: string;
  date: string;
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export interface OrderTrack {
  id: string;
  buyer: string;
  items: string;
  amount: number;
  status: "Processing" | "In-Transit" | "Delivered" | "Verified";
  date: string;
}

type UserRole = "guest" | "consumer" | "vendor";

interface AppContextType {
  theme: string;
  setTheme: (theme: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
  vendorName: string;
  setVendorName: (name: string) => void;
  showVendorLoginModal: boolean;
  setShowVendorLoginModal: (show: boolean) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  monthlyRevenue: MonthlyRevenue[];
  orders: OrderTrack[];
  setOrders: React.Dispatch<React.SetStateAction<OrderTrack[]>>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState("dark");
  const [userRole, setUserRoleState] = useState<UserRole>("guest");
  const [userName, setUserNameState] = useState("Oladimeji Isaac");
  const [vendorName, setVendorNameState] = useState("");
  const [showVendorLoginModal, setShowVendorLoginModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [monthlyRevenue] = useState<MonthlyRevenue[]>([
    { month: "Jan", amount: 420000 },
    { month: "Feb", amount: 580000 },
    { month: "Mar", amount: 710000 },
    { month: "Apr", amount: 930000 },
    { month: "May", amount: 1250000 },
    { month: "Jun", amount: 1840000 },
  ]);

  // Starts empty so orders dynamically reflect your actual website inventory/checkouts
  const [orders, setOrders] = useState<OrderTrack[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("farmly_theme") || "dark";
    const savedRole = localStorage.getItem("farmly_role") as UserRole;
    const savedName = localStorage.getItem("farmly_name");
    const savedVendorName = localStorage.getItem("farmly_vendor_name");
    const savedCart = localStorage.getItem("farmly_cart");
    const savedProducts = localStorage.getItem("farmly_products");
    const savedFavs = localStorage.getItem("farmly_favs");
    const savedReviews = localStorage.getItem("farmly_reviews");
    const savedOrders = localStorage.getItem("farmly_orders");

    setThemeState(savedTheme);
    if (savedRole) setUserRoleState(savedRole);
    if (savedName) setUserNameState(savedName);
    if (savedVendorName) setVendorNameState(savedVendorName);
    
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    if (savedReviews) {
      try { setReviews(JSON.parse(savedReviews)); } catch (e) { console.error(e); }
    }
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error(e); }
    }

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        setProducts([]);
      }
    } else {
      setProducts([]);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("farmly_theme", newTheme);
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem("farmly_role", role);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem("farmly_name", name);
  };

  const setVendorName = (name: string) => {
    setVendorNameState(name);
    localStorage.setItem("farmly_vendor_name", name);
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
      const updatedList = [newProduct, ...prev];
      localStorage.setItem("farmly_products", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const updatedList = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      localStorage.setItem("farmly_products", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      localStorage.setItem("farmly_products", JSON.stringify(filtered));
      return filtered;
    });
  };

  const addToCart = (product: Product) => {
    if (userRole === "guest") {
      setShowAuthModal(true);
      return;
    }
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.product.id === product.id);
      let newCart;
      if (exists) {
        newCart = prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { product, quantity: 1 }];
      }
      localStorage.setItem("farmly_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem("farmly_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const newCart = prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item));
      localStorage.setItem("farmly_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const addReview = (newReview: Review) => {
    setReviews((prev) => {
      const updated = [newReview, ...prev];
      localStorage.setItem("farmly_reviews", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        userRole,
        setUserRole,
        userName,
        setUserName,
        vendorName,
        setVendorName,
        showVendorLoginModal,
        setShowVendorLoginModal,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart: () => { setCart([]); localStorage.removeItem("farmly_cart"); },
        globalSearch,
        setGlobalSearch,
        reviews,
        addReview,
        showAuthModal,
        setShowAuthModal,
        monthlyRevenue,
        orders,
        setOrders: (action) => {
          setOrders((prev) => {
            const next = typeof action === "function" ? action(prev) : action;
            localStorage.setItem("farmly_orders", JSON.stringify(next));
            return next;
          });
        },
        favorites,
        toggleFavorite: (id) => {
          setFavorites((prev) => {
            const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
            localStorage.setItem("farmly_favs", JSON.stringify(next));
            return next;
          });
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
}