import { motion } from 'framer-motion';
import {FiFileText, FiCode, FiShield, FiAlertTriangle, FiCheckCircle, FiXCircle, FiTerminal, FiCpu, FiHardDrive, FiZap} from 'react-icons/fi';

const TermsOfServices = () => {
  const sections = [
    {
      icon: FiFileText,
      title: 'Service Agreement',
      subtitle: 'Terms and Conditions',
      content: [
        {
          type: 'command',
          label: 'Acceptance of Terms',
          value: 'By accessing and using this portfolio website, you accept and agree to be bound by these terms and conditions'
        },
        {
          type: 'command',
          label: 'Modification of Terms',
          value: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting'
        },
        {
          type: 'command',
          label: 'Governing Law',
          value: 'These terms are governed by and construed in accordance with the laws of India'
        }
      ]
    },
    {
      icon: FiCode,
      title: 'Services Provided',
      subtitle: 'Portfolio and Professional Services',
      content: [
        {
          type: 'process',
          label: 'Portfolio Display',
          value: 'Showcase of projects, skills, and professional experience'
        },
        {
          type: 'process',
          label: 'Contact Services',
          value: 'Professional inquiries and project collaboration requests'
        },
        {
          type: 'process',
          label: 'Content Delivery',
          value: 'Blog articles, tutorials, and technical insights'
        },
        {
          type: 'process',
          label: 'Response Communication',
          value: 'Professional responses to inquiries within 24-48 hours'
        }
      ]
    },
    {
      icon: FiShield,
      title: 'User Responsibilities',
      subtitle: 'Acceptable Use Policy',
      content: [
        {
          type: 'warning',
          label: 'Prohibited Activities',
          value: 'No spam, harassment, or unauthorized commercial use'
        },
        {
          type: 'warning',
          label: 'Content Guidelines',
          value: 'Submit only professional and relevant inquiries'
        },
        {
          type: 'warning',
          label: 'Intellectual Property',
          value: 'Respect copyright and trademark laws'
        },
        {
          type: 'warning',
          label: 'Security',
          value: 'Do not attempt to compromise website security'
        }
      ]
    },
    {
      icon: FiZap,
      title: 'Service Availability',
      subtitle: 'Uptime and Performance',
      content: [
        {
          type: 'success',
          label: 'Service Status',
          value: 'Best effort to maintain 99.9% uptime'
        },
        {
          type: 'success',
          label: 'Maintenance Windows',
          value: 'Scheduled maintenance will be announced when possible'
        },
        {
          type: 'success',
          label: 'Performance Standards',
          value: 'Optimized for modern browsers and devices'
        },
        {
          type: 'success',
          label: 'Support Response',
          value: 'Technical issues addressed within 24 hours'
        }
      ]
    },
    {
      icon: FiAlertTriangle,
      title: 'Limitations and Liability',
      subtitle: 'Disclaimer of Warranties',
      content: [
        {
          type: 'warning',
          label: 'Service "As Is"',
          value: 'Services provided without warranties of any kind'
        },
        {
          type: 'warning',
          label: 'Limitation of Liability',
          value: 'Not liable for indirect, incidental, or consequential damages'
        },
        {
          type: 'warning',
          label: 'Third-Party Content',
          value: 'Not responsible for external linked content'
        },
        {
          type: 'warning',
          label: 'User Responsibility',
          value: 'Users responsible for their actions and content'
        }
      ]
    },
    {
      icon: FiCheckCircle,
      title: 'Intellectual Property',
      subtitle: 'Content Rights and Usage',
      content: [
        {
          type: 'success',
          label: 'Portfolio Content',
          value: 'All portfolio content remains property of Arbab Arshad'
        },
        {
          type: 'success',
          label: 'User Submissions',
          value: 'Contact form submissions used for response purposes only'
        },
        {
          type: 'success',
          label: 'Usage Rights',
          value: 'Content may not be reproduced without permission'
        },
        {
          type: 'success',
          label: 'Attribution',
          value: 'Proper attribution required for any shared content'
        }
      ]
    },
    {
      icon: FiXCircle,
      title: 'Termination',
      subtitle: 'Service Access',
      content: [
        {
          type: 'command',
          label: 'User Termination',
          value: 'Users may stop using the service at any time'
        },
        {
          type: 'command',
          label: 'Service Termination',
          value: 'We reserve the right to terminate access for violations'
        },
        {
          type: 'command',
          label: 'Data Retention',
          value: 'Contact data retained only as necessary for communication'
        },
        {
          type: 'command',
          label: 'Effect of Termination',
          value: 'Rights and obligations survive termination'
        }
      ]
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'command': return 'text-green-600 border-green-500/30 bg-green-500/5';
      case 'process': return 'text-blue-600 border-blue-500/30 bg-blue-500/5';
      case 'warning': return 'text-orange-600 border-orange-500/30 bg-orange-500/5';
      case 'success': return 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5';
      default: return 'text-gray-600 border-gray-500/30 bg-gray-500/5';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'command': return <FiTerminal className="w-4 h-4" />;
      case 'process': return <FiCpu className="w-4 h-4" />;
      case 'warning': return <FiAlertTriangle className="w-4 h-4" />;
      case 'success': return <FiCheckCircle className="w-4 h-4" />;
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
            const terms_{i} = "{Math.random() > 0.5 ? 'agreed' : 'accepted'}";
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
                  <span>terms-of-service.jsx</span>
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
                <span className="text-amber-500">$</span> cat terms-of-service.md
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
                    <FiFileText className="w-8 h-8 text-amber-500" />
                    <h1 className="text-4xl font-bold text-white">
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        Terms of Service
                      </span>
                    </h1>
                    <FiFileText className="w-8 h-8 text-amber-500" />
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

            {/* Terms Sections */}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{section.title}</h3>
                          <p className="text-gray-400 text-sm">{section.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs font-mono">
                        Section {sectionIndex + 1}
                      </div>
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
                        className={`border rounded-lg p-4 ${getTypeColor(item.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded bg-gray-800/50 flex items-center justify-center flex-shrink-0 mt-1">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-gray-400 font-mono text-xs">
                                {item.type === 'command' ? '$' : item.type === 'process' ? '→' : item.type === 'warning' ? '!' : '✓'}
                              </span>
                              <span className="font-semibold text-white font-mono text-sm">
                                {item.label}:
                              </span>
                            </div>
                            <div className="font-mono text-sm text-gray-300 pl-4 leading-relaxed">
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

            {/* Agreement Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mt-12 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Agreement Confirmation</h3>
              </div>
              <div className="text-gray-300 font-mono text-sm leading-relaxed">
                By continuing to use this portfolio website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Privacy Policy.
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="text-green-500 font-mono text-sm">
                  <span className="text-amber-500">$</span> echo "Terms accepted: $(date)"
                </div>
              </div>
            </motion.div>

            {/* Terminal Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-12 pt-6 border-t border-gray-700"
            >
              <div className="text-green-500 font-mono text-sm">
                <span className="text-amber-500">$</span> echo "Terms of service loaded successfully"
              </div>
              <div className="text-gray-500 font-mono text-xs mt-2">
                // End of terms-of-service.jsx
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServices;