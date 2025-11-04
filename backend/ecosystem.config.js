module.exports = {
  apps: [
    {
      name: 'arbab-portfolio-backend',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',

      // Environment configurations
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },

      // Logging configuration
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Performance and memory management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      node_args: '--max_old_space_size=1024',

      // Process management
      kill_timeout: 5000,
      listen_timeout: 8000,
      restart_delay: 4000,

      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads', '.git'],

      // Auto-restart on file changes (development only)
      watch_options: {
        followSymlinks: false,
        usePolling: false,
        interval: 1000
      },

      // Graceful shutdown
      shutdown_with_message: true,

      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,

      // Environment specific settings
      autorestart: true,
      force_name: true,
      source_map_support: false, // Disable in production for better performance
    }
  ],

  // Deployment configuration (optional - for automated deployment)
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/arbab-portfolio.git',
      path: '/var/www/arbab-portfolio',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },

    staging: {
      user: 'node',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:username/arbab-portfolio.git',
      path: '/var/www/arbab-portfolio-staging',
      'post-deploy': 'npm ci --production && pm2 reload ecosystem.config.js --env staging'
    }
  }
};