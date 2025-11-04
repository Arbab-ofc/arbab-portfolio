import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/', priority: 1 },
    { name: 'About', path: '/about', priority: 2 },
    { name: 'Projects', path: '/projects', priority: 3 },
    { name: 'Skills', path: '/skills', priority: 4 },
    { name: 'Experience', path: '/experience', priority: 5 },
    { name: 'Blog', path: '/blog', priority: 6 },
    { name: 'Quotes', path: '/quotes', priority: 7 },
    { name: 'Contact', path: '/contact', priority: 8 },
  ];

  // Progressive navigation items based on screen size
  const getVisibleNavLinks = () => {
    const width = windowSize.width;
    // For small screens (< 640px): show essential items only
    if (width < 640) {
      return navLinks.filter(link => link.priority <= 3); // Home, About, Projects
    }
    // For large mobile (640px - 1024px): show more items but still use hamburger menu
    if (width < 1024) {
      return navLinks.filter(link => link.priority <= 5); // Home, About, Projects, Skills, Experience
    }
    // For small desktop (1024px - 1280px): show all items
    if (width < 1280) {
      return navLinks; // All items
    }
    // For large desktop (≥1280px): show all items
    return navLinks;
  };

  const getSocialLinksVisibility = () => {
    const width = windowSize.width;
    if (width < 1024) return 'hidden'; // Mobile and tablet: hidden
    return 'flex'; // Desktop: show
  };

  const getNavButtonVisibility = () => {
    const visibleLinks = getVisibleNavLinks();
    // Show mobile button if not all links are visible
    return visibleLinks.length < navLinks.length ? 'flex' : 'hidden';
  };

  // Determine which links to show in mobile menu
  const getMobileMenuLinks = () => {
    const width = windowSize.width;
    // For mobile and tablets (< 1024px): show all navigation items in mobile menu
    if (width < 1024) {
      return navLinks; // Show all items for mobile and tablets
    }
    // For desktop (≥1024px): show only hidden items (but menu won't be visible anyway)
    return navLinks.filter(link => !getVisibleNavLinks().some(visibleLink => visibleLink.path === link.path));
  };

  // Determine if social links should be shown in mobile menu
  const getShowSocialLinksInMobileMenu = () => {
    const width = windowSize.width;
    // Show social links in mobile menu for mobile and tablets
    return width < 1024;
  };

  const getNavSpacing = () => {
    const width = windowSize.width;
    if (width < 640) return 'space-x-1'; // Small mobile
    if (width < 768) return 'space-x-1'; // Large mobile
    if (width < 1024) return 'space-x-1'; // Large mobile - still limited items
    if (width < 1280) return 'space-x-3'; // Small desktop
    return 'space-x-4'; // Large desktop
  };

  const getNavTextSize = () => {
    const width = windowSize.width;
    if (width < 640) return 'text-xs'; // Small mobile
    if (width < 768) return 'text-xs'; // Large mobile
    if (width < 1024) return 'text-sm'; // Tablet
    return 'text-sm'; // Desktop
  };

  const getNavPadding = () => {
    const width = windowSize.width;
    if (width < 640) return 'px-2 py-1'; // Small mobile
    if (width < 768) return 'px-2 py-1'; // Large mobile
    if (width < 1024) return 'px-2 py-1'; // Large mobile
    return 'px-3 py-2'; // Desktop
  };

  const socialLinks = [
    { icon: FiGithub, url: 'https://github.com/Arbab-ofc', label: 'GitHub' },
    { icon: FiLinkedin, url: 'https://www.linkedin.com/in/arbab-ofc/', label: 'LinkedIn' },
    { icon: FiMail, url: 'mailto:arbabprvt@gmail.com', label: 'Email' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Arbab Arshad
            </motion.div>
          </Link>

          {/* Responsive Navigation */}
          <div className={`items-center ${getNavSpacing()} ${getNavButtonVisibility() === 'hidden' ? 'flex' : 'hidden'} lg:flex xl:flex`}>
            {getVisibleNavLinks().map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`${getNavPadding()} rounded-lg ${getNavTextSize()} font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Social Links - Progressive Display */}
          <div className={`${getSocialLinksVisibility()} items-center space-x-2 sm:space-x-3 lg:space-x-4`}>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label={social.label}
              >
                <social.icon size={windowSize.width < 640 ? 18 : 20} />
              </motion.a>
            ))}
          </div>

          {/* Mobile/Tablet menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${getNavButtonVisibility()} p-2 sm:p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FiX size={windowSize.width < 640 ? 20 : 24} /> : <FiMenu size={windowSize.width < 640 ? 20 : 24} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-xl"
          >
            <div className={`px-4 sm:px-6 py-4 sm:py-6 space-y-1 sm:space-y-2 max-h-[70vh] overflow-y-auto`}>
              {/* Show appropriate links based on screen size */}
              {getMobileMenuLinks().map((link) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 sm:py-4 rounded-lg ${getNavTextSize()} sm:text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Theme selector card for mobile menu */}
              {getShowSocialLinksInMobileMenu() && (
                <div className="pt-4 sm:pt-6 border-t dark:border-gray-800">
                  <PremiumThemeToggle variant="card" className="w-full" />
                </div>
              )}

            {/* Social links section - show for mobile and tablets in hamburger menu */}
              {getShowSocialLinksInMobileMenu() && (
                <div className={`flex items-center justify-center space-x-6 sm:space-x-8 pt-4 sm:pt-6 border-t dark:border-gray-800`}>
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon size={windowSize.width < 640 ? 20 : 24} />
                    </motion.a>
                  ))}
                </div>
              )}

              {/* Touch-friendly close button for mobile */}
              <div className="flex justify-center pt-2 sm:hidden">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Close Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
