import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ToastContainer, toast } from "react-toastify";
import logo from "../images/terra-skin-logo.png";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session
    const checkSession = async () => {
      // Give Supabase a moment to process the hash token from the URL
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };
    checkSession();
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative font-['Inter']">
      {/* Background Video (Same as Login) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4" type="video/mp4" />
      </video>

      <nav className="relative z-10 flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src={logo} alt="TerraSkin Logo" className="h-[70px] w-auto filter brightness-0 invert" />
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-100px)]">
        <div className="liquid-glass w-full max-w-md p-8 rounded-2xl animate-fade-rise">
          <h2 className="text-3xl text-white font-['Instrument_Serif'] mb-6 text-center">Set New Password</h2>
          <form onSubmit={handleReset} className="space-y-5 text-left">
            <div>
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-lg transition-colors border border-white/20 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default ResetPassword;
