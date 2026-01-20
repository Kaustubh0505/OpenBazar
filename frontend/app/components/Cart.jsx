// "use client";

// import { X, Plus, Minus, Trash2 } from "lucide-react";
// import { useCart } from "../context/CartContext";

// export function Cart({ isOpen, onClose }) {
//   const {
//     cart,
//     updateQuantity,
//     removeFromCart,
//     getTotalPrice,
//     clearCart,
//   } = useCart();

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className="fixed inset-0 bg-black/50 z-40"
//         onClick={onClose}
//       />

//       {/* Cart Drawer */}
//       <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col border-l border-gray-200">

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-black">
//             Shopping Cart
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 transition cursor-pointer"
//           >
//             <X className="h-5 w-5 bg-[#f7f5f2]" />
//           </button>
//         </div>

//         {/* Cart Items */}
//         <div className="flex-1 overflow-y-auto px-5 py-4">
//           {cart.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
//               <p className="text-sm font-medium">Your cart is empty</p>
//               <p className="text-xs mt-1">
//                 Add some products to get started
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {cart.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex gap-4 border border-gray-200 p-3"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover"
//                   />

//                   <div className="flex-1">
//                     <h3 className="text-sm font-medium text-black line-clamp-1">
//                       {item.name}
//                     </h3>

//                     <p className="text-sm font-semibold text-black mt-1">
//                     ₹{item.price.toFixed(2)}
//                     </p>

//                     <div className="flex items-center gap-2 mt-3">
//                       <button
//                         onClick={() =>
//                           updateQuantity(item._id, item.quantity - 1)
//                         }
//                         className="h-7 w-7 flex items-center justify-center border border-gray-300 hover:border-black transition cursor-pointer"
//                       >
//                         <Minus className="h-3.5 w-3.5" />
//                       </button>

//                       <span className="w-8 text-center text-sm font-medium">
//                         {item.quantity}
//                       </span>

//                       <button
//                         onClick={() =>
//                           updateQuantity(item._id, item.quantity + 1)
//                         }
//                         className="h-7 w-7 flex items-center justify-center border border-gray-300 hover:border-black transition cursor-pointer"
//                       >
//                         <Plus className="h-3.5 w-3.5" />
//                       </button>

//                       <button
//                         onClick={() => removeFromCart(item._id)}
//                         className="ml-auto text-gray-400 hover:text-red-600 transition cursor-pointer"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {cart.length > 0 && (
//           <div className="border-t border-gray-200 px-5 py-4 space-y-4">
//             <div className="flex justify-between text-sm font-medium">
//               <span>Total</span>
//               <span className="text-black">
//                 ${getTotalPrice().toFixed(2)}
//               </span>
//             </div>

//             <button className="w-full bg-[#f7f5f2] text-white py-3 text-sm font-medium hover:bg-gray-800 transition cursor-pointer">
//               Proceed to Checkout
//             </button>

//             <button
//               onClick={clearCart}
//               className="w-full border border-gray-300 text-sm py-2 hover:border-black transition cursor-pointer"
//             >
//               Clear Cart
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
