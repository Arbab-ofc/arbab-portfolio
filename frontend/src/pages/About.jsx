import { motion } from 'framer-motion';
import { FiAward, FiCode, FiDatabase, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  const stats = [
    { icon: FiCode, label: 'Projects Completed', value: '15+' },
    { icon: FiDatabase, label: 'Technologies', value: '20+' },
    { icon: FiAward, label: 'Certifications', value: '5+' },
    { icon: FiTrendingUp, label: 'Years Experience', value: '2+' },
  ];

  const education = [
    {
      degree: 'B.Tech in Electronics and Communication Engineering',
      institution: 'Indian Institute of Information Technology Bhagalpur',
      period: 'Nov 2022 – Jul 2026',
      cgpa: '8.32',
    },
    {
      degree: 'Higher Secondary (BSEB)',
      institution: 'Ram Mohan Roy Seminary, Khajanchi Road, Patna',
      period: '2021 – 2022',
      percentage: '80.8%',
    },
    {
      degree: 'Secondary (CBSE)',
      institution: 'Christ Church Diocesan School, Gandhi Maidan, Patna',
      period: '2019 – 2020',
      percentage: '87.6%',
    },
  ];

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
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Passionate Full-Stack Developer with expertise in MERN stack and Data Analytics
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Who I Am
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                I'm Arbab Arshad, a passionate Full-Stack MERN Developer and Data Analyst currently pursuing B.Tech in Electronics and Communication Engineering at IIIT Bhagalpur.
              </p>
              <p>
                With a strong foundation in modern web technologies and data analytics, I specialize in building scalable, user-friendly applications that solve real-world problems. My expertise spans across the entire development lifecycle, from conceptualization to deployment.
              </p>
              <p>
                I'm particularly interested in creating innovative solutions using React, Node.js, MongoDB, and leveraging data analytics to drive insights and decision-making.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              What I Do
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Full-Stack Development
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Building end-to-end web applications using MERN stack with focus on performance and user experience.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Data Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Analyzing data using Python, Pandas, NumPy, and creating insightful visualizations with Matplotlib and Plotly.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Problem Solving
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Strong analytical and problem-solving skills with experience in algorithms and data structures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {edu.period}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-semibold">
                      {edu.cgpa || edu.percentage}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Soft Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Communication',
              'Teamwork',
              'Problem Solving',
              'Time Management',
              'Leadership',
              'Analytical Thinking',
              'Adaptability',
              'Ownership Mindset',
            ].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 text-center"
              >
                <span className="text-gray-900 dark:text-white font-medium">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
