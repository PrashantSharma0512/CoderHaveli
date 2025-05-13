import React from 'react';
import { Loader2, Code, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 animate-pulse"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
          <div className="absolute flex space-x-4 animate-bounce text-xl">
            Coder Haveli
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold tracking-wide text-blue-300">Initializing Coding Environment...</p>
      </motion.div>
    </div>
  );
};

export default Loading;
