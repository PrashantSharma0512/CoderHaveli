import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-indigo-100  bg-opacity-50">
      <motion.div
        className="w-36 h-36 relative rounded-full text-4xl font-mono "
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
      >
        Coder Haveli
      </motion.div>
    </div>
  );
};

export default Loading;
