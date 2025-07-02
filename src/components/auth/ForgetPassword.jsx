import { useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // 'email' | 'otp' | 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await axiosInstance.post("/api/auth/reset-password", { email, newPassword });
      setMessage(res.data.message);
      setStep("done");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={
          step === "email"
            ? handleSendOtp
            : step === "otp"
              ? handleVerifyOtp
              : handleResetPassword
        }
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="coderhavali.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-indigo-500"
              required
            />
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              Send OTP
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-indigo-500"
              required
            />
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              Verify OTP
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-indigo-500"
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Reset Password
            </button>
          </>
        )}

        {step === "done" && (
          <p className="text-green-600 text-center">Password reset successfully! You can now log in.</p>
        )}

        {message && <p className="text-blue-600 text-sm text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
      </form>
    </div>
  );
}
