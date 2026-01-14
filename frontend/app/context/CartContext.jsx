"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);


export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {"Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Check if user is authenticated
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);

    // Load cart from backend when authenticated
    if (token) {
      fetchCartFromDB();
    }
  }, []);

  // Fetch cart from database
  const fetchCartFromDB = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/cart`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        // Transform cart items from DB format to local format
        const cartItems = data.cart.items.map((item) => ({
          _id: item.product._id || item.product,
          name: item.name,
          price: item.price,
          image: item.product.image_url,
          quantity: item.quantity,
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Sync local cart with database (called after login)
  const syncCartWithDB = async (localCart) => {
    if (localCart.length === 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/cart/sync`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ items: localCart }),
      });

      if (response.ok) {
        const data = await response.json();
        const cartItems = data.cart.items.map((item) => ({
          _id: item.product._id || item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const addToCart = async (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id
      );

      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      // Sync with database if authenticated
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        console.log("Token found, syncing with database...");

        fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/cart/add`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              console.error("❌ Failed to add to cart:", errorData);
              throw new Error(errorData.message || "Failed to add to cart");
            }
            return response.json();
          })
          .then((data) => {
            console.log("✅ Item added to database:", data);
          })
          .catch((error) => {
            console.error("❌ Error adding to cart:", error);
          });
      } else {
        console.log("⚠️ No token found - item only saved locally (not logged in)");
      }

      return newCart;
    });
  };

  const removeFromCart = async (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item._id !== productId);

      // Sync with database if authenticated
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/cart/remove/${productId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        }).catch((error) => console.error("Error removing from cart:", error));
      }

      return newCart;
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity }
          : item
      );

      // Sync with database if authenticated
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/cart/update`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ productId, quantity }),
        }).catch((error) => console.error("Error updating cart:", error));
      }

      return newCart;
    });
  };

  const clearCart = async () => {
    setCart([]);

    // Sync with database if authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/cart/clear`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }).catch((error) => console.error("Error clearing cart:", error));
    }
  };

  const getTotalItems = () => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        syncCartWithDB,
        fetchCartFromDB,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}
