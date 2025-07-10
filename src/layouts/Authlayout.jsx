

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function AuthLayout({ children }) {
    const location = useLocation();


    const { isAuthenticated } = useSelector(state => state.login); // from authSlice
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true, state: { from: location.pathname } });
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <>{children}</> : <div className="text-center mt-10">Redirecting to login...</div>;
}

export default AuthLayout;

