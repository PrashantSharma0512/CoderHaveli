import { useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router";
import { FiMail, FiLock, FiKey, FiArrowRight } from "react-icons/fi";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // 'email' | 'otp' | 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/api/auth/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/api/auth/reset-password", { email, newPassword });
      setMessage(res.data.message);
      setStep("done");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
      <div className="w-full max-w-md px-4">
        <div className="bg-white dark:bg-blue-900 rounded-xl shadow-lg overflow-hidden border border-amber-200 dark:border-blue-700">
          <div className="bg-amber-100 dark:bg-blue-800 p-6 text-center border-b border-amber-200 dark:border-blue-700">
            <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-100">Password Recovery</h2>
            <p className="text-amber-600 dark:text-amber-200 mt-1">
              {step === "email" && "Enter your email to get started"}
              {step === "otp" && "Check your email for the OTP"}
              {step === "reset" && "Create your new password"}
              {step === "done" && "Password reset successfully!"}
            </p>
          </div>

          <form
            onSubmit={
              step === "email"
                ? handleSendOtp
                : step === "otp"
                ? handleVerifyOtp
                : handleResetPassword
            }
            className="p-6 space-y-6"
          >
            {/* Step indicators */}
            <div className="flex justify-between items-center">
              {["email", "otp", "reset"].map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === s
                        ? "bg-amber-500 text-white"
                        : step === "done" || ["email", "otp", "reset"].indexOf(step) > i
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-blue-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 capitalize">{s}</span>
                </div>
              ))}
            </div>

            {/* Email Step */}
            {step === "email" && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-amber-500 dark:text-amber-300" />
                  </div>
                  <input
                    type="email"
                    placeholder="your@coderhaveli.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-blue-800 border border-amber-200 dark:border-blue-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent dark:focus:ring-amber-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-blue-900"
                >
                  {isLoading ? (
                    <span className="animate-spin mr-2">↻</span>
                  ) : (
                    <FiArrowRight className="mr-2" />
                  )}
                  Send OTP
                </button>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-amber-500 dark:text-amber-300" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-blue-800 border border-amber-200 dark:border-blue-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent dark:focus:ring-amber-300"
                    required
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-blue-900"
                >
                  {isLoading ? (
                    <span className="animate-spin mr-2">↻</span>
                  ) : (
                    <FiArrowRight className="mr-2" />
                  )}
                  Verify OTP
                </button>
              </div>
            )}

            {/* Reset Password Step */}
            {step === "reset" && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-amber-500 dark:text-amber-300" />
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-blue-800 border border-amber-200 dark:border-blue-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent dark:focus:ring-amber-300"
                    required
                    minLength={8}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-amber-500 dark:text-amber-300" />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-blue-800 border border-amber-200 dark:border-blue-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent dark:focus:ring-amber-300"
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-blue-900"
                >
                  {isLoading ? (
                    <span className="animate-spin mr-2">↻</span>
                  ) : (
                    <FiArrowRight className="mr-2" />
                  )}
                  Reset Password
                </button>
              </div>
            )}

            {/* Success Message */}
            {step === "done" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-100 mb-2">Password Reset Successful!</h3>
                <p className="text-gray-600 dark:text-blue-200">
                  You'll be redirected to login page shortly...
                </p>
              </div>
            )}

            {/* Messages */}
            {message && (
              <div className="p-3 bg-amber-100 dark:bg-blue-800 text-amber-800 dark:text-amber-100 rounded-lg text-sm border border-amber-200 dark:border-blue-700">
                {message}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-700">
                {error}
              </div>
            )}

            {/* Back to login link */}
            {step !== "done" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100 text-sm font-medium transition duration-200"
                >
                  ← Back to login
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}