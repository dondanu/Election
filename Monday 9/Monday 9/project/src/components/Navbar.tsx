import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart2, Info, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#00224D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/Logo.png" alt="Logo" className="h-12 w-auto" />
              <span className="ml-2 text-xl font-semibold">Sri Lanka Election System</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003366] flex items-center">
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link to="/results" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003366] flex items-center">
              <BarChart2 className="h-5 w-5 mr-1" />
              Results
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003366] flex items-center">
              <Info className="h-5 w-5 mr-1" />
              About
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003366] flex items-center">
              <Settings className="h-5 w-5 mr-1" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;