import { Link } from 'react-router';
import Image404 from '../assets/404.gif';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-6">
      <div>
        <img src={Image404} alt="" className='w-[300px] ' />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-400 mb-6">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all">Go Home</Link>
    </div>
  );
}
