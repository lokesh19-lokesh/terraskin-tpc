import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <img
              src={logo}
              alt="TerraSkin Logo"
              className="h-[80px] w-auto mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the power of premium skincare with our scientifically-formulated products.
              Transform your routine and reveal your skin's natural radiance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#8d4745] transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8d4745] transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8d4745] transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-[#8d4745] flex-shrink-0 mt-1" />
                <span className="text-sm">
                  D.no: 28-6-755, Housing Board, near RTO office, 515001, Anantapur, Andhrapradesh
                </span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-[#8d4745] flex-shrink-0" />
                <span className="text-sm">9836985999</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-[#8d4745] flex-shrink-0" />
                <span className="text-sm">info@terraskin.in</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:gap-4 lg:grid-cols-1">
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay in the Loop</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers and skincare tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d4745] text-sm"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-[#8d4745] text-white p-1.5 rounded-md hover:bg-[#7a3f3d] transition-colors duration-300"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom section (Navbar color background) */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs space-y-4 md:space-y-0 text-center md:text-left font-medium">
            <div>
              © 2025 Terra Skin. All rights reserved.
            </div>
            <div>
              Designed by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#8d4745] transition-colors duration-200">The Patterns Company</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;