
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Loading from '../Loading';

const PublicRoute = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading, userid } = useSelector(state => state.login);
    console.log(userid,"k");

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <Loading />;
    return <>{children}</>;
};

export default PublicRoute;
