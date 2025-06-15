// src/components/auth/PublicRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Loading from '../Loading';
import axiosInstance from '../helper/axiosInstance';

const PublicRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axiosInstance.get('/api/auth/check-auth',);
                if (res.data.isAuthenticated) {
                    navigate('/', { replace: true });
                }
            } catch {
                // Not authenticated – keep showing the public page
            } finally {
                setChecking(false);
            }
        };
        verify();
    }, [navigate]);

    if (checking) return <Loading />;
    return <>{children}</>;
};

export default PublicRoute;
