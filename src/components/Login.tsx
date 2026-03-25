import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/terra-skin-logo.png";
import { ToastContainer, toast } from "react-toastify";
import { supabase } from "../lib/supabase";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      localStorage.setItem("loggedIn", "true");
      
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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

        <button 
          onClick={() => setShowForm(!showForm)}
          className="liquid-glass text-white rounded-full px-6 py-2.5 text-sm hover:scale-[1.03] transition-transform"
        >
          {showForm ? "Back" : "Login"}
        </button>
      </nav>

      {/* Hero Content / Form relative z-10 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 min-h-[calc(100vh-100px)]">
        
        {!showForm ? (
          <>
            <h1 className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl text-white font-['Instrument_Serif'] animate-fade-rise">
              Reconnect Your Skin To Nature
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-white animate-fade-rise-delay">
              Experience the difference of premium, science-backed formulas. We blend natural ingredients with clinical expertise to reveal your skin’s true, healthy radiance.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="liquid-glass text-white rounded-full px-14 py-5 text-base mt-12 hover:scale-[1.03] transition-transform animate-fade-rise-delay-2"
            >
              Login
            </button>
          </>
        ) : (
          <div className="liquid-glass w-full max-w-md p-8 rounded-2xl animate-fade-rise">
            <h2 className="text-3xl text-white font-['Instrument_Serif'] mb-6 text-center">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-5 text-left">
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
                Login
              </button>
            </form>
            <p className="text-center text-white/80 text-sm mt-6">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-white font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default Login;
