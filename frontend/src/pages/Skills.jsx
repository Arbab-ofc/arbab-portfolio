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
      const fetchedSkills = response.data.data || {};

      // Enhanced skill descriptions for each category
      const enhancedDescriptions = {
        Frontend: {
          'React': 'Building interactive user interfaces with component-based architecture, hooks, state management, Redux, Context API, performance optimization, and modern React patterns for scalable applications',
          'Next.js': 'Full-stack React framework with server-side rendering, static site generation, API routes, optimized builds, and comprehensive deployment solutions',
          'JavaScript': 'Advanced ES6+ features, async programming, DOM manipulation, event handling, functional programming, and modern JavaScript patterns for scalable applications',
          'HTML/CSS': 'Semantic HTML5, responsive design with CSS Grid and Flexbox, animations, preprocessors (SASS/Less), and modern CSS frameworks and methodologies',
          'TypeScript': 'Type-safe JavaScript development with interfaces, generics, decorators, advanced typing, and large-scale application architecture with strict type checking',
          'Tailwind CSS': 'Utility-first CSS framework for rapid UI development with custom components, responsive design, animations, and maintainable styling systems',
          'Vue.js': 'Progressive JavaScript framework with reactive data binding, component composition, Vuex state management, and Vue Router for SPA development'
        },
        Backend: {
          'Node.js': 'Server-side JavaScript runtime with Express.js, RESTful APIs, middleware, authentication, microservices architecture, and scalable backend solutions',
          'Python': 'Backend development with Django, Flask, FastAPI, data processing, automation scripts, API development, and integration with various databases and services',
          'Java': 'Enterprise-level backend development with Spring Boot, microservices, REST APIs, database integration, and robust application architecture',
          'Express.js': 'Minimalist Node.js framework for building fast APIs, middleware, routing, error handling, and scalable server applications with comprehensive ecosystem',
          'Ruby': 'Backend development with Ruby on Rails, MVC architecture, RESTful APIs, database migrations, and rapid application development with elegant syntax',
          'PHP': 'Server-side scripting with Laravel, Symfony, REST APIs, database integration, authentication systems, and content management system development',
          'REST APIs': 'Design and implementation of RESTful web services with proper HTTP methods, status codes, error handling, authentication, versioning, and comprehensive API documentation',
          'JWT': 'JSON Web Token implementation for secure authentication with compact tokens, signature algorithms, refresh token patterns, Express.js middleware, role-based access control, and production-ready security workflows'
        },
        Database: {
          'SQL': 'Relational database design and management with complex queries, joins, subqueries, stored procedures, indexing strategies, transaction management, and performance optimization',
          'MongoDB': 'NoSQL database with document storage, aggregation pipelines, indexing strategies, sharding, and performance optimization for large-scale applications',
          'MySQL': 'Relational database management with complex queries, stored procedures, indexing, replication, backup strategies, and performance tuning',
          'PostgreSQL': 'Advanced relational database with JSON support, full-text search, window functions, complex queries, and enterprise-grade features',
          'Redis': 'In-memory data structure store for caching, session management, real-time analytics, pub/sub messaging, and high-performance data operations',
          'Mongoose': 'MongoDB object modeling for Node.js with schema validation, middleware, population, aggregation, and comprehensive data management in MongoDB applications',
          'Firebase': 'Real-time NoSQL database with cloud functions, authentication, hosting, and comprehensive mobile/web app development platform',
          'SQLite': 'Lightweight embedded database for mobile apps, desktop applications, local data storage, and efficient data management in resource-constrained environments'
        },
        DevOps: {
          'Docker': 'Containerization technology with multi-stage builds, orchestration, microservices deployment, development environments, and production-ready container management',
          'CI/CD': 'Continuous integration and deployment with GitHub Actions, Jenkins, automated testing, deployment pipelines, and infrastructure as code principles',
          'AWS': 'Cloud computing with EC2, S3, Lambda, RDS, CloudFront, and comprehensive AWS services for scalable, reliable, and cost-effective infrastructure',
          'Linux': 'Server administration, shell scripting, system monitoring, security hardening, performance optimization, and command-line workflow automation',
          'Nginx': 'High-performance web server with load balancing, reverse proxying, SSL termination, caching strategies, and optimal configuration for web applications'
        },
        Tools: {
          'Git/GitHub': 'Version control system with branching strategies, merge conflicts resolution, collaborative development workflows, code reviews, pull requests, and comprehensive repository management on GitHub',
          'VS Code': 'Advanced code editor with extensions, debugging, integrated terminal, Git integration, and customizable development environment',
          'Webpack': 'Module bundler for modern JavaScript applications with code splitting, tree shaking, lazy loading, and optimized asset management',
          'NPM/Yarn': 'Package management with dependency resolution, version control, scripts, publishing, and comprehensive module ecosystem management',
          'Figma': 'Collaborative design tool with prototyping, component libraries, design systems, responsive design, and team collaboration features',
          'Postman': 'API testing and development with request collection, automated testing, documentation generation, and comprehensive API workflow management'
        },
        Security: {
          'Authentication': 'User authentication systems with password hashing using bcrypt/scrypt, session management, OAuth 2.0 integration with Google, GitHub, Facebook, two-factor authentication (2FA), email verification, password reset functionality, login attempt tracking, account lockout mechanisms, secure session storage, and comprehensive security measures to protect against common vulnerabilities'
        },
        'Data Analytics': {
          'Python': 'Comprehensive data analysis with Pandas, NumPy, Matplotlib, Seaborn, Jupyter notebooks, statistical analysis, machine learning, and data visualization workflows',
          'Pandas': 'Python data manipulation library with DataFrame operations, data cleaning, filtering, grouping, merging, time series analysis, and comprehensive data transformation',
          'NumPy': 'Numerical computing library with array operations, mathematical functions, linear algebra, statistical analysis, scientific computing, and high-performance data processing',
          'Matplotlib': 'Python data visualization library with plotting capabilities, chart customization, statistical plots, interactive visualizations, and comprehensive data representation',
          'MS Excel': 'Advanced data analysis with complex formulas, pivot tables, data visualization, dashboard creation, statistical analysis, and business intelligence reporting',
          'Python Data Analysis': 'Data manipulation with Pandas, NumPy, statistical analysis, data cleaning, visualization with Matplotlib/Seaborn, and Jupyter notebook workflows',
          'Tableau': 'Business intelligence and data visualization with interactive dashboards, data storytelling, advanced calculations, and comprehensive analytics solutions',
          'Power BI': 'Microsoft business intelligence tool with DAX formulas, data modeling, interactive reports, real-time dashboards, and enterprise analytics capabilities',
          'SQL Analytics': 'Advanced SQL queries for data analysis, window functions, CTEs, performance optimization, and complex data extraction and transformation',
          'Google Analytics': 'Web analytics implementation with tracking codes, custom dimensions, conversion tracking, reporting, and data-driven marketing insights'
        }
      };

      // Add MS Excel to Data Analytics if it doesn't exist
      if (fetchedSkills['Data Analytics']) {
        const hasExcel = fetchedSkills['Data Analytics'].some(skill => skill.name === 'MS Excel');
        if (!hasExcel) {
          fetchedSkills['Data Analytics'].unshift({
            _id: 'excel-temp',
            name: 'MS Excel',
            proficiency: 90,
            experience: '5+ years',
            icon: '📊',
            description: enhancedDescriptions['Data Analytics']['MS Excel']
          });
        }
      }

      // Enhance descriptions for existing skills
      Object.keys(fetchedSkills).forEach(category => {
        fetchedSkills[category].forEach(skill => {
          if (enhancedDescriptions[category] && enhancedDescriptions[category][skill.name]) {
            skill.description = enhancedDescriptions[category][skill.name];
          }
        });
      });

      setSkills(fetchedSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Frontend: 'from-amber-500 to-yellow-500',
      Backend: 'from-amber-600 to-yellow-600',
      Database: 'from-amber-500 to-orange-500',
      DevOps: 'from-yellow-500 to-amber-600',
      Tools: 'from-amber-400 to-yellow-400',
      Security: 'from-red-500 to-orange-500',
      'Data Analytics': 'from-amber-600 to-orange-600',
    };
    return colors[category] || 'from-amber-500 to-yellow-500';
  };

  const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  };

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

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Technical Skills
            </span>
          </h1>

          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 shadow-xl rounded-3xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(skills).map(([category, categorySkills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: categoryIndex * 0.15,
                  type: "spring"
                }}
              >
                {/* Category Header */}
                <div className="bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl shadow-xl p-8 mb-8">
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${getCategoryColor(category)} bg-clip-text text-transparent mb-4`}>
                    {category}
                  </h2>
                  <div className={`h-1 w-32 bg-gradient-to-r ${getCategoryColor(category)} rounded-full`}></div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: categoryIndex * 0.15 + skillIndex * 0.1,
                        type: "spring"
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                        transition: { duration: 0.3 }
                      }}
                      className="group relative"
                    >
                      {/* Luxury Skill Card */}
                      <div className="relative h-full bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-amber-200/20 dark:hover:shadow-amber-800/20 transition-all duration-500 overflow-hidden">

                        {/* Glass Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-yellow-50/20 dark:from-amber-900/20 dark:via-transparent dark:to-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100/30 via-yellow-100/20 to-transparent dark:from-amber-800/30 dark:via-yellow-800/20 dark:to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-100/30 via-amber-100/20 to-transparent dark:from-yellow-800/30 dark:via-amber-800/20 dark:to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Skill Content */}
                        <div className="relative p-8">
                          {/* Skill Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                                {skill.name}
                              </h3>
                              {skill.experience && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {skill.experience}
                                </p>
                              )}
                            </div>
                            <span className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(category)} text-white rounded-full text-xs font-bold shadow-lg`}>
                              {getProficiencyLabel(skill.proficiency)}
                            </span>
                          </div>

                          {/* Description */}
                          {skill.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                              {skill.description}
                            </p>
                          )}

                          {/* Proficiency Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Proficiency
                              </span>
                              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 1.5,
                                  delay: categoryIndex * 0.15 + skillIndex * 0.1 + 0.3,
                                  ease: "easeOut"
                                }}
                                className={`h-full bg-gradient-to-r ${getCategoryColor(category)} rounded-full relative overflow-hidden`}
                              >
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                              </motion.div>
                            </div>
                          </div>

                                                  </div>

                        {/* Hover Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 dark:via-amber-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-white dark:bg-gray-800 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl shadow-xl p-12"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 rounded-full mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Continuous Learning
              </span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              I'm constantly expanding my skill set and staying updated with the latest technologies and best practices in web development and data analytics. Always eager to learn and take on new challenges!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-800/30 rounded-full">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">📚 Lifelong Learner</span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-800/30 rounded-full">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">🚀 Innovation Driven</span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-800/30 rounded-full">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">💡 Problem Solver</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;
