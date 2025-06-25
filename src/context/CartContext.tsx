"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ShippingOption {
  name: string;
  cost: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  displayName: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  shippingOptions: Record<string, ShippingOption>;
  shippingOption: string;
  setShippingOption: React.Dispatch<React.SetStateAction<string>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const shippingOptions: Record<string, ShippingOption> = {
    cod: { name: "Kurir Toko / COD (Area Lokal, 1-2 jam)", cost: 8000 },
    instant: { name: "Pengiriman Instant / Same Day (1-2 jam)", cost: 20000 },
    pickup: { name: "Ambil di Toko", cost: 0 },
  };

  const [shippingOption, setShippingOption] = useState("cod");

  // Load cart items and displayName from Firestore when user logs in
  useEffect(() => {
    const loadCartItems = async () => {
      if (!currentUser) {
        setCartItems([]);
        setDisplayName(null);
        setLoading(false);
        return;
      }

      try {
        // Set displayName from currentUser
        setDisplayName(currentUser.displayName || "Anonymous");

        const cartRef = doc(db, "carts", currentUser.uid);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items || []);
        } else {
          // Create empty cart if it doesn't exist
          await setDoc(cartRef, { items: [] });
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [currentUser]);

  // Update cart in Firestore whenever it changes
  useEffect(() => {
    const updateCartInFirestore = async () => {
      if (!currentUser || loading) return;

      try {
        const cartRef = doc(db, "carts", currentUser.uid);
        await updateDoc(cartRef, { items: cartItems });
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    };

    updateCartInFirestore();
  }, [cartItems, currentUser, loading]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    if (!currentUser) return;

    try {
      const cartRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartRef, { items: [] }); // kosongkan di Firestore juga
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cartItems,
    loading,
    displayName,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    shippingOptions,
    shippingOption,
    setShippingOption,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};