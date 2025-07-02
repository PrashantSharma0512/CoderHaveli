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
import AuthLayout from './components/auth/Authlayout.jsx';

// Misc
import NotFound from './components/404.jsx';
import Loading from './components/Loading.jsx';
import PublicRoute from './components/auth/PublicLayout.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ForgetPassword from './components/auth/ForgetPassword.jsx'
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
              <Route path="practice" element={<AuthLayout><ProblemList /></AuthLayout>} />
              <Route path="tutorial" element={<AuthLayout><TutorialPage /></AuthLayout>} />
              <Route path="about" element={<AboutUs />} />
              <Route path="profile" element={<AuthLayout><ProfilePage /></AuthLayout>} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </ChakraProvider>
    </StrictMode>
  </Provider>
);
