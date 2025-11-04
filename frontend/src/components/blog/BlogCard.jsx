import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FiCalendar, FiClock, FiTag, FiArrowRight, FiShare2, FiCopy, FiTwitter, FiLinkedin, FiCheck, FiBookOpen, FiTrendingUp, FiHeart } from 'react-icons/fi';

const BlogCard = ({
  blog,
  index = 0,
  className = '',
  variant = 'default' // default, featured, compact
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const shareMenuRef = useRef(null);

  // Enhanced mouse tracking for premium magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tutorial': 'from-blue-500 to-indigo-600',
      'Best Practices': 'from-emerald-500 to-green-600',
      'Case Study': 'from-purple-500 to-violet-600',
      'Tech Review': 'from-rose-500 to-pink-600',
      'Career': 'from-amber-500 to-orange-600',
      'Other': 'from-gray-500 to-slate-600',
    };
    return colors[category] || colors['Other'];
  };

  
  // Share functionality
  const getBlogUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/blog/${blog.slug}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getBlogUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getBlogUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const text = `Check out this amazing blog: ${blog.title}`;
    const url = getBlogUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const url = getBlogUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const url = getBlogUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cardVariants = {
    default: {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.23, 1, 0.32, 1]
        }
      },
      hover: {
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
      }
    },
    featured: {
      hidden: { opacity: 0, y: 40, scale: 0.92 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          delay: index * 0.15,
          ease: [0.23, 1, 0.32, 1]
        }
      },
      hover: {
        y: -12,
        scale: 1.03,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
      }
    }
  };

  const currentVariant = cardVariants[variant];

  return (
    <motion.div
      ref={cardRef}
      variants={currentVariant}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative ${className}`}
    >
      {/* Premium Card Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-amber-200/20 dark:border-amber-800/20 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)
              `
            }}
          />
        </div>

        {/* Luxury Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-400/30 dark:border-amber-600/30 rounded-tl-xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-400/30 dark:border-amber-600/30 rounded-br-xl"></div>

        {/* Cover Image Section - Premium Design */}
        <div className="relative h-48 md:h-52 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700">
          {blog.coverImage?.url ? (
            <>
              {/* Image Loading Placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 dark:from-amber-800/30 dark:to-yellow-800/30 animate-pulse flex items-center justify-center">
                  <FiBookOpen className="w-8 h-8 text-amber-500/50" />
                </div>
              )}

              {/* Main Image */}
              <img
                src={blog.coverImage.url}
                alt={blog.title}
                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                style={{ objectPosition: 'center' }}
              />

              {/* Premium Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
            </>
          ) : (
            /* Elegant Fallback Design */
            <div className="relative w-full h-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center overflow-hidden">
              {/* Subtle Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)`,
                  }}
                />
              </div>

              {/* Large Initial Letter */}
              <span className="relative text-white text-5xl md:text-6xl lg:text-7xl font-light tracking-wider opacity-90">
                {blog.title?.charAt(0) || 'B'}
              </span>
            </div>
          )}

          {/* Featured Badge - Premium Design */}
          {blog.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2 + index * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm border border-white/20"
            >
              <span className="flex items-center gap-1.5">
                <FiTrendingUp className="w-3 h-3" />
                Featured
              </span>
            </motion.div>
          )}

          {/* Category Badge - Minimalist Design */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-full text-xs font-semibold shadow-lg ${getCategoryColor(blog.category).includes('blue') ? 'text-blue-600' : getCategoryColor(blog.category).includes('emerald') ? 'text-emerald-600' : getCategoryColor(blog.category).includes('purple') ? 'text-purple-600' : getCategoryColor(blog.category).includes('rose') ? 'text-rose-600' : getCategoryColor(blog.category).includes('amber') ? 'text-amber-600' : 'text-gray-600'}`}>
              {blog.category}
            </span>
          </div>
        </div>

        {/* Content Section - Clean Layout */}
        <div className="relative p-6 space-y-4">
          {/* Title Section */}
          <div className="space-y-3">
            <Link
              to={`/blog/${blog.slug}`}
              className="block group/title"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400 transition-colors duration-300 line-clamp-2">
                {blog.title}
              </h3>
            </Link>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 text-sm">
              {blog.excerpt}
            </p>
          </div>

          {/* Meta Information - Clean Horizontal Layout */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5" />
                <span>{blog.readTime} min</span>
              </div>
              {blog.views && (
                <div className="flex items-center gap-1.5">
                  <FiTrendingUp className="w-3.5 h-3.5" />
                  <span>{blog.views} views</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-300" ref={shareMenuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 transition-colors duration-200"
              >
                <FiShare2 className="w-4 h-4" />
              </motion.button>

              {/* Premium Share Dropdown */}
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-2 min-w-[180px] z-50"
                >
                  {/* Copy Link */}
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-200 text-left"
                  >
                    {copySuccess ? (
                      <FiCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={`text-sm font-medium ${copySuccess ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </span>
                  </button>

                  {/* Social Media */}
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-1"></div>

                  <button
                    onClick={shareOnTwitter}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 text-left"
                  >
                    <FiTwitter className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</span>
                  </button>

                  <button
                    onClick={shareOnLinkedIn}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 text-left"
                  >
                    <FiLinkedin className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* SEO Information Display */}
          <div className="flex flex-wrap gap-1.5 pt-3">
            {/* Reading Time Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-200/30 dark:border-amber-700/30">
              <FiClock className="w-3 h-3" />
              {blog.readTime} min read
            </div>

            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-200/30 dark:border-blue-700/30">
              <FiTag className="w-3 h-3" />
              {blog.category}
            </div>

            {/* SEO Score Badge (if available) */}
            {blog.seoScore && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium border border-green-200/30 dark:border-green-700/30">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                SEO {blog.seoScore}
              </div>
            )}

            {/* Word Count Badge */}
            {blog.wordCount && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium border border-purple-200/30 dark:border-purple-700/30">
                <span className="text-xs">📝</span>
                {blog.wordCount} words
              </div>
            )}
          </div>

          {/* Premium CTA Button */}
          <Link
            to={`/blog/${blog.slug}`}
            className="group/btn flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-amber-500/25"
          >
            <span>Read Article</span>
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogCard;