"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export function Cart({ isOpen, onClose }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm mt-2">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-blue-600 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="font-medium w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-blue-600">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
