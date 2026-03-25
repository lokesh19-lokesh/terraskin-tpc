// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import logo from "../images/terra-skin-logo.png";

// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { state } = useCart();
//   const location = useLocation();

//   const navigation = [
//     { name: 'Home', href: '/' },
//     { name: 'Shop', href: '/shop' },
//     { name: 'About', href: '/about' },
//     { name: 'Contact', href: '/contact' }
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <header className="bg-white shadow-sm fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}

//           <Link to="/" className="flex items-center">
//             <img
//               src={logo}
//               alt="TerraSkin Logo"
//               className="h-[70px] w-auto"
//             />
//           </Link>


//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`${isActive(item.href)
//                   ? 'text-[#8d4745] border-b-2 border-[#8d4745]'
//                   : 'text-gray-700 hover:text-[#8d4745]'
//                   } px-3 py-2 text-sm font-medium transition-colors duration-200`}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Right side actions */}
//           <div className="flex items-center space-x-4">
//             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
//               <Search className="h-5 w-5 text-gray-700" />
//             </button>
//             {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
//               <User className="h-5 w-5 text-gray-700" />
//             </button> */}
//             <Link
//               to="/login"
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//             >
//               <User className="h-5 w-5 text-gray-700" />
//             </Link>

//             <Link
//               to="/cart"
//               className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//             >
//               <ShoppingCart className="h-5 w-5 text-gray-700" />
//               {state.itemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#8d4745] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {state.itemCount}
//                 </span>
//               )}
//             </Link>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white border-t">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`${isActive(item.href)
//                   ? 'text-[#8d4745] bg-gray-50'
//                   : 'text-gray-700 hover:text-[#8d4745] hover:bg-gray-50'
//                   } block px-3 py-2 text-base font-medium transition-colors duration-200`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from "react-toastify";
import logo from "../images/terra-skin-logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { state } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    toast.success("✅ Logged out successfully!", { autoClose: 2000 });
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <img src={logo} alt="TerraSkin Logo" className="h-[70px] w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${isActive(item.href)
                  ? 'text-[#8d4745] border-b-2 border-[#8d4745]'
                  : 'text-gray-700 hover:text-[#8d4745]'
                  } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            {/* User icon */}
            {!isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <User className="h-5 w-5 text-gray-700" />
                </button>

                {userMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-32 z-50">
                    <div className="bg-white shadow-lg rounded-md flex flex-col overflow-hidden border border-gray-100 divide-y divide-gray-100">
                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8d4745] transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8d4745] transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <User className="h-5 w-5 text-gray-700" />
                </button>

                {userMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-32 z-50">
                    <div className="bg-white shadow-lg rounded-md flex flex-col overflow-hidden border border-gray-100 divide-y divide-gray-100">
                      <Link
                        to="/orders"
                        className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8d4745] transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8d4745] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8d4745] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${isActive(item.href)
                  ? 'text-[#8d4745] bg-gray-50'
                  : 'text-gray-700 hover:text-[#8d4745] hover:bg-gray-50'
                  } block px-3 py-2 text-base font-medium transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
