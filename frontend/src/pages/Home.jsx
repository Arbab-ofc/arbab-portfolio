import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail, FiDownload } from 'react-icons/fi';
import { projectsAPI, skillsAPI } from '../utils/api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          projectsAPI.getAll({ featured: true, limit: 3 }),
          skillsAPI.getAll(),
        ]);
        setProjects(projectsRes.data.data || []);
        setSkills(skillsRes.data.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              👋 Welcome to my portfolio
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Arbab Arshad
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4"
          >
            Full-Stack MERN Developer
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
          >
            Data Analyst | Problem Solver | Tech Enthusiast
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Passionate about building innovative web solutions with modern technologies.
            Specializing in React, Node.js, MongoDB, and Data Analytics.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link
              to="/projects"
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              View My Work
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              Get In Touch
            </Link>
            <a
              href="/resume.pdf"
              download
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              <FiDownload />
              Download CV
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-6"
          >
            <motion.a
              href="https://github.com/Arbab-ofc"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <FiGithub size={24} className="text-gray-700 dark:text-gray-300" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/arbab-ofc/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <FiLinkedin size={24} className="text-blue-600" />
            </motion.a>
            <motion.a
              href="mailto:arbabprvt@gmail.com"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <FiMail size={24} className="text-red-600" />
            </motion.a>
          </motion.div>
        </motion.div>

        </section>

      {/* Featured Projects Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Clean White Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800"></div>

        {/* Subtle Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-900/20 dark:via-amber-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

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
              className="absolute w-2 h-2 bg-amber-300/40 dark:bg-amber-700/30 rounded-full animate-pulse"
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
        <div className="absolute top-10 right-10 w-20 h-20 border-4 border-amber-200/30 dark:border-amber-700/30 rounded-tr-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-amber-200/30 dark:border-amber-700/30 rounded-bl-full animate-pulse" style={{ animationDelay: '1s' }}></div>

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
              Featured Projects
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Recent Projects
              </span>
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore my latest work showcasing innovative solutions,
              modern technologies, and creative problem-solving approaches.
            </p>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 shadow-xl rounded-3xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
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
                  className="group relative"
                >
                  {/* Luxury Project Card */}
                  <div className="relative h-full bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-800/20 transition-all duration-500 overflow-hidden">

                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 dark:from-amber-900/20 dark:via-transparent dark:to-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-800/30 dark:via-yellow-800/20 dark:to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-800/30 dark:via-amber-800/20 dark:to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Project Image/Preview */}
                    <div className="relative h-56 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 overflow-hidden">
                      {/* Animated Background */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/20 rounded-full animate-bounce"></div>
                      </div>

                      {/* Project Initial */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.15 + 0.3 }}
                          className="text-center"
                        >
                          <span className="text-white text-7xl font-bold opacity-50 block">
                            {project.title.charAt(0)}
                          </span>
                          {project.featured && (
                            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 rounded-full">
                              <span className="text-amber-200 text-xs font-semibold">⭐ Featured</span>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                        <div className="p-6 w-full">
                          <div className="flex items-center justify-between text-white">
                            <span className="text-sm font-medium">
                              {project.category || 'Project'}
                            </span>
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              {project.projectType || 'Full Stack'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="relative p-6 space-y-4">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-300/50 dark:border-amber-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags?.length > 3 && (
                          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* View Project Link */}
                      <Link
                        to={`/projects/${project.slug}`}
                        className="group/link inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-300"
                      >
                        <span className="relative">
                          View Project
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 dark:bg-amber-400 group-hover/link:w-full transition-all duration-300"></span>
                        </span>
                        <FiArrowRight className="group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>

                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 dark:via-amber-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              to="/projects"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-amber-500/30 transform hover:scale-105 border border-amber-400/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Projects
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Border Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br-lg"></div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Clean White Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800"></div>

        {/* Subtle Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-900/20 dark:via-amber-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

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
              className="absolute w-2 h-2 bg-amber-300/40 dark:bg-amber-700/30 rounded-full animate-pulse"
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
        <div className="absolute top-10 right-10 w-20 h-20 border-4 border-amber-200/30 dark:border-amber-700/30 rounded-tr-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-amber-200/30 dark:border-amber-700/30 rounded-bl-full animate-pulse" style={{ animationDelay: '1s' }}></div>

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
              Technical Excellence
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Technical Skills
              </span>
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Mastering modern technologies to build exceptional digital experiences
              with precision, creativity, and technical expertise.
            </p>
          </motion.div>

          {/* Skills Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 shadow-xl rounded-3xl h-40 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(skills).slice(0, 4).map(([category, categorySkills], index) => (
                <motion.div
                  key={category}
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
                  className="group relative"
                >
                  {/* Luxury Card */}
                  <div className="relative h-full bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-800/20 transition-all duration-500 overflow-hidden">

                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 dark:from-amber-900/20 dark:via-transparent dark:to-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-800/30 dark:via-yellow-800/20 dark:to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-800/30 dark:via-amber-800/20 dark:to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Card Content */}
                    <div className="relative p-8 text-center">
                      {/* Category Name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                        {category}
                      </h3>

                      {/* Skills List */}
                      <div className="space-y-2">
                        {categorySkills.slice(0, 3).map((skill, skillIndex) => (
                          <div
                            key={skill._id}
                            className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300"
                            style={{
                              animationDelay: `${index * 0.1 + skillIndex * 0.05}s`
                            }}
                          >
                            <span className="inline-flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 dark:from-amber-500 dark:to-yellow-500 rounded-full"></span>
                              {skill.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* More Indicator */}
                      {categorySkills.length > 3 && (
                        <div className="mt-3 text-xs text-amber-600/70 dark:text-amber-400/70 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                          +{categorySkills.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 dark:via-amber-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              to="/skills"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-amber-500/30 transform hover:scale-105 border border-amber-400/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore All Skills
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Border Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br-lg"></div>
            </Link>
          </motion.div>
        </div>
      </section>

      
      {/* Modern CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Modern Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 backdrop-blur-md transform rotate-45 animate-spin" style={{ animationDuration: '15s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Available for Projects
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
            >
              Ready to Build
              <span className="block text-3xl md:text-5xl mt-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Something Amazing?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Let's collaborate and turn your ideas into reality.
              From concept to deployment, I'm here to help you succeed.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start a Project
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>

              <Link
                to="/projects"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:border-white/50 hover:shadow-white/10"
              >
                View My Work
                <span className="block text-sm font-normal text-white/70 mt-1">See my portfolio</span>
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <FiMail className="text-white/60" />
                <span>arbabprvt@gmail.com</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span>Response time:</span>
                <span className="text-white font-medium">Within 24 hours</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>
    </div>
  );
};

export default Home;
