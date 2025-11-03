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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Project not found
          </h2>
          <Link to="/projects" className="text-blue-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FiArrowLeft /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {project.shortDescription}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`p-3 rounded-lg transition-all ${
                  liked
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <FiHeart className={liked ? 'fill-current' : ''} size={20} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <FiShare2 size={20} />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <FiCalendar size={16} />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            {project.duration && (
              <div className="flex items-center gap-2">
                <FiClock size={16} />
                <span>{project.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FiHeart size={16} />
              <span>{project.metrics?.likes || 0} likes</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              {project.projectType}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
              {project.category}
            </span>
            {project.status && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FiExternalLink /> View Live Demo
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <FiGithub /> View Source Code
              </a>
            )}
          </div>
        </motion.div>

        {/* Main Image */}
        {project.images?.[0]?.url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 rounded-xl overflow-hidden shadow-2xl"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About This Project
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {project.longDescription}
            </p>
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Technologies Used
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {project.technologies?.frontend?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.frontend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.technologies?.backend?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.backend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.technologies?.database?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Database
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.database.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.technologies?.tools?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Tools & Others
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.tools.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Key Features
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Challenges */}
        {project.challenges?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Challenges & Solutions
            </h2>
            <div className="space-y-6">
              {project.challenges.map((challenge, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Challenge: {challenge.problem}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Solution:</strong> {challenge.solution}
                  </p>
                  {challenge.result && (
                    <p className="text-green-600 dark:text-green-400">
                      <strong>Result:</strong> {challenge.result}
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
