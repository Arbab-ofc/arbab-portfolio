import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

const FloatingThemeToggle = () => {
  const { theme, resolvedTheme, setTheme, isDark, isLight, isSystem } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show floating toggle after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsExpanded(false);
  };

  const themeOptions = [
    {
      value: 'light',
      icon: SunIcon,
      label: 'Light',
      description: 'Bright interface',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      value: 'dark',
      icon: MoonIcon,
      label: 'Dark',
      description: 'Easy on eyes',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      value: 'system',
      icon: ComputerDesktopIcon,
      label: 'System',
      description: 'Auto detect',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute bottom-full right-0 mb-3 p-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              isDark
                ? 'bg-slate-900/95 border-slate-700 shadow-black/50'
                : 'bg-white/95 border-gray-200 shadow-black/20'
            }`}
          >
            <div className="space-y-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full ${
                      isActive
                        ? `${isDark ? 'bg-slate-800' : 'bg-gray-100'} ${isDark ? 'text-white' : 'text-gray-900'} shadow-lg`
                        : isDark
                          ? 'hover:bg-slate-800 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${option.gradient} text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className={`text-xs ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                        {option.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Keyboard shortcut hint */}
            <div className={`text-xs px-3 py-2 rounded-lg border-t ${
              isDark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500'
            }`}>
              Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70 font-mono text-xs">
                ⌘⇧T
              </kbd> to toggle
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative group flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-xl border-2 shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/90 border-slate-600 hover:bg-slate-800 text-white shadow-slate-900/50'
            : 'bg-white/90 border-gray-300 hover:bg-gray-50 text-gray-800 shadow-gray-900/20'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Theme Settings"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)'
              : 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)'
          }}
        />

        {/* Theme Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? 'expanded' : resolvedTheme}
              initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {isExpanded ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <>
                  {isSystem ? (
                    <ComputerDesktopIcon className="w-6 h-6" />
                  ) : isDark ? (
                    <MoonIcon className="w-6 h-6" />
                  ) : (
                    <SunIcon className="w-6 h-6" />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Pulse animation for visibility */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-current opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    </div>
  );
};

export default FloatingThemeToggle;