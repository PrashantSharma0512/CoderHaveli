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
            <div className={`flex flex-col items-center justify-center h-64 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
                <p className={`mt-4 text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Verifying your session
                </p>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Loading your submission history...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <div className="text-center mt-10">Redirecting to login...</div>;
    }

    return <>{children}</>;
}

export default AuthLayout;