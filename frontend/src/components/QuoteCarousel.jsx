import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

const QuoteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const quotes = [
    {
      text: "Code is like humor. When you have to explain it, it's bad.",
      author: "Cory House",
      field: "Software Development"
    },
    {
      text: "First, solve the problem. Then, write the code.",
      author: "John Johnson",
      field: "Programming"
    },
    {
      text: "Experience is the name everyone gives to their mistakes.",
      author: "Oscar Wilde",
      field: "Life & Tech"
    },
    {
      text: "The best way to predict the future is to implement it.",
      author: "David Heinemeier Hansson",
      field: "Innovation"
    },
    {
      text: "Simplicity is the soul of efficiency.",
      author: "Austin Freeman",
      field: "Design & Development"
    },
    {
      text: "Make it work, make it right, make it fast.",
      author: "Kent Beck",
      field: "Software Principles"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    if (newDirection > 0) {
      setPage([page + newDirection, newDirection]);
    } else {
      setPage([page + newDirection, newDirection]);
    }
  };

  const quoteIndex = ((page % quotes.length) + quotes.length) % quotes.length;

  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          className="absolute text-center max-w-3xl mx-auto px-4"
        >
          <div className="flex flex-col items-center space-y-4">
            {/* Quote Icon */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl text-blue-500 mb-2"
            >
              <FiMessageSquare />
            </motion.div>

            {/* Quote Text */}
            <blockquote className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 italic leading-relaxed">
              "{quotes[quoteIndex].text}"
            </blockquote>

            {/* Author and Field */}
            <div className="text-center space-y-1 mt-6">
              <cite className="text-sm font-semibold text-gray-900 dark:text-white not-italic">
                — {quotes[quoteIndex].author}
              </cite>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-4 pt-4">
                {quotes[quoteIndex].field}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-8">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const newDirection = index > quoteIndex ? 1 : -1;
              setPage([index, newDirection]);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === quoteIndex
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>

      {/* Side Navigation */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        aria-label="Previous quote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        aria-label="Next quote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default QuoteCarousel;