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
            Professional Journey
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Work Experience
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            My professional journey and internship experiences
          </p>
        </motion.div>

        {loading ? (
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiBriefcase className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Loading Experience
              </h3>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiBriefcase className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Professional Timeline
              </h3>
            </div>

            <div className="relative">
              {/* Luxury Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-600 hidden md:block"></div>

              {/* Experience Items */}
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                      type: "spring"
                    }}
                    whileHover={{
                      x: 4,
                      transition: { duration: 0.3 }
                    }}
                    className="relative group"
                  >
                    {/* Luxury Timeline Dot */}
                    <div className="absolute left-6 top-6 w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full border-4 border-white shadow-lg hidden md:block z-10 group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full"></div>
                    </div>

                    {/* Luxury Content Card */}
                    <div className="md:ml-20 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-amber-200/20 transition-all duration-500 p-6 md:p-8 relative overflow-hidden">
                      {/* Hover Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                      {/* Corner Accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-200/30 via-yellow-100/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 mb-2">
                              {exp.position}
                            </h3>
                            <div className="flex items-center gap-2 text-amber-600 font-semibold mb-2">
                              <FiBriefcase size={18} />
                              <span>{exp.company}</span>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg border ${
                              exp.current
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400/30'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-400/30'
                            }`}>
                              {exp.type}
                            </span>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-6">
                          <div className="flex items-center gap-2 px-3 py-1 bg-amber-100/50 rounded-lg">
                            <FiCalendar size={16} className="text-amber-600" />
                            <span>
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100/50 rounded-lg">
                              <FiMapPin size={16} className="text-amber-600" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed mb-6">
                            {exp.description}
                          </p>
                        )}

                        {/* Responsibilities */}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-yellow-500 rounded"></span>
                              Key Responsibilities
                            </h4>
                            <ul className="space-y-2">
                              {exp.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-700">
                                  <span className="flex-shrink-0 w-2 h-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full mt-2"></span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Achievements */}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <FiAward className="text-amber-500" />
                              Key Achievements
                            </h4>
                            <ul className="space-y-2">
                              {exp.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-700">
                                  <span className="flex-shrink-0 text-amber-500">★</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Technologies */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">
                              Technologies Used
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-sm font-medium border border-amber-300/50"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Company Website Link */}
                        {exp.website && (
                          <div className="mt-6 pt-6 border-t border-amber-200/50">
                            <a
                              href={exp.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-600 hover:text-amber-700 font-medium text-sm inline-flex items-center gap-1 group"
                            >
                              Visit Company Website
                              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiAward className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Notable Achievements
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-500">
                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-200/30 via-yellow-100/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        7
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 text-lg">
                          Smart India Hackathon 2023
                        </h4>
                        <p className="text-amber-700 font-medium">
                          Internal Hackathon
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Secured 7th rank in the Internal Hackathon of Smart India Hackathon 2023
                    </p>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-500">
                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-200/30 via-yellow-100/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        31
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 text-lg">
                          Smart India Hackathon 2024
                        </h4>
                        <p className="text-amber-700 font-medium">
                          Internal Hackathon
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Secured 31st rank in the Internal Hackathon of Smart India Hackathon 2024
                    </p>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;