import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './store/store.js';

// Pages
import Home from './pages/Home.jsx';
import Practice from './pages/Practice.jsx';
import AboutUs from './pages/About.jsx';
import ProblemList from './pages/ProblemList.jsx';
import TutorialPage from './pages/TutorialPage.jsx';

// Auth
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import AuthLayout from './layouts/Authlayout.jsx';

// Misc
import NotFound from './components/utils/404.jsx';
import PublicRoute from './layouts/PublicLayout.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ForgetPassword from './components/auth/ForgetPassword.jsx'
import DetailedPage from './pages/DetailedPage.jsx';
import CourseDashboard from './pages/MyCourse.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import AddToCart from './pages/AddToCart.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentButton from './components/payments/Razorpay.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "inherit",
      },
    },
    config: {
      cssVarPrefix: "chakra",
    },
  }
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <ChakraProvider theme={theme} resetCSS={false}>
        <BrowserRouter>
          <Routes>

            {/* Public Auth Pages (Independent views) */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forget" element={<PublicRoute><ForgetPassword /></PublicRoute>} />

            {/* All Pages Inside App Layout */}
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="problem/*" element={<AuthLayout><Practice /></AuthLayout>} />
              <Route path="practice" element={<ProblemList />} />
              <Route path="tutorial" element={<AuthLayout><TutorialPage /></AuthLayout>} />
              <Route path="about" element={<AboutUs />} />
              <Route path="profile" element={<AuthLayout><ProfilePage /></AuthLayout>} />
              <Route path="tutorial-page/*" element={<AuthLayout><DetailedPage /></AuthLayout>} />
              <Route path="mycourse" element={<AuthLayout><CourseDashboard /></AuthLayout>} />
              <Route path="video" element={<AuthLayout><VideoPlayer /></AuthLayout>} />
              <Route path="addtocart" element={<AuthLayout><AddToCart /></AuthLayout>} />
              <Route path="checkout" element={<AuthLayout><Checkout /></AuthLayout>} />
              <Route path="payment" element={<AuthLayout><PaymentButton /></AuthLayout>} />
              <Route path="admin" element={<AuthLayout><AdminDashboard /></AuthLayout>} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  </Provider>
);
