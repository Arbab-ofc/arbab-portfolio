import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

const PremiumThemeToggle = ({ variant = 'premium', className = '', showLabel = false }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark, isLight, isSystem } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + Shift + T for quick toggle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
      // Escape to close dropdown
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, toggleTheme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    setIsAnimating(true);
    setTheme(newTheme);
    setTimeout(() => setIsAnimating(false), 300);
    setIsOpen(false);
  };

  // Theme options with descriptions
  const themeOptions = [
    {
      value: 'light',
      icon: SunIcon,
      label: 'Light',
      description: 'Bright and clean interface',
      gradient: 'from-amber-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      textColor: 'text-amber-900'
    },
    {
      value: 'dark',
      icon: MoonIcon,
      label: 'Dark',
      description: 'Easy on the eyes',
      gradient: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-slate-900 to-purple-900',
      textColor: 'text-purple-200'
    },
    {
      value: 'system',
      icon: ComputerDesktopIcon,
      label: 'System',
      description: 'Follow your device',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900',
      textColor: 'text-blue-900 dark:text-blue-200'
    }
  ];

  const currentThemeOption = themeOptions.find(option => option.value === theme) || themeOptions[2];

  // Premium toggle button variant
  if (variant === 'premium') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
            isDark
              ? 'bg-white/10 border-white/20 hover:bg-white/15 text-white shadow-lg hover:shadow-white/10'
              : 'bg-black/5 border-black/10 hover:bg-black/10 text-gray-800 shadow-lg hover:shadow-black/5'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                : 'linear-gradient(135deg, #f59e0b, #ef4444)'
            }}
          />

          {/* Icon container with animation */}
          <motion.div
            className="relative z-10"
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={resolvedTheme}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex items-center justify-center w-5 h-5"
              >
                {isSystem ? (
                  <ComputerDesktopIcon className="w-5 h-5" />
                ) : isDark ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Label text */}
          <div className="relative z-10 text-left">
            <div className="text-sm font-medium">
              {currentThemeOption.label}
            </div>
            {showLabel && (
              <div className="text-xs opacity-70">
                {currentThemeOption.description}
              </div>
            )}
          </div>

          {/* Dropdown indicator */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            <ChevronDownIcon className="w-4 h-4 opacity-70" />
          </motion.div>

          {/* Sparkle effect */}
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6 }}
            >
              <SparklesIcon className="w-full h-full text-yellow-400" />
            </motion.div>
          )}
        </motion.button>

        {/* Premium dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl backdrop-blur-2xl border shadow-2xl overflow-hidden ${
                isDark
                  ? 'bg-slate-900/95 border-white/10 shadow-black/50'
                  : 'bg-white/95 border-gray-200 shadow-black/20'
              }`}
            >
              <div className="p-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? `${option.bgColor} ${option.textColor} shadow-lg`
                          : isDark
                            ? 'hover:bg-white/10 text-white/80 hover:text-white'
                            : 'hover:bg-black/5 text-gray-700 hover:text-gray-900'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Icon with gradient */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${option.gradient} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Theme info */}
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className={`text-xs ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                          {option.description}
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Keyboard shortcut hint */}
              <div className={`px-3 py-2 border-t text-xs ${
                isDark ? 'border-white/10 text-white/50' : 'border-gray-200 text-gray-500'
              }`}>
                Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70 font-mono">
                  ⌘⇧T
                </kbd> to toggle quickly
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Compact rich toggle variant
  if (variant === 'compact-rich') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={`relative group flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md transition-all duration-300 ${
          isDark
            ? 'bg-white/10 border border-white/20 hover:bg-white/15 text-white'
            : 'bg-black/5 border border-black/10 hover:bg-black/10 text-gray-800'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          className="relative"
          animate={{ rotate: isAnimating ? 360 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedTheme}
              initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              {isDark ? (
                <MoonIcon className="w-4 h-4" />
              ) : (
                <SunIcon className="w-4 h-4" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <span className="text-xs font-medium">
          {isDark ? 'Dark' : 'Light'}
        </span>

        {/* Subtle glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
            isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
          }`}
        />
      </motion.button>
    );
  }

  // Advanced card variant
  if (variant === 'card') {
    return (
      <div className={`relative p-4 rounded-2xl backdrop-blur-xl border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-black/5 border-black/10'
      } ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-80">Theme</span>
          <motion.div
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={resolvedTheme}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-5 h-5"
              >
                {isSystem ? (
                  <ComputerDesktopIcon className="w-5 h-5" />
                ) : isDark ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <motion.button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${option.bgColor} ${option.textColor} shadow-lg scale-105`
                    : isDark
                      ? 'hover:bg-white/10 text-white/60 hover:text-white'
                      : 'hover:bg-black/5 text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${option.gradient} text-white`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default premium toggle
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative group p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${
        isDark
          ? 'bg-white/10 border border-white/20 hover:bg-white/15 text-white shadow-lg'
          : 'bg-black/5 border border-black/10 hover:bg-black/10 text-gray-800 shadow-lg'
      }`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: -5 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="relative"
        animate={{ rotate: isAnimating ? 360 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isDark ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)'
            : 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)'
        }}
      />

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: isAnimating ? [0, 2] : 0, opacity: isAnimating ? [1, 0] : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'
        }}
      />
    </motion.button>
  );
};

export default PremiumThemeToggle;