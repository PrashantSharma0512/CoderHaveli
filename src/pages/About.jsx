import { motion } from "framer-motion";
import DevPhoto from '/dev_ghibli.png'; // Replace with your actual image path
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const AboutUs = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to <span className="text-amber-600 dark:text-indigo-400">CoderHaveli</span> 🚀
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          At <span className="font-bold text-amber-600 dark:text-indigo-400">CoderHaveli</span>, we craft an immersive learning experience for aspiring developers. 
          Our mission is to bridge the gap between education and real-world tech skills.
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        {[
          { 
            title: "🚀 Our Mission", 
            text: "To revolutionize learning with practical, hands-on coding courses tailored for the modern tech industry.",
            icon: "💡"
          },
          { 
            title: "🎓 What We Offer", 
            text: "Interactive lessons, expert mentorship, and real-world projects to help you grow as a developer.",
            icon: "📚"
          },
          { 
            title: "🔥 Why Us?", 
            text: "Cutting-edge curriculum, affordable pricing, and a thriving community to support your journey.",
            icon: "🌟"
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-indigo-400 transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Meet the Developer Section */}
      <div className="mt-16 text-center">
        <motion.h3 
          className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Meet the <span className="text-amber-600 dark:text-indigo-400">Developer</span> 💻
        </motion.h3>
        
        <motion.div 
          className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src={DevPhoto}
            alt="Prashant Sharma" 
            className="w-32 h-32 rounded-full shadow-md mb-4 object-cover border-2 border-amber-400 dark:border-indigo-500"
          />
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">Prashant Sharma</h4>
          <p className="text-amber-600 dark:text-indigo-400 font-medium">Founder & Full-Stack Developer</p>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Passionate about building modern web applications and helping developers grow in tech.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a 
              href="https://github.com/PrashantSharma0512" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={24} />
            </a>
            <a 
              href="https://linkedin.com/in/prashant-sharma-0216ba251/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={24} />
            </a>
            <a 
              href="https://x.com/PraShant051202" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter size={24} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Ready to start your coding journey?
        </h3>
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
          Explore Our Courses
        </button>
      </motion.div>
    </div>
  );
};

export default AboutUs;