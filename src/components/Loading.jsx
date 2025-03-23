import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-indigo-100">
      <motion.div
        className="w-16 h-16 relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
      >
        <motion.div
          className="w-10 h-10 bg-indigo-500 rotate-45 absolute top-0 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="w-6 h-6 bg-indigo-700 rotate-45 absolute bottom-0 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror" }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;
