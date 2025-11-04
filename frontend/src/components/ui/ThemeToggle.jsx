import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '', variant = 'toggle' }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark, isLight, isSystem } = useTheme();

  // Icon variants with smooth animations
  const iconVariants = {
    light: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    dark: {
      rotate: 180,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const backgroundVariants = {
    light: {
      backgroundColor: '#fbbf24',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    dark: {
      backgroundColor: '#1e293b',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  // Simple toggle button variant
  if (variant === 'toggle') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          variants={backgroundVariants}
          animate={resolvedTheme}
          className="absolute inset-0 rounded-full"
        />
        <motion.div
          variants={iconVariants}
          animate={resolvedTheme}
          className="relative z-10"
        >
          {isDark ? (
            <MoonIcon className="h-5 w-5 text-slate-200" />
          ) : (
            <SunIcon className="h-5 w-5 text-slate-700" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  // Dropdown selector variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
        >
          <motion.div
            variants={iconVariants}
            animate={resolvedTheme}
            className="h-4 w-4"
          >
            {isSystem ? (
              <ComputerDesktopIcon className="h-4 w-4" />
            ) : isDark ? (
              <MoonIcon className="h-4 w-4" />
            ) : (
              <SunIcon className="h-4 w-4" />
            )}
          </motion.div>
          <span className="hidden xs:inline">
            {isSystem ? 'System' : isDark ? 'Dark' : 'Light'}
          </span>
        </motion.button>

        {/* Dropdown menu would go here if needed */}
      </div>
    );
  }

  // Minimal button variant
  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        variants={iconVariants}
        animate={resolvedTheme}
      >
        {isDark ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;