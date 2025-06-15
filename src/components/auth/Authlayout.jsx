import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import axiosInstance from '../helper/axiosInstance';
import { useSelector } from 'react-redux';

function AuthLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();


    console.log();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axiosInstance.get('/api/auth/check-auth');
                console.log(res, "ererer");

                if (res.data.isAuthenticated) {
                    setIsAuthenticated(true);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) return <div className="text-center mt-10">Checking authentication...</div>;

    return isAuthenticated ? <>{children}</> : null;
}

export default AuthLayout;
