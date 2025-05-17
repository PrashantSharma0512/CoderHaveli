import { Toaster } from 'react-hot-toast'
import Header from './components/Header/Header'
import Footer from './components/footer/Footer'
import { Outlet,useLocation } from 'react-router'
import { MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  loader: { load: ["[tex]/ams"] },
  tex: { packages: { "[+]": ["ams"] } },
};
function App() {
  const location = useLocation()
  const hideFooter = /^\/problem\/[a-f0-9]{24}$/.test(location.pathname);
  return (
    <MathJaxContext config={mathJaxConfig} version={3} >
      <div style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1A202C', scrollbarTrackColor: '#1A202C' }}>
        <Header />
        <Outlet />
        {!hideFooter && <Footer />}
        <Toaster />
      </div>
    </MathJaxContext>
  )
}

export default App
