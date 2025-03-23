import { motion } from "framer-motion";
import DevPhoto from '/DevPhoto.png';  // <-- Replace this with your actual image path
const AboutUs = () => {
  return (
    <div className="bg-gradient-to-r from-gray-950 to-zinc-400 text-white py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          className="text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to CoderHaveli 🚀
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-200 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          At <span className="font-bold">CoderHaveli</span>, we craft an immersive learning experience for aspiring developers. 
          Our mission is to bridge the gap between education and real-world tech skills, empowering individuals to build their dream careers.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        {[
          { 
            title: "🚀 Our Mission", 
            text: "To revolutionize learning with practical, hands-on coding courses tailored for the modern tech industry." 
          },
          { 
            title: "🎓 What We Offer", 
            text: "Interactive lessons, expert mentorship, and real-world projects to help you grow as a developer." 
          },
          { 
            title: "🔥 Why CoderHaveli?", 
            text: "Cutting-edge curriculum, affordable pricing, and a thriving community to support your learning journey." 
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            className="bg-gradient-to-r from-zinc-500 to-zinc-900 text-white p-6 rounded-2xl shadow-lg text-center hover:scale-105 transform transition-transform cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
          >
            <h3 className="text-2xl font-semibold">{item.title}</h3>
            <p className="text-white mt-2">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Meet the Developer Section */}
      <div className="mt-16 text-center">
        <motion.h3 
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Meet the Developer 💻
        </motion.h3>
        <motion.div 
          className="flex flex-col items-center bg-gradient-to-r from-zinc-500 to-zinc-900 text-white p-8 rounded-2xl shadow-lg max-w-md mx-auto hover:scale-105 transform transition-transform"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img 
            src={DevPhoto}  // <-- Replace this with your actual image path
            alt="Prashant Sharma" 
            className="w-32 h-32 rounded-full shadow-md mb-4"
          />
          <h4 className="text-2xl font-semibold">Prashant Sharma</h4>
          <p >Founder & Full-Stack Developer</p>
          <p className="mt-2">
            Passionate about building modern web applications and helping developers grow in tech.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
