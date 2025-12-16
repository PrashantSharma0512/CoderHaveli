import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Loading from '../components/utils/Loading';

const PublicRoute = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading, initialized } = useSelector(state => state.login);
    const Data = useSelector(state => state.login);

    useEffect(() => {
        if (initialized && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, initialized, navigate]);


    return <>{children}</>;
};

export default PublicRoute;