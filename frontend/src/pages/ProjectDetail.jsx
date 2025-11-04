import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowLeft, FiHeart, FiShare2, FiCalendar, FiClock } from 'react-icons/fi';
import { projectsAPI } from '../utils/api';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getOne(slug);
      setProject(response.data.data);
      // Increment view count
      await projectsAPI.incrementView(response.data.data._id);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!project) return;
    try {
      await projectsAPI.like(project._id);
      setLiked(true);
      setProject({
        ...project,
        metrics: {
          ...project.metrics,
          likes: (project.metrics?.likes || 0) + 1,
        },
      });
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Clean White Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800"></div>

        {/* Subtle Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-900/20 dark:via-amber-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Clean White Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/40 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800"></div>

        {/* Subtle Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-900/20 dark:via-amber-900/10 dark:to-transparent rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
              <span className="text-amber-600 dark:text-amber-400 text-3xl">😞</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Project not found
            </h2>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-amber-500/30"
            >
              <FiArrowLeft /> Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all border border-amber-200/50"
          >
            <FiArrowLeft /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-amber-200/50 rounded-3xl shadow-xl p-8 mb-12"
        >
          <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  {project.title}
                </span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {project.shortDescription}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`p-3 rounded-xl transition-all ${
                  liked
                    ? 'bg-amber-100 text-amber-600 border border-amber-300/50'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
                }`}
              >
                <FiHeart className={liked ? 'fill-current' : ''} size={20} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all border border-amber-200/50"
              >
                <FiShare2 size={20} />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-100 rounded">
                <FiCalendar size={14} className="text-amber-600" />
              </div>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            {project.duration && (
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-100 rounded">
                  <FiClock size={14} className="text-amber-600" />
                </div>
                <span>{project.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-100 rounded">
                <FiHeart size={14} className="text-amber-600" />
              </div>
              <span>{project.metrics?.likes || 0} likes</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-sm font-medium border border-amber-300/50">
              {project.projectType}
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-sm font-medium border border-amber-300/50">
              {project.category}
            </span>
            {project.status && (
              <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-sm font-medium border border-amber-300/50">
                {project.status}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-amber-500/30"
              >
                <FiExternalLink /> View Live Demo
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all border border-amber-200/50"
              >
                <FiGithub /> View Source Code
              </a>
            )}
          </div>
        </motion.div>

        {/* Main Image */}
        {project.images?.[0]?.url && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-white border border-amber-200/50 rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src={project.images[0].url}
              alt={project.title}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-white border border-amber-200/50 rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              About This Project
            </span>
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {project.longDescription}
            </p>
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-12 bg-white border border-amber-200/50 rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Technologies Used
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {project.technologies?.frontend?.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                    <span className="text-amber-600">🎨</span>
                  </div>
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.frontend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-300/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.technologies?.backend?.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                    <span className="text-amber-600">⚙️</span>
                  </div>
                  Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.backend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-300/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.technologies?.database?.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                    <span className="text-amber-600">🗄️</span>
                  </div>
                  Database
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.database.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-300/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.technologies?.tools?.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                    <span className="text-amber-600">🔧</span>
                  </div>
                  Tools & Others
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.tools.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-300/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features */}
        {project.features?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mb-12 bg-white border border-amber-200/50 rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Key Features
              </span>
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Challenges */}
        {project.challenges?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mb-12 bg-white border border-amber-200/50 rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Challenges & Solutions
              </span>
            </h2>
            <div className="space-y-6">
              {project.challenges.map((challenge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                      <span className="text-amber-600">🎯</span>
                    </div>
                    Challenge: {challenge.problem}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold text-amber-600">Solution:</span> {challenge.solution}
                  </p>
                  {challenge.result && (
                    <p className="text-amber-600 font-medium">
                      <span className="font-semibold">Result:</span> {challenge.result}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
