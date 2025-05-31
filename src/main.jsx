import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Home from './pages/Home.jsx';
import Practice from './pages/Practice.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js'
import NotFound from './components/404.jsx';
import Signin from './components/CredentialsPages/SignIn.jsx';
import Signup from './components/CredentialsPages/Signup.jsx';
import Loading from './components/Loading.jsx';
import AboutUs from './pages/About.jsx';
import ProblemList from './pages/ProblemList.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
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
            <Route path="/" element={<App />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route index element={<Home />} />
              <Route path="/problem/*" element={<Practice />} />
              <Route path="/practice" element={<ProblemList/>} />
              <Route path="about" element={<AboutUs />} />
              <Route path="loading" element={<Loading />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  </Provider>

);
