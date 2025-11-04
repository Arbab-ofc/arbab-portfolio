import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiCalendar, FiClock, FiTag,
  FiFile, FiFolder, FiTerminal, FiCommand,
  FiChevronLeft, FiChevronRight,
  FiCode, FiCoffee, FiActivity
} from 'react-icons/fi';
import { blogsAPI } from '../utils/api';

// Mac Traffic Lights Component
const MacTrafficLights = () => (
  <div className="flex items-center gap-2">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors border border-red-600/30"
    />
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors border border-yellow-600/30"
    />
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors border border-green-600/30"
    />
  </div>
);

// Terminal Header Component
const TerminalHeader = ({ blog, onBack }) => (
  <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <FiChevronLeft className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-mono text-sm">cd ../blog</span>
        </motion.button>

        <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
          <FiTerminal className="w-4 h-4" />
          <span>arbab@portfolio:~$</span>
          <span className="text-gray-400">cat blog/{blog.slug}.md</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <FiCoffee className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-mono text-xs">{blog.readTime} min read</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <FiCalendar className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-mono text-xs">
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Sidebar Component (Desktop)
const Sidebar = ({ blog, recentPosts }) => (
  <div className="hidden xl:block w-64 bg-gray-900/30 backdrop-blur-xl border-r border-gray-700/50">
    <div className="p-4 space-y-6">
      {/* File Explorer */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-400 font-mono text-xs uppercase tracking-wider">
          <FiFolder className="w-4 h-4" />
          Explorer
        </div>

        <div className="space-y-1">
          <Link
            to="/blog"
            className="flex items-center gap-2 px-2 py-1.5 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-colors group"
          >
            <FiFolder className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
            <span className="text-amber-400 font-mono text-sm group-hover:text-amber-300">blog</span>
          </Link>
          <div className="ml-4 flex items-center gap-2 px-2 py-1.5 bg-gray-700/50 rounded border-l-2 border-green-400">
            <FiFile className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono text-sm">{blog.slug}.md</span>
          </div>
        </div>
      </div>

      {/* Blog Info */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-400 font-mono text-xs uppercase tracking-wider">
          <FiActivity className="w-4 h-4" />
          Stats
        </div>

        <div className="space-y-2 text-gray-300 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Words:</span>
            <span className="text-green-400">{blog.wordCount || '2.4k'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Views:</span>
            <span className="text-blue-400">{blog.views || '1,234'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Likes:</span>
            <span className="text-red-400">{blog.likes || '89'}</span>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-400 font-mono text-xs uppercase tracking-wider">
          <FiFile className="w-4 h-4" />
          Recent Posts
        </div>

        <div className="space-y-1">
          {recentPosts?.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-800/30 rounded transition-colors group"
            >
              <FiFile className="w-3 h-3 text-gray-500 group-hover:text-green-400" />
              <span className="text-gray-400 font-mono text-xs truncate group-hover:text-green-400">
                {post.slug}.md
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Status Bar Component
const StatusBar = ({ blog, readingProgress }) => (
  <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 px-4 py-2">
    <div className="flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400">Connected</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <FiCode className="w-3 h-3" />
          <span>Markdown</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <FiTag className="w-3 h-3" />
          <span>{blog.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-400">
          Ln 1, Col 1
        </div>

        <div className="flex items-center gap-2">
          <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          <span className="text-gray-400">{Math.round(readingProgress)}%</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-amber-400">arbab</span>
          <span className="text-gray-500">@</span>
          <span className="text-blue-400">main</span>
        </div>
      </div>
    </div>
  </div>
);

// Luxury Avatar Component (simplified for IDE theme)
const LuxuryAvatar = ({ name, size = 'medium', className = '' }) => {
  const getInitial = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8 text-sm';
      case 'large':
        return 'w-16 h-16 text-2xl';
      default:
        return 'w-8 h-8 text-sm';
    }
  };

  return (
    <div className={`
      relative inline-flex items-center justify-center
      ${getSizeClasses()}
      rounded-full
      bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600
      text-white font-bold font-mono
      border border-amber-400/30
      shadow-lg shadow-amber-500/20
      ${className}
    `}>
      <span className="relative z-10">
        {getInitial(name)}
      </span>

      {/* Terminal cursor effect */}
      <div className="absolute inset-0 rounded-full animate-pulse">
        <div className="w-full h-full bg-green-400/20 rounded-full"></div>
      </div>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchBlog();
    fetchRecentPosts();

    // Handle scroll for reading progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await blogsAPI.getOne(slug);
      setBlog(response.data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await blogsAPI.getAll({ published: true, limit: 5 });
      setRecentPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-green-400 font-mono">Loading file...</div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50">
          <div className="text-red-400 font-mono text-lg mb-4">Error: File not found</div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 font-mono hover:bg-amber-500/30 transition-colors"
          >
            <FiChevronLeft /> cd ../blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Mac Window Container - Responsive */}
      <div className="flex flex-col min-h-screen">
        {/* Mac Title Bar - Mobile First */}
        <div className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50 px-2 sm:px-4 py-1 sm:py-2">
          <div className="flex items-center justify-between">
            {/* Left Side - Traffic Lights and Title */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              {/* Traffic Lights - Smaller on mobile */}
              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors border border-red-600/30"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors border border-yellow-600/30"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors border border-green-600/30"
                />
              </div>

              {/* Title - Responsive text */}
              <div className="flex-1 text-center">
                <div className="text-gray-300 font-mono text-xs sm:text-sm truncate max-w-[120px] sm:max-w-md mx-auto">
                  {blog.title}
                </div>
              </div>
            </div>

            {/* Right Side - Menu Button */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 sm:p-1.5 hover:bg-gray-700/50 rounded transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FiCommand className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop Only */}
          <div className="hidden xl:block">
            <Sidebar blog={blog} recentPosts={recentPosts} />
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50"
              >
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400 font-mono text-sm">Explorer</div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 hover:bg-gray-800/50 rounded"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/blog"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-colors"
                    >
                      <FiFolder className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 font-mono text-sm">blog</span>
                    </Link>
                    <div className="ml-4 flex items-center gap-2 px-2 py-1.5 bg-gray-700/50 rounded border-l-2 border-green-400">
                      <FiFile className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-mono text-xs truncate">{blog.slug}.md</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {recentPosts?.slice(0, 3).map((post) => (
                      <Link
                        key={post._id}
                        to={`/blog/${post.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-800/30 rounded transition-colors"
                      >
                        <FiFile className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400 font-mono text-xs truncate">
                          {post.slug}.md
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Editor Area - Responsive */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Terminal Header - Responsive with Large Screen Optimization */}
            <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 lg:gap-6">
                {/* Back Button - Mobile First */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors self-start sm:self-center"
                >
                  <FiChevronLeft className="w-3 h-3 sm:w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
                  <span className="text-green-400 font-mono text-xs sm:text-sm lg:text-base">cd ../blog</span>
                </motion.button>

                {/* Terminal Command - Responsive */}
                <div className="flex items-center gap-2 text-green-400 font-mono text-xs sm:text-sm lg:text-base truncate">
                  <FiTerminal className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="truncate">arbab@portfolio:~$ cat blog/{blog.slug}.md</span>
                </div>
              </div>

              {/* Meta Info - Responsive with Large Screen Optimization */}
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 lg:mt-6">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                  <FiCoffee className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-400" />
                  <span className="text-amber-400 font-mono text-xs sm:text-xs lg:text-sm">{blog.readTime} min read</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-400" />
                  <span className="text-blue-400 font-mono text-xs sm:text-xs lg:text-sm">
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Editor - Responsive with Large Screen Optimization */}
            <div className="flex-1 overflow-y-auto bg-gray-900/30 backdrop-blur-sm">
              <div className="max-w-none 2xl:max-w-6xl 3xl:max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 mx-auto">
                {/* File Header - Responsive */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-700/50"
                >
                  {/* Category and Author Info - Mobile Stack */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded">
                      <span className="text-green-400 font-mono text-xs">{blog.category}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <LuxuryAvatar name={blog.author?.name} size="small" />
                      <div>
                        <div className="text-green-400 font-mono text-xs sm:text-sm">Author: {blog.author?.name}</div>
                        <div className="text-gray-500 font-mono text-xs hidden sm:block">{blog.author?.bio}</div>
                      </div>
                    </div>
                  </div>

                  {/* Title - Responsive with Large Screen Optimization */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 font-mono leading-tight">
                    <span className="text-blue-400"># </span>
                    {blog.title}
                  </h1>
                </motion.div>

                {/* Cover Image - Responsive */}
                {blog.coverImage?.url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 sm:mb-8"
                  >
                    <div className="relative overflow-hidden rounded-lg border border-gray-700/50">
                      <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        className="w-full h-auto"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded">
                        <span className="text-xs font-mono text-gray-300">📷 cover.png</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Content - Responsive with Large Screen Optimization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="text-gray-300 whitespace-pre-line leading-relaxed font-mono text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                    {blog.content?.split('\n').map((line, index) => (
                      <div key={index} className="flex">
                        <span className="text-gray-600 mr-2 sm:mr-3 md:mr-4 select-none font-mono text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                          {(index + 1).toString().padStart(2, ' ')}
                        </span>
                        <span className="flex-1 break-words">{line || ' '}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Author Section - Responsive */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex justify-center sm:justify-start">
                      <LuxuryAvatar name={blog.author?.name} size="large" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-mono">
                        <span className="text-blue-400">// </span>
                        About {blog.author?.name}
                      </h3>
                      <p className="text-gray-400 mb-4 font-mono text-xs sm:text-sm">{blog.author?.bio}</p>
                      <Link
                        to="/about"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 font-mono text-xs sm:text-sm hover:bg-amber-500/30 transition-colors"
                      >
                        <FiArrowLeft /> Learn more about the author
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation - Responsive */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center"
                >
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-lg font-semibold font-mono text-xs sm:text-sm hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/30"
                  >
                    <FiArrowLeft />
                    Back to blog directory
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Status Bar - Responsive */}
            <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 px-2 sm:px-4 py-1 sm:py-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono">
                {/* Left Side - Mobile Stack */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">Connected</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <FiCode className="w-3 h-3" />
                    <span className="text-xs">Markdown</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-gray-400">
                    <FiTag className="w-3 h-3" />
                    <span className="text-xs">{blog.category}</span>
                  </div>
                </div>

                {/* Right Side - Mobile Stack */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="text-gray-400 text-xs">
                    Ln 1, Col 1
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs">{Math.round(readingProgress)}%</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-xs">arbab</span>
                    <span className="text-gray-500 text-xs">@</span>
                    <span className="text-blue-400 text-xs">main</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
