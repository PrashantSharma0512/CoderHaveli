import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
    ShieldCheckIcon,
    LockClosedIcon,
    ExclamationTriangleIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        loading,
        initialized,
        role,
        user // Now we can access user details directly
    } = useSelector(state => state.login);


    useEffect(() => {
        if (!initialized) return;

        // Not authenticated → redirect to login
        if (!isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: { from: location.pathname }
            });
        }
    }, [initialized, isAuthenticated, navigate, location.pathname]);

    // Loading / hydration state
    if (loading || !initialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="relative">
                        <div className="h-32 w-32 mx-auto rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-24 w-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-500 p-3 rounded-full animate-pulse">
                            <ShieldCheckIcon className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Securing Admin Dashboard
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Verifying your credentials and permissions...
                        </p>
                        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Ensuring secure access to administrative functions
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Authenticated but NOT authorized (not admin)
    if (isAuthenticated && role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="relative">
                        <div className="h-48 w-48 mx-auto rounded-full bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/10 flex items-center justify-center">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-r from-red-200 to-red-100 dark:from-red-800/30 dark:to-red-700/20 flex items-center justify-center">
                                <LockClosedIcon className="h-20 w-20 text-red-500 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-7xl font-bold text-red-600 dark:text-red-500 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                                403
                            </h1>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Access Restricted
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-lg mx-auto">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                                    <ShieldCheckIcon className="h-5 w-5" />
                                    <span className="font-semibold">Admin Privileges Required</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Your account ({user?.email || 'User'}) does not have administrative permissions to access this resource.
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Required role: <span className="font-bold text-red-500">Administrator</span>
                                        <br />
                                        Your role: <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{role || 'User'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <p className="text-gray-500 dark:text-gray-400">
                                Please contact your system administrator if you believe this is an error.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Return to Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    Switch Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 text-sm text-gray-400 dark:text-gray-500 hidden md:block">
                    <p>Access Log: Unauthorized attempt • {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="absolute bottom-8 right-8 text-sm text-gray-400 dark:text-gray-500 hidden md:block">
                    <p>Request ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </div>
        );
    }

    // If not authenticated but somehow reached here, show loading
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
                </div>
            </div>
        );
    }

    // Authorized admin - wrap children with admin layout
    return (
        <div>{children}</div>
    );
}

export default AdminLayout;