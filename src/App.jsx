import { Toaster } from 'react-hot-toast'
import Header from './components/Header/Header'
import Footer from './components/footer/Footer'
import { Outlet,useLocation } from 'react-router'
function App() {
const location = useLocation()
  return (
    <div style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1A202C', scrollbarTrackColor: '#1A202C' }}>
      <Header />
      <Outlet />
      {location.pathname !== '/practice' && <Footer />}
      <Toaster />
    </div>
  )
}

export default App
