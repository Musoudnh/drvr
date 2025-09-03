import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>&copy; 2025 FinanceFlow. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;