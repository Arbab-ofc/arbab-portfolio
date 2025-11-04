import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiTerminal, FiCode, FiCpu, FiHardDrive, FiPlay, FiPause } from 'react-icons/fi';
import { quotesAPI } from '../utils/api';

const Quotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // Fetch quotes from API
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quotesAPI.getAll();
      const fetchedQuotes = response.data?.data || [];

      if (fetchedQuotes.length === 0) {
        setError('No quotes found in the database.');
      } else {
        setQuotes(fetchedQuotes);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quotes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Detect mobile screen size and fetch quotes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchQuotes(); // Fetch quotes on component mount

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (quotes.length === 0) return; // Don't set up interval if no quotes

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);

    intervalRef.current = interval;

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, [quotes.length]);

  // Pause/resume functionality
  useEffect(() => {
    if (quotes.length === 0) return; // Don't set up interval if no quotes

    if (isPaused) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Only set new interval if there isn't one already
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000);
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, quotes.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (quotes.length === 0) return; // Don't handle navigation if no quotes

      switch (event.key) {
        case 'ArrowLeft':
          setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
          break;
        case 'ArrowRight':
          setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
          break;
        case ' ':
          event.preventDefault();
          setIsPaused(prevPaused => !prevPaused);
          break;
        case 'r':
        case 'R':
          const randomIndex = Math.floor(Math.random() * quotes.length);
          setCurrentIndex(randomIndex);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quotes.length]);

  // Helper function to get icon based on category
  const getIconForCategory = (category) => {
    switch (category) {
      case 'programming':
      case 'development':
        return FiCode;
      case 'technology':
      case 'ai':
        return FiCpu;
      case 'design':
      case 'innovation':
        return FiHardDrive;
      default:
        return FiTerminal;
    }
  };

  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 0,
      scale: 0.8
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: {
      zIndex: 0,
      x: -1000,
      opacity: 0,
      scale: 0.8
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Strong Background - Dark mode compatible */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950"></div>

      {/* Prominent Accents - Responsive sizes */}
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-bl from-amber-400/40 via-yellow-400/20 to-transparent dark:from-amber-500/40 dark:via-yellow-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-yellow-400/40 via-amber-400/20 to-transparent dark:from-yellow-500/40 dark:via-amber-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Luxury Pattern - Responsive background size */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(245, 158, 11, 0.6) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(245, 158, 11, 0.6) 1px, transparent 1px),
            linear-gradient(45deg, rgba(217, 119, 6, 0.5) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(217, 119, 6, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px sm:90px 90px lg:120px 120px',
          backgroundPosition: '0 0, 0 30px 30px 0, 30px 30px sm:0 45px 45px 0, 45px 45px lg:0 60px 60px 0, 60px 60px'
        }}></div>
      </div>

      {/* Subtle Grid - Responsive grid size */}
      <div className="absolute inset-0 opacity-8">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px sm:75px 75px lg:100px 100px'
        }}></div>
      </div>

      {/* Elegant Particles - Reduced for mobile performance */}
      <div className="absolute inset-0">
        {[...Array(isMobile ? 5 : 8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-amber-300/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 95}%`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          ></div>
        ))}
      </div>

      {/* Corner Decorations - Responsive sizes */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 lg:top-10 lg:right-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-4 border-amber-400/30 dark:border-amber-500/30 rounded-tr-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10 w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-amber-400/30 dark:border-amber-500/30 rounded-bl-full animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-xl border border-amber-400/30">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Terminal Quotes
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Code Wisdom Terminal
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
            Programming insights and developer wisdom served in terminal style
          </p>
        </motion.div>

        {/* Main Terminal Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white dark:bg-gray-800 border border-amber-400/50 dark:border-amber-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl"
        >
          {/* Terminal Header */}
          <div className="bg-gray-900 rounded-t-xl sm:rounded-t-2xl overflow-hidden mb-4 sm:mb-6">
            <div className="bg-gray-800 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-mono">
                    <FiTerminal className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="hidden sm:inline">wisdom-terminal.jsx</span>
                    <span className="sm:hidden">wisdom.jsx</span>
                  </div>
                </div>
                <div className="text-gray-500 text-xs font-mono flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">UTF-8 | JavaScript |</span>
                  <span>Q: {loading ? '...' : quotes.length > 0 ? `${currentIndex + 1}/${quotes.length}` : '0/0'}</span>
                  {isPaused && (
                    <span className="text-red-500 animate-pulse font-semibold hidden sm:inline">⏸ PAUSED</span>
                  )}
                  {!isPaused && (
                    <span className="text-green-500 animate-pulse hidden sm:inline flex items-center gap-1.5">
                      <FiPlay className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Terminal Content with Carousel */}
            <div className="bg-gray-900 p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] relative">
              {/* Terminal Grid Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full" style={{
                  backgroundImage: `
                    linear-gradient(to right, #10b981 1px, transparent 1px),
                    linear-gradient(to bottom, #10b981 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px sm:25px 25px lg:30px 30px'
                }}></div>
              </div>

              {/* Command Line */}
              <div className="text-green-500 font-mono text-xs sm:text-sm mb-3 sm:mb-4 lg:mb-6">
                <span className="text-amber-500">$</span> <span className="hidden sm:inline">./wisdom-terminal --load-quotes</span>
                <span className="sm:hidden">./load-quotes</span>
              </div>

              {/* Carousel Area */}
              <div className="relative h-48 sm:h-56 lg:h-64 flex items-center justify-center">
                <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-2">
                  {loading ? (
                    <div className="text-center text-gray-400 font-mono">
                      <div className="animate-pulse">
                        <div className="text-sm sm:text-base mb-2">Loading quotes...</div>
                        <div className="text-xs">Fetching wisdom from database</div>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center">
                      <div className="text-red-400 font-mono text-sm sm:text-base mb-3">{error}</div>
                      <button
                        onClick={fetchQuotes}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-mono text-xs sm:text-sm"
                      >
                        Retry
                      </button>
                    </div>
                  ) : quotes.length === 0 ? (
                    <div className="text-center text-gray-400 font-mono">
                      <div className="text-sm sm:text-base mb-3">No quotes available</div>
                      <div className="text-xs">Check back later for more wisdom!</div>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          duration: isMobile ? 0.4 : 0.6,
                          ease: [0.4, 0, 0.2, 1],
                          x: { type: "spring", stiffness: isMobile ? 400 : 300, damping: 30 },
                          opacity: { duration: isMobile ? 0.3 : 0.4 },
                          scale: { duration: isMobile ? 0.3 : 0.4 }
                        }}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur-sm"
                      >
                        {/* Quote Type Icon */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            {(() => {
                              const Icon = getIconForCategory(quotes[currentIndex].category);
                              return <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-green-500 font-mono text-xs truncate">
                              <span className="text-amber-500">&gt;</span> {quotes[currentIndex].field || 'Technology'}
                            </div>
                            <div className="text-gray-400 font-mono text-xs">
                              <span className="hidden sm:inline">Category:</span>
                              <span className="sm:hidden">Cat:</span> {quotes[currentIndex].category}
                            </div>
                          </div>
                        </div>

                        {/* Quote Text */}
                        <blockquote className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 italic leading-relaxed mb-4 sm:mb-6 font-mono">
                          "{quotes[currentIndex].text}"
                        </blockquote>

                        {/* Code Example */}
                        {quotes[currentIndex].command && (
                          <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                            <div className="text-green-400 font-mono text-xs sm:text-sm truncate">
                              <span className="text-amber-500">$</span> {quotes[currentIndex].command}
                            </div>
                          </div>
                        )}

                        {/* Author */}
                        <div className="flex items-center justify-between">
                          <div className="text-amber-500 font-mono text-xs sm:text-sm truncate flex-1 mr-2">
                            <span className="text-gray-500">//</span> — {quotes[currentIndex].author}
                          </div>
                          <div className="text-gray-600 font-mono text-xs whitespace-nowrap">
                            [{currentIndex + 1}]
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Auto-rotating Progress Indicator */}
              {!loading && !error && quotes.length > 0 && (
                <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-4 sm:mt-6 lg:mt-8">
                  {quotes.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                        index === currentIndex
                          ? 'bg-amber-500 w-4 sm:w-6 lg:w-8'
                          : 'bg-gray-600 hover:bg-gray-500 w-1.5 sm:w-2'
                      }`}
                      whileHover={{ scale: isMobile ? 1.1 : 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to quote ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Terminal Footer */}
              <div className="mt-4 sm:mt-6 lg:mt-8 pt-2 sm:pt-4 border-t border-gray-800">
                <div className={`font-mono text-xs sm:text-sm ${isPaused ? 'text-red-500' : 'text-green-500'}`}>
                  <span className="text-amber-500">$</span> echo <span className="hidden sm:inline">"Auto-rotation {isPaused ? 'STOPPED' : 'RUNNING'} - 5s interval {isPaused ? '(PAUSED)' : '(ACTIVE)'}"</span>
                  <span className="sm:hidden">"{isPaused ? 'STOPPED' : 'ACTIVE'} - 5s {isPaused ? '(PAUSED)' : '(RUNNING)'}"</span>
                </div>
                <div className="text-gray-600 font-mono text-xs mt-1 sm:mt-2">
                  <span className="hidden sm:inline">// Terminal wisdom system {loading ? 'loading' : quotes.length > 0 ? `active - Quotes ${currentIndex + 1}/${quotes.length} | Current: ${currentIndex}` : 'inactive - No quotes available'}</span>
                  <span className="sm:hidden">// {loading ? 'Loading...' : quotes.length > 0 ? `Active: ${currentIndex + 1}/${quotes.length}` : 'No quotes'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls - Luxury Styled */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            <button
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length)}
              disabled={loading || error || quotes.length === 0}
              className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 dark:from-amber-700 dark:via-yellow-700 dark:to-amber-800 text-white rounded-xl sm:rounded-2xl hover:from-amber-700 hover:via-yellow-700 hover:to-amber-800 dark:hover:from-amber-800 dark:hover:via-yellow-800 dark:hover:to-amber-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 dark:hover:shadow-amber-400/20 font-bold text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400/20 dark:border-amber-600/30 overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Button Icon & Text */}
              <span className="relative flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              disabled={loading || error || quotes.length === 0}
              className={`group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed border overflow-hidden ${
                isPaused
                  ? 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 dark:from-emerald-700 dark:via-green-600 dark:to-emerald-800 hover:from-emerald-700 hover:via-green-600 hover:to-emerald-800 dark:hover:from-emerald-800 dark:hover:via-green-700 dark:hover:to-emerald-900 hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20 text-white border-emerald-400/20 dark:border-emerald-600/30 rounded-xl sm:rounded-2xl'
                  : 'bg-gradient-to-r from-rose-600 via-pink-500 to-rose-700 dark:from-rose-700 dark:via-pink-600 dark:to-rose-800 hover:from-rose-700 hover:via-pink-600 hover:to-rose-800 dark:hover:from-rose-800 dark:hover:via-pink-700 dark:hover:to-rose-900 hover:shadow-rose-500/20 dark:hover:shadow-rose-400/20 text-white border-rose-400/20 dark:border-rose-600/30 rounded-xl sm:rounded-2xl'
              }`}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Button Icon & Text */}
              <span className="relative flex items-center gap-2">
                {isPaused ? (
                  <FiPlay className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                ) : (
                  <>
                    <FiPause className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <span className="hidden sm:inline ml-2 font-mono text-xs">Pause</span>
                  </>
                )}
              </span>
            </button>

            <button
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length)}
              disabled={loading || error || quotes.length === 0}
              className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 dark:from-amber-700 dark:via-yellow-700 dark:to-amber-800 text-white rounded-xl sm:rounded-2xl hover:from-amber-700 hover:via-yellow-700 hover:to-amber-800 dark:hover:from-amber-800 dark:hover:via-yellow-800 dark:hover:to-amber-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 dark:hover:shadow-amber-400/20 font-bold text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400/20 dark:border-amber-600/30 overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Button Icon & Text */}
              <span className="relative flex items-center gap-2">
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                setCurrentIndex(randomIndex);
              }}
              disabled={loading || error || quotes.length === 0}
              className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 dark:from-indigo-700 dark:via-purple-700 dark:to-violet-800 text-white rounded-xl sm:rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-violet-800 dark:hover:from-indigo-800 dark:hover:via-purple-800 dark:hover:to-violet-900 transition-all duration-500 shadow-lg hover:shadow-3xl hover:shadow-purple-500/30 dark:hover:shadow-purple-400/40 font-bold text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 dark:border-purple-600/40 overflow-hidden"
            >
              {/* Multi-layered Luxury Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Inner Luxury Border */}
              <div className="absolute inset-[1px] bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-purple-600/20 rounded-xl sm:rounded-2xl"></div>

              {/* Sparkle Effects */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 animate-ping duration-1000"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 animate-ping duration-1000 delay-300"></div>
              <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping duration-1000 delay-500"></div>

              {/* Professional Icon */}
              <span className="relative flex items-center gap-2 z-10">
                <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                  {/* Shuffle Symbol */}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="hidden sm:inline tracking-wide">Surprise</span>
                <span className="sm:hidden font-mono text-xs">Any</span>
              </span>

              {/* Hover text glow */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="text-white/20 text-lg font-bold scale-110 animate-pulse">✨</div>
              </div>
            </button>

            {error && (
              <button
                onClick={fetchQuotes}
                className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 dark:from-orange-700 dark:via-red-600 dark:to-orange-800 text-white rounded-xl sm:rounded-2xl hover:from-orange-700 hover:via-red-600 hover:to-orange-800 dark:hover:from-orange-800 dark:hover:via-red-700 dark:hover:to-orange-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 dark:hover:shadow-orange-400/20 font-bold text-xs sm:text-sm lg:text-base border border-orange-400/20 dark:border-orange-600/30 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                {/* Button Icon & Text */}
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">Reload</span>
                  <span className="sm:hidden">🔄</span>
                </span>
              </button>
            )}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-6 sm:mt-8 text-center hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              <span className="font-mono">←</span> Previous
              <span className="text-gray-400">|</span>
              <span className="font-mono">→</span> Next
              <span className="text-gray-400">|</span>
              <span className="font-mono">Space</span> Pause/Play
              <span className="text-gray-400">|</span>
              <span className="font-mono">R</span> Random
            </div>
          </div>

          {/* Mobile Keyboard Hint */}
          <div className="mt-4 sm:mt-6 text-center lg:hidden">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Use arrow keys & spacebar
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quotes;