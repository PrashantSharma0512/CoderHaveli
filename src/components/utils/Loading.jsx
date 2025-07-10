import React from 'react';
import { Loader2, Code, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 dark:from-indigo-500 dark:to-indigo-700 animate-pulse"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
          <div className="absolute flex  space-x-2 animate-bounce text-xl font-bold text-amber-600 dark:text-indigo-400">
            <span>Coder</span>
            <span>Haveli</span>
          </div>
        </div>
        <p className="mt-6 text-lg font-medium tracking-wide text-amber-500 dark:text-indigo-300 flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            <Loader2 className="w-5 h-5" />
          </motion.span>
          Initializing Coding Environment...
        </p>
      </motion.div>
    </div>
  );
};

export default Loading;