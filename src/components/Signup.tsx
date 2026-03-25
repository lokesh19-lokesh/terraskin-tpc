import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/terra-skin-logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Save user to localStorage (replace with API call in real app)
    localStorage.setItem("user", JSON.stringify({ email, password }));

    // Show toast notification
    toast.success("Signup successful! Please log in.", {
      position: "top-right",
      autoClose: 3000,
    });

    // Redirect after a short delay to allow toast to show
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative font-['Inter']">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4" type="video/mp4" />
      </video>

      {/* Navbar relative z-10 */}
      <nav className="relative z-10 flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src={logo} alt="TerraSkin Logo" className="h-[70px] w-auto filter brightness-0 invert" />
        </div>
        
        <div className="hidden md:flex text-sm text-white gap-10">
          <Link to="/login-about" className="hover:opacity-80 transition-opacity cursor-pointer">About</Link>
          <Link to="/login-contact" className="hover:opacity-80 transition-opacity cursor-pointer">Reach Us</Link>
        </div>

        <Link 
          to="/login"
          className="liquid-glass text-white rounded-full px-6 py-2.5 text-sm hover:scale-[1.03] transition-transform"
        >
          Back
        </Link>
      </nav>

      {/* Form relative z-10 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 min-h-[calc(100vh-100px)]">
        
        <div className="liquid-glass w-full max-w-md p-8 rounded-2xl animate-fade-rise">
          <h2 className="text-3xl text-white font-['Instrument_Serif'] mb-6 text-center">Join TerraSkin</h2>
          <form onSubmit={handleSignup} className="space-y-5 text-left">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-lg transition-colors border border-white/20"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-white/80 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>

      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default Signup;
