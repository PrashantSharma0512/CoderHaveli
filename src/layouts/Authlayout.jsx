import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function AuthLayout({ children }) {
    const location = useLocation();
    const { isAuthenticated, loading, initialized } = useSelector(state => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized && !isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: { from: location.pathname }
            });
        }
    }, [isAuthenticated, initialized, navigate, location.pathname]);


    
    if (loading || !initialized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-900 space-y-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    {/* Animated code brackets */}
                    <div className="absolute -left-6 top-0 text-4xl text-indigo-500 dark:text-indigo-400 animate-bounce">
                        {'{'}
                    </div>
                    <div className="flex items-center justify-center h-16 w-16 bg-white dark:bg-gray-800 rounded-full shadow-md">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full"></div>
                    </div>
                    <div className="absolute -right-6 top-0 text-4xl text-indigo-500 dark:text-indigo-400 animate-bounce delay-100">
                        {'}'}
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        Preparing Your Submissions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        We're retrieving your code execution history from our servers...
                    </p>
                </div>

                {/* Simulated progress bar with coding-themed animation */}
                <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                        className="bg-indigo-500 dark:bg-indigo-400 h-2 rounded-full animate-pulse"
                        style={{
                            width: '65%',
                            animationDuration: '2s',
                            animationTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)'
                        }}
                    ></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <div className="text-center mt-10">Redirecting to login...</div>;
    }

    return <>{children}</>;
}

export default AuthLayout;