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
        return <div className="text-center mt-10">Verifying session...</div>;
    }

    if (!isAuthenticated) {
        return <div className="text-center mt-10">Redirecting to login...</div>;
    }

    return <>{children}</>;
}

export default AuthLayout;