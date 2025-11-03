import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillsAPI } from '../utils/api';

const Skills = () => {
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      setSkills(response.data.data || {});
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Frontend: 'from-blue-500 to-cyan-500',
      Backend: 'from-green-500 to-emerald-500',
      Database: 'from-purple-500 to-pink-500',
      DevOps: 'from-orange-500 to-red-500',
      Tools: 'from-yellow-500 to-amber-500',
      'Data Analytics': 'from-indigo-500 to-violet-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="min-h-screen py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${getCategoryColor(category)} bg-clip-text text-transparent mb-2`}>
                    {category}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r ${getCategoryColor(category)} rounded-full"></div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                    >
                      {/* Skill Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {skill.name}
                          </h3>
                          {skill.experience && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {skill.experience}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(category)} text-white rounded-full text-xs font-bold`}>
                          {getProficiencyLabel(skill.proficiency)}
                        </span>
                      </div>

                      {/* Description */}
                      {skill.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {skill.description}
                        </p>
                      )}

                      {/* Proficiency Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Proficiency
                          </span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3 }}
                            className={`h-full bg-gradient-to-r ${getCategoryColor(category)} rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Certifications */}
                      {skill.certifications && skill.certifications.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Certifications:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {skill.certifications.map((cert, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">
            Continuous Learning
          </h2>
          <p className="text-center text-blue-100 max-w-3xl mx-auto">
            I'm constantly expanding my skill set and staying updated with the latest technologies and best practices in web development and data analytics. Always eager to learn and take on new challenges!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
