
import React from 'react';
import { useCart } from '../context/CartContext';
import { View } from '../types';
import { TrashIcon, ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface CartPageProps {
  navigate: (view: View) => void;
}

const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    alert('Thank you for your purchase! (This is a mock checkout)');
    clearCart();
    navigate(View.HOME);
  };
  
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-300" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added any deals yet.</p>
          <button
            onClick={() => navigate(View.HOME)}
            className="mt-6 bg-primary-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ul className="divide-y divide-gray-200">
              {cart.map(item => (
                <li key={item.id} className="flex py-6 items-center">
                  <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                      <p className="text-gray-500">${item.discountedPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center mt-2">
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-16 border-gray-300 rounded-md text-center"
                        />
                        <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                  <p className="font-semibold text-lg">${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                </div>
                 <div className="flex justify-between mb-2 text-gray-500">
                    <span>Shipping</span>
                    <span>$5.00</span>
                </div>
                 <div className="flex justify-between mb-4 text-gray-500">
                    <span>Taxes</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(getCartTotal() + 5 + getCartTotal() * 0.08).toFixed(2)}</span>
                </div>

                 <button
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-primary-700 text-white font-bold py-3 rounded-lg hover:bg-primary-800 transition-colors"
                >
                    Proceed to Checkout
                </button>
                 <button
                    onClick={() => navigate(View.HOME)}
                    className="w-full mt-3 text-primary-700 font-semibold py-2 flex items-center justify-center"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2"/>
                    Continue Shopping
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
   