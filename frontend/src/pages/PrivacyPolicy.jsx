import { motion } from 'framer-motion';
import { FiShield, FiLock, FiDatabase, FiEye, FiUser, FiMail, FiGlobe, FiTerminal, FiCode, FiCpu, FiHardDrive } from 'react-icons/fi';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FiUser,
      title: 'Information We Collect',
      content: [
        {
          type: 'input',
          label: 'Personal Data',
          value: 'name, email, phone, company'
        },
        {
          type: 'input',
          label: 'Contact Information',
          value: 'email addresses, phone numbers'
        },
        {
          type: 'input',
          label: 'Professional Information',
          value: 'company, job title, experience'
        },
        {
          type: 'input',
          label: 'Usage Data',
          value: 'IP address, browser type, access time'
        }
      ]
    },
    {
      icon: FiLock,
      title: 'How We Protect Your Data',
      content: [
        {
          type: 'command',
          label: 'Encryption',
          value: 'SSL/TLS encryption for all data transmission'
        },
        {
          type: 'command',
          label: 'Access Control',
          value: 'Role-based authentication and authorization'
        },
        {
          type: 'command',
          label: 'Data Backup',
          value: 'Regular automated backups with redundancy'
        },
        {
          type: 'command',
          label: 'Security Audits',
          value: 'Regular security assessments and penetration testing'
        }
      ]
    },
    {
      icon: FiDatabase,
      title: 'Data Usage',
      content: [
        {
          type: 'process',
          label: 'Communication',
          value: 'Respond to inquiries and provide support'
        },
        {
          type: 'process',
          label: 'Service Delivery',
          value: 'Deliver requested services and features'
        },
        {
          type: 'process',
          label: 'Analytics',
          value: 'Improve services through usage analysis'
        },
        {
          type: 'process',
          label: 'Legal Compliance',
          value: 'Meet legal and regulatory requirements'
        }
      ]
    },
    {
      icon: FiEye,
      title: 'Data Sharing',
      content: [
        {
          type: 'warning',
          label: 'Service Providers',
          value: 'Cloud hosting, email services, analytics tools'
        },
        {
          type: 'warning',
          label: 'Legal Requirements',
          value: 'When required by law or legal process'
        },
        {
          type: 'success',
          label: 'No Third-Party Sales',
          value: 'We never sell personal data to third parties'
        },
        {
          type: 'success',
          label: 'Limited Access',
          value: 'Only authorized personnel can access data'
        }
      ]
    },
    {
      icon: FiTerminal,
      title: 'Your Rights',
      content: [
        {
          type: 'command',
          label: 'Access Request',
          value: 'Request copies of your personal data'
        },
        {
          type: 'command',
          label: 'Data Correction',
          value: 'Correct inaccurate or incomplete data'
        },
        {
          type: 'command',
          label: 'Data Deletion',
          value: 'Request deletion of your personal data'
        },
        {
          type: 'command',
          label: 'Portability',
          value: 'Request data transfer to another service'
        }
      ]
    },
    {
      icon: FiMail,
      title: 'Contact Information',
      content: [
        {
          type: 'input',
          label: 'Email',
          value: 'arbabprvt@gmail.com'
        },
        {
          type: 'input',
          label: 'Response Time',
          value: 'Within 24-48 hours'
        },
        {
          type: 'input',
          label: 'Data Protection Officer',
          value: 'Available for privacy concerns'
        },
        {
          type: 'input',
          label: 'Legal Address',
          value: 'IIIT Bhagalpur, Bihar, India'
        }
      ]
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'command': return 'text-green-600 border-green-500/30';
      case 'input': return 'text-amber-600 border-amber-500/30';
      case 'process': return 'text-blue-600 border-blue-500/30';
      case 'warning': return 'text-orange-600 border-orange-500/30';
      case 'success': return 'text-emerald-600 border-emerald-500/30';
      default: return 'text-gray-600 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'command': return <FiTerminal className="w-4 h-4" />;
      case 'input': return <FiCode className="w-4 h-4" />;
      case 'process': return <FiCpu className="w-4 h-4" />;
      case 'warning': return <FiShield className="w-4 h-4" />;
      case 'success': return <FiHardDrive className="w-4 h-4" />;
      default: return <FiCode className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
      {/* MacBook-style Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

      {/* Terminal Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(to right, #10b981 1px, transparent 1px),
            linear-gradient(to bottom, #10b981 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500/20 font-mono text-sm"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            const data_{i} = "{Math.random() > 0.5 ? 'encrypted' : 'secure'}";
          </motion.div>
        ))}
      </div>

      {/* Terminal Window Frame */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900 border border-gray-700 rounded-t-2xl shadow-2xl overflow-hidden"
        >
          {/* Terminal Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm font-mono">
                  <FiTerminal className="w-4 h-4 text-green-500" />
                  <span>privacy-policy.jsx</span>
                </div>
              </div>
              <div className="text-gray-500 text-xs font-mono">
                UTF-8 | JavaScript | React
              </div>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="bg-gray-900 p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="text-green-500 font-mono text-sm mb-2">
                <span className="text-amber-500">$</span> cat privacy-policy.md
              </div>

              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <FiShield className="w-8 h-8 text-amber-500" />
                    <h1 className="text-4xl font-bold text-white">
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        Privacy Policy
                      </span>
                    </h1>
                    <FiShield className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="text-gray-400 font-mono text-sm">
                    Last Updated: {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + sectionIndex * 0.1 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700/50 px-6 py-4 border-b border-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-6 space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className={`bg-gray-900/50 border rounded-lg p-4 ${getTypeColor(item.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded bg-gray-800/50 flex items-center justify-center flex-shrink-0 mt-1">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-gray-400 font-mono text-xs">
                                {item.type === 'command' ? '$' : item.type === 'input' ? '>' : item.type === 'process' ? '→' : item.type === 'warning' ? '!' : '✓'}
                              </span>
                              <span className="font-semibold text-white font-mono text-sm">
                                {item.label}:
                              </span>
                            </div>
                            <div className="font-mono text-sm text-gray-300 pl-4">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Terminal Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 pt-6 border-t border-gray-700"
            >
              <div className="text-green-500 font-mono text-sm">
                <span className="text-amber-500">$</span> echo "Privacy policy loaded successfully"
              </div>
              <div className="text-gray-500 font-mono text-xs mt-2">
                // End of privacy-policy.jsx
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;