import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiBriefcase, FiAward } from 'react-icons/fi';
import { experienceAPI } from '../utils/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await experienceAPI.getAll();
      setExperiences(response.data.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            My professional journey and internship experiences
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 hidden md:block z-10"></div>

                  {/* Content Card */}
                  <div className="md:ml-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {exp.position}
                        </h3>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
                          <FiBriefcase size={18} />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                          exp.current
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} />
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-2">
                          <FiMapPin size={16} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {exp.description}
                      </p>
                    )}

                    {/* Responsibilities */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-blue-600 rounded"></span>
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-2">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                              <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FiAward className="text-yellow-500" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                              <span className="flex-shrink-0 text-yellow-500">★</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Company Website Link */}
                    {exp.website && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={exp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Visit Company Website →
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Notable Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  7
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Smart India Hackathon 2023
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Internal Hackathon
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Secured 7th rank in the Internal Hackathon of Smart India Hackathon 2023
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  31
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Smart India Hackathon 2024
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Internal Hackathon
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Secured 31st rank in the Internal Hackathon of Smart India Hackathon 2024
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;
