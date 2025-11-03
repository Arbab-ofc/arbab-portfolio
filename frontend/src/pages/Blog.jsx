import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiTag, FiSearch, FiFilter } from 'react-icons/fi';
import { blogsAPI } from '../utils/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tutorial', 'Best Practices', 'Case Study', 'Tech Review', 'Career'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, selectedCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.getAll({ published: true });
      setBlogs(response.data.data || []);
      setFilteredBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
      {/* Clean White Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40"></div>

      {/* Subtle Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Luxury Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(45deg, #F59E0B 1px, transparent 1px),
            linear-gradient(-45deg, #F59E0B 1px, transparent 1px),
            linear-gradient(45deg, #D97706 1px, transparent 1px),
            linear-gradient(-45deg, #D97706 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: '0 0, 0 60px, 60px 0, 60px 60px'
        }}></div>
      </div>

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(to right, #F59E0B 1px, transparent 1px),
            linear-gradient(to bottom, #F59E0B 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Elegant Particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-300/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 95}%`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          ></div>
        ))}
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-10 right-10 w-20 h-20 border-4 border-amber-200/30 rounded-tr-full animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-amber-200/30 rounded-bl-full animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-sm font-semibold mb-6 shadow-xl border border-amber-400/30">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Blog Articles
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Blog & Insights
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Thoughts, tutorials, and insights on web development and technology
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiFilter className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Search & Filter Articles
              </h3>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-300 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Article Category
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg border border-amber-400/30'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Showing <span className="font-semibold text-amber-600">{filteredBlogs.length}</span> of <span className="font-semibold text-amber-600">{blogs.length}</span> articles
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-amber-200/50 rounded-3xl h-96 animate-pulse shadow-xl"></div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
              <FiSearch className="text-amber-600 text-2xl" />
            </div>
            <p className="text-xl text-gray-600">
              No articles found. Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring"
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="relative h-full bg-white border border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-amber-200/20 transition-all duration-500 overflow-hidden">
                  {/* Glass Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Cover Image */}
                  <div className="h-56 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 relative overflow-hidden">
                    {blog.coverImage?.url ? (
                      <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-7xl font-bold opacity-50">
                          {blog.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {blog.featured && (
                      <div className="absolute top-4 right-4 bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-xs font-medium border border-amber-300/50">
                        {blog.category}
                      </span>
                    </div>

                    <p className="text-gray-700 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={16} className="text-amber-500" />
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock size={16} className="text-amber-500" />
                        <span>{blog.readTime} min read</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-xs font-medium border border-amber-300/50"
                          >
                            <FiTag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all text-center text-sm font-medium shadow-lg hover:shadow-amber-500/30"
                    >
                      Read Article
                    </Link>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;