import { motion } from 'framer-motion';
import { FiAward, FiCode, FiDatabase, FiTrendingUp, FiMessageSquare, FiUsers, FiTarget, FiClock, FiBriefcase, FiActivity, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

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
            About Me
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Know More About Me
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Passionate Full-Stack Developer with expertise in MERN stack and Data Analytics
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiTrendingUp className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Professional Stats
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring"
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="relative h-full bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-500">
                    {/* Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                    <div className="relative">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-700 group-hover:text-amber-700 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* About Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                  <FiCode className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Who I Am
                </h3>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                  <FiDatabase className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  What I Do
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Full-Stack Development',
                    description: 'Building end-to-end web applications using MERN stack with focus on performance and user experience.',
                    icon: FiCode
                  },
                  {
                    title: 'Data Analytics',
                    description: 'Analyzing data using Python, Pandas, NumPy, and creating insightful visualizations with Matplotlib and Plotly.',
                    icon: FiDatabase
                  },
                  {
                    title: 'Problem Solving',
                    description: 'Strong analytical and problem-solving skills with experience in algorithms and data structures.',
                    icon: FiTrendingUp
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{
                      x: 4,
                      transition: { duration: 0.3 }
                    }}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-xl p-4 hover:shadow-md hover:shadow-amber-200/20 transition-all duration-500">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiAward className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Education Background
              </h3>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{
                    x: 4,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-500">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 mb-2">
                          {edu.degree}
                        </h4>
                        <p className="text-gray-700 mb-1 font-medium">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                          {edu.period}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-bold shadow-lg border border-amber-400/30">
                          {edu.cgpa || edu.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Soft Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg">
                <FiTrendingUp className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Professional Skills & Competencies
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Communication', icon: FiMessageSquare },
                { name: 'Teamwork', icon: FiUsers },
                { name: 'Problem Solving', icon: FiTarget },
                { name: 'Time Management', icon: FiClock },
                { name: 'Leadership', icon: FiBriefcase },
                { name: 'Analytical Thinking', icon: FiActivity },
                { name: 'Adaptability', icon: FiRefreshCw },
                { name: 'Ownership Mindset', icon: FiCheckCircle },
              ].map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.7 + index * 0.05,
                    type: "spring"
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="relative h-full bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-500">
                    {/* Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-200/40 via-yellow-100/20 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative">
                      <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <skill.icon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-900 group-hover:text-amber-600 transition-colors duration-300 font-semibold text-sm leading-tight">
                        {skill.name}
                      </span>
                    </div>

                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
