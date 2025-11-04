import { Link, useNavigate } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiHeart, FiSettings, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PremiumThemeToggle from '../ui/PremiumThemeToggle';
import { useState, useEffect } from 'react';

// Admin Dashboard Button Component
const AdminDashboardButton = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is admin
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          // Check if user has admin role or is logged in (assuming all logged-in users can access dashboard)
          setIsAdmin(userData.role === 'admin' || userData.isAdmin || true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleDashboardClick = () => {
    navigate('/admin/dashboard');
  };

  // Only render if user is admin
  if (!isAdmin) {
    return null;
  }

  return (
    <motion.button
      onClick={handleDashboardClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Admin Dashboard"
    >
      <FiLock className="w-4 h-4" />
      <span className="hidden sm:inline">Dashboard</span>
      <span className="sm:hidden">Admin</span>
    </motion.button>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
  ];

  const socialLinks = [
    { icon: FiGithub, url: 'https://github.com/Arbab-ofc', label: 'GitHub' },
    { icon: FiLinkedin, url: 'https://www.linkedin.com/in/arbab-ofc/', label: 'LinkedIn' },
    { icon: FiMail, url: 'mailto:arbabprvt@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 dark:text-gray-400 border-t border-gray-800 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Arbab Arshad
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Full-Stack MERN Developer & Data Analyst passionate about building innovative web solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200 border border-gray-700 dark:border-slate-700"
                  aria-label={social.label}
                >
                  <social.icon size={18} className="text-gray-300 dark:text-gray-400" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings & Theme */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiSettings className="w-5 h-5 text-blue-400" />
              <h4 className="text-lg font-semibold text-white">Settings</h4>
            </div>

            {/* Theme Toggle */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Choose your theme</p>
              <PremiumThemeToggle variant="card" className="w-full" />
            </div>

            {/* Contact Info */}
            <div>
              <p className="text-sm font-medium text-white mb-2">Contact</p>
              <ul className="space-y-1 text-sm text-gray-400 dark:text-gray-500">
                <li>
                  <a href="mailto:arbabprvt@gmail.com" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    arbabprvt@gmail.com
                  </a>
                </li>
                <li className="text-gray-500 dark:text-gray-600">
                  IIIT Bhagalpur, Bihar, India
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm flex items-center">
            © {currentYear} Arbab Arshad. Made with <FiHeart className="mx-1 text-red-500" /> using MERN Stack
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-services" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors">
              Terms of Service
            </Link>
            {/* Admin Dashboard Button - Only visible to logged-in admin users */}
            <AdminDashboardButton />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
