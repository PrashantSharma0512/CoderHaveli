import React, { useState } from 'react';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const AddToCartPage = () => {
    // Sample cart data
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "JavaScript Master Course",
            price: 49.99,
            quantity: 1,
            image: "https://via.placeholder.com/80x80/3b82f6/ffffff?text=JS",
            category: "JavaScript"
        },
        {
            id: 2,
            name: "React Pro Bundle",
            price: 79.99,
            quantity: 1,
            image: "https://via.placeholder.com/80x80/1e40af/ffffff?text=React",
            category: "React"
        },
        {
            id: 3,
            name: "Python Programming",
            price: 59.99,
            quantity: 1,
            image: "https://via.placeholder.com/80x80/059669/ffffff?text=Python",
            category: "Python"
        }
    ]);

    // Function to remove item from cart
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Calculate total
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <button className="flex items-center text-amber-600 dark:text-indigo-400 hover:text-amber-700 dark:hover:text-indigo-300 transition-colors mr-4">
                        <FaArrowLeft className="mr-2" /> Continue Learning
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Learning Cart</h1>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-8">Review your selected courses and proceed to checkout</p>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cart Items ({cartItems.length})</h2>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-100 dark:bg-indigo-900 text-amber-600 dark:text-indigo-400 rounded-full mb-4">
                                        <FaShoppingCart className="text-2xl" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">Your cart is empty</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start adding courses to continue your coding journey</p>
                                    <button className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-500 dark:to-indigo-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300">
                                        Browse Courses
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg mb-4 sm:mb-0 shadow-md"
                                            />
                                            <div className="flex-1 sm:ml-6">
                                                <span className="inline-block px-2 py-1 text-xs font-medium text-amber-800 dark:text-indigo-200 bg-amber-100/50 dark:bg-indigo-900/30 rounded-full mb-2">
                                                    {item.category}
                                                </span>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                                                <p className="text-amber-600 dark:text-indigo-400 font-semibold mt-1">${item.price.toFixed(2)}</p>
                                            </div>
                                            {/* <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-indigo-900 text-amber-700 dark:text-indigo-300 rounded-full hover:bg-amber-200 dark:hover:bg-indigo-800 transition-colors"
                                                >
                                                    <FaMinus className="text-xs" />
                                                </button>
                                                <span className="text-lg font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-indigo-900 text-amber-700 dark:text-indigo-300 rounded-full hover:bg-amber-200 dark:hover:bg-indigo-800 transition-colors"
                                                >
                                                    <FaPlus className="text-xs" />
                                                </button>
                                            </div> */}
                                            <div className="ml-4 sm:ml-8 mt-4 sm:mt-0 text-right">
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="mt-2 text-red-500 hover:text-red-700 transition-colors flex items-center justify-end sm:justify-start"
                                                >
                                                    <FaTrash className="mr-1 text-sm" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-6 flex justify-between">
                            <button className="flex items-center text-amber-600 dark:text-indigo-400 hover:text-amber-700 dark:hover:text-indigo-300 transition-colors font-medium">
                                ← Continue Shopping
                            </button>
                            <button className="text-red-500 hover:text-red-700 transition-colors font-medium flex items-center">
                                <FaTrash className="mr-1" /> Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 sticky top-6">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-300">Tax (10%)</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600 dark:text-gray-300">Discount</span>
                                    <span className="font-medium text-green-600">-$0.00</span>
                                </div>
                                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-lg font-bold text-amber-600 dark:text-indigo-400">${total.toFixed(2)}</span>
                                </div>

                                <button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-500 dark:to-indigo-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                                    Proceed to Checkout
                                </button>

                                <div className="mt-6 p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg border border-amber-100 dark:border-indigo-800">
                                    <h3 className="font-medium text-amber-800 dark:text-indigo-200 mb-2">Special Offer for Developers!</h3>
                                    <p className="text-sm text-amber-700 dark:text-indigo-300">Add 2 more courses to get 15% discount on your entire order.</p>
                                </div>
                            </div>
                        </div>

                        {/* Recently Viewed */}
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Viewed</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex mb-4">
                                    <img
                                        src="https://via.placeholder.com/50x50/7c3aed/ffffff?text=TS"
                                        alt="TypeScript Course"
                                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white">TypeScript Fundamentals</h3>
                                        <p className="text-amber-600 dark:text-indigo-400 font-semibold text-sm">$44.99</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <img
                                        src="https://via.placeholder.com/50x50/dc2626/ffffff?text=Node"
                                        alt="Node.js Course"
                                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white">Node.js Backend Development</h3>
                                        <p className="text-amber-600 dark:text-indigo-400 font-semibold text-sm">$64.99</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddToCartPage;