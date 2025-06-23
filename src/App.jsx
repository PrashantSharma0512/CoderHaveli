import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { MathJaxContext } from 'better-react-mathjax';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './store/slice/authSlice';
import Header from './components/Header/Header';
import Footer from './components/footer/Footer';

const mathJaxConfig = {
  loader: { load: ["[tex]/ams"] },
  tex: { packages: { "[+]": ["ams"] } },
};

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideFooter = /^\/problem\/[a-f0-9]{24}$/.test(location.pathname);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <MathJaxContext config={mathJaxConfig} version={3}>
      <div style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1A202C' }}>
        <Header />
        <Outlet />
        {!hideFooter && <Footer />}
        <Toaster />
      </div>
    </MathJaxContext>
  );
}

export default App;
