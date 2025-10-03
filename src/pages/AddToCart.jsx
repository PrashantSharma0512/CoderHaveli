import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router';
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const AddToCartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = useSelector(state => state.login.userId);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/api/cart?id=${userId}`);
                
                if (res.data.success) {
                    // Transform API data to match component structure
                    const transformedCart = res.data.cart.map(item => ({
                        id: item._id,
                        _id: item._id,
                        type: item.type,
                        name: item.title,
                        title: item.title,
                        price: item.price,
                        duration: item.duration,
                        image: item.image?.url,
                        category: item.category?.name,
                        quantity: 1 // Default quantity since API doesn't provide it
                    }));
                    setCartItems(transformedCart);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                toast.error('Failed to load cart items');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const updateQuantity = async (itemId, change) => {
        try {
            const item = cartItems.find(item => item.id === itemId);
            const newQuantity = item.quantity + change;
            
            if (newQuantity < 1) {
                removeItem(itemId);
                return;
            }

            // Update quantity in backend
            const res = await axiosInstance.put('/api/cart/update', {
                userId,
                productId: itemId,
                quantity: newQuantity
            });

            if (res.data.success) {
                setCartItems(prev => 
                    prev.map(item => 
                        item.id === itemId 
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
                toast.success('Cart updated');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const res = await axiosInstance.delete('/api/cart/remove', {
                data: {
                    userId,
                    productId: itemId
                }
            });

            if (res.data.success) {
                setCartItems(prev => prev.filter(item => item.id !== itemId));
                toast.success('Item removed from cart');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            const res = await axiosInstance.delete('/api/cart/clear', {
                data: { userId }
            });

            if (res.data.success) {
                setCartItems([]);
                toast.success('Cart cleared');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (loading) {
        return (
            <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-100 dark:bg-indigo-900 text-amber-600 dark:text-indigo-400 rounded-full mb-4">
                            <FaShoppingCart className="text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">You need to be logged in to view your cart</p>
                        <Link 
                            to="/login"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-500 dark:to-indigo-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                        >
                            Login to Continue
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <Link to="/" className="flex items-center text-amber-600 dark:text-indigo-400 hover:text-amber-700 dark:hover:text-indigo-300 transition-colors mr-4">
                        <FaArrowLeft className="mr-2" /> Continue Learning
                    </Link>
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
                                    <Link 
                                        to="/"
                                        className="inline-block mt-4 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-500 dark:to-indigo-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                                    >
                                        Browse Courses
                                    </Link>
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
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.duration}</p>
                                                <p className="text-amber-600 dark:text-indigo-400 font-semibold mt-1"> ₹ {item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
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
                                            </div>
                                            <div className="ml-4 sm:ml-8 mt-4 sm:mt-0 text-right">
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                     ₹ {(item.price * item.quantity).toFixed(2)}
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
                            <Link 
                                to="/"
                                className="flex items-center text-amber-600 dark:text-indigo-400 hover:text-amber-700 dark:hover:text-indigo-300 transition-colors font-medium"
                            >
                                ← Continue Shopping
                            </Link>
                            {cartItems.length > 0 && (
                                <button 
                                    onClick={clearCart}
                                    className="text-red-500 hover:text-red-700 transition-colors font-medium flex items-center"
                                >
                                    <FaTrash className="mr-1" /> Clear Cart
                                </button>
                            )}
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
                                    <span className="text-gray-600 dark:text-gray-300">Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium text-gray-900 dark:text-white"> ₹ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-300">Tax (10%)</span>
                                    <span className="font-medium text-gray-900 dark:text-white"> ₹ {tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600 dark:text-gray-300">Discount</span>
                                    <span className="font-medium text-green-600">- ₹ 0.00</span>
                                </div>
                                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-lg font-bold text-amber-600 dark:text-indigo-400"> ₹ {total.toFixed(2)}</span>
                                </div>
                                <Link to={cartItems.length > 0 ? '/checkout' : '#'}>
                                    <button 
                                        disabled={cartItems.length === 0}
                                        className={`w-full mt-6 font-medium py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                                            cartItems.length > 0 
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-500 dark:to-indigo-600 hover:from-amber-600 hover:to-amber-700 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white cursor-pointer'
                                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {cartItems.length > 0 ? 'Proceed to Checkout' : 'Cart is Empty'}
                                    </button>
                                </Link>
                                
                                {cartItems.length > 0 && (
                                    <div className="mt-6 p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg border border-amber-100 dark:border-indigo-800">
                                        <h3 className="font-medium text-amber-800 dark:text-indigo-200 mb-2">Special Offer for Developers!</h3>
                                        <p className="text-sm text-amber-700 dark:text-indigo-300">
                                            {cartItems.length >= 3 
                                                ? 'Congratulations! You got 15% discount on your entire order.'
                                                : `Add ${3 - cartItems.length} more course${3 - cartItems.length === 1 ? '' : 's'} to get 15% discount on your entire order.`
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recently Viewed - You can implement this later */}
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Tips</h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">Complete one course at a time</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Focus on mastering one skill before moving to the next</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">Practice regularly</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Consistent practice is key to becoming a great developer</p>
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