import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import logo from "../images/terra-skin-logo.png"

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
   <footer className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Brand & Newsletter */}
      <div className="lg:col-span-2">
        {/* Logo */}
        <img
          src={logo}
          alt="LuxeSkin Logo"
          className="h-[100px] w-auto mb-4" // keep only bottom margin
        />

        {/* Brand text */}
        <p  className="text-gray-300 footer-text max-w-md">
          Discover the power of premium skincare with our scientifically-formulated products.
          Transform your routine and reveal your skin's natural radiance.
        </p>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Stay in the Loop</h4>
          <form onSubmit={handleNewsletterSubmit} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#8d4745]"
              required
            />
            <button
              type="submit"
              className="bg-[#8d4745] text-white px-6 py-2 rounded-r-md hover:bg-[#7a3f3d] transition-colors duration-300 flex items-center"
            >
              <Mail className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              Shop All
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>

      {/* Customer Care */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Products</h4>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              SkinCare
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              SunScreen
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              BodySkin
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
              Moisturizers
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom section */}
    <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
      <div className="text-gray-300 text-sm mb-4 md:mb-0">
        © 2025 The Patterns Company. All rights reserved.
      </div>

      {/* Social Media */}
      <div className="flex space-x-4">
        <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
          <Facebook className="h-5 w-5" />
        </a>
        <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
          <Instagram className="h-5 w-5" />
        </a>
        <a href="#" className="text-gray-300 hover:text-[#8d4745] transition-colors duration-200">
          <Twitter className="h-5 w-5" />
        </a>
      </div>
    </div>
  </div>
</footer>

  );
};

export default Footer;