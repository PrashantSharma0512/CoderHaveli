import React, { useState } from 'react';
import axios from 'axios';
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

function ServerStarter() {
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);

    const startServer = async () => {
        setLoading(true);
        setStarted(false);
        try {
            await axios.get('https://coderhaveli-compiler.onrender.com/server-starter');
            toast.success("Compiler Server is now active!"); 
            setStarted(true);
        } catch (err) {
            console.error("Failed to wake server:", err.message);
            toast.error("Failed to wake server. Please try again later.");
            setStarted(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={startServer}
            title="Wake up Compiler Server"
            disabled={loading}
            className={`fixed bottom-20 right-6 z-50 p-3 rounded-full text-white shadow-lg transition-all duration-300
                ${started ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                dark:bg-indigo-500 dark:hover:bg-indigo-600
                ${loading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
        >
            {started ? <FaCheckCircle size={20} /> : <MdOutlineRestartAlt size={20} />}
        </button>
    );
}

export default ServerStarter;
