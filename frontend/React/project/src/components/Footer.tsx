import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sri Lanka Election System</h3>
            <p className="text-sm text-gray-300">
              The official website for Sri Lankan Local Government Election results and information.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-300 hover:text-white">Home</a>
              </li>
              <li>
                <a href="/results" className="text-sm text-gray-300 hover:text-white">Election Results</a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-300 hover:text-white">About Elections</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white">Election Laws</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">Election Commission of Sri Lanka</li>
              <li className="text-sm text-gray-300">
                <a href="mailto:info@elections.gov.lk" className="hover:text-white">
                  info@elections.gov.lk
                </a>
              </li>
              <li className="text-sm text-gray-300">+94 11 2868441</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>© 2025 Election Commission of Sri Lanka. All rights reserved.</p>
          <a href="https://results.elections.gov.lk/index.php" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-300 hover:text-white mt-2">
            Official Website <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;