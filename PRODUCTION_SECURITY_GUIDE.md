# 🚀 Production Security Setup Guide

This guide provides comprehensive instructions for securely deploying the Arbab Portfolio application to production.

## 📋 Table of Contents

1. [Critical Security Setup](#critical-security-setup)
2. [Environment Configuration](#environment-configuration)
3. [Database Security](#database-security)
4. [API Security](#api-security)
5. [Frontend Security](#frontend-security)
6. [Deployment Security](#deployment-security)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔒 CRITICAL SECURITY SETUP

### 1. Generate Secure Secrets

**⚠️ IMMEDIATE ACTION REQUIRED**

Run the security setup script to generate cryptographically secure secrets:

```bash
cd backend
node scripts/setup-secrets.js
```

**Replace ALL placeholder values in `.env.production`** with the generated secrets:

```env
# Generate these using the setup script
JWT_SECRET=<generated_64_character_secret>
JWT_REFRESH_SECRET=<generated_64_character_secret>
SESSION_SECRET=<generated_32_character_secret>
```

### 2. Update Production Environment Variables

Copy and configure the production environment file:

```bash
cd backend
cp .env.production .env.local
```

**Critical variables to update:**

```env
# Database
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster>/?appName=<app-name>

# Frontend URL
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# Email Configuration
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Credentials (CHANGE IMMEDIATELY)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong_12_character_password>
```

---

## 🛡️ ENVIRONMENT CONFIGURATION

### Production Environment Setup

1. **Set Node.js Environment:**
   ```env
   NODE_ENV=production
   ```

2. **Configure Rate Limiting:**
   ```env
   RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
   RATE_LIMIT_MAX_REQUESTS=100   # Conservative limit
   ```

3. **Enable Security Features:**
   ```env
   ENABLE_HELMET=true
   ENABLE_COMPRESSION=true
   CORS_CREDENTIALS=true
   SESSION_SECURE=true
   SESSION_HTTP_ONLY=true
   ```

### Development vs Production

| Setting | Development | Production |
|---------|-------------|-------------|
| `NODE_ENV` | `development` | `production` |
| `JWT_EXPIRE` | `7d` | `15m` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | `100` |
| `CORS_ORIGIN` | `localhost:*` | `https://yourdomain.com` |
| `SESSION_SECURE` | `false` | `true` |

---

## 🗄️ DATABASE SECURITY

### MongoDB Security Configuration

1. **Use Strong Authentication:**
   ```javascript
   // Use strong passwords and role-based access
   MONGODB_URI=mongodb+srv://<username>:<strong_password>@<cluster>/?appName=<app-name>
   ```

2. **Enable Network Access Control:**
   - Whitelist your server IP addresses
   - Disable access from unknown IPs
   - Use VPC peering for enhanced security

3. **Database Security Best Practices:**
   - Enable authentication for all databases
   - Use role-based access control (RBAC)
   - Enable audit logging
   - Regular security updates

### Connection Security

```javascript
// Production MongoDB connection options
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  bufferCommands: false,
}
```

---

## 🔐 API SECURITY

### Authentication & Authorization

1. **JWT Security Features:**
   - ✅ Strong algorithm (HS256)
   - ✅ Short token expiration (15 minutes)
   - ✅ Refresh token rotation
   - ✅ Issuer and audience validation
   - ✅ Password change invalidation

2. **Rate Limiting:**
   - ✅ Global API rate limiting
   - ✅ Endpoint-specific limits
   - ✅ Auth attempt limiting
   - ✅ IP-based blocking

3. **Input Validation:**
   - ✅ Comprehensive validation using express-validator
   - ✅ XSS protection
   - ✅ SQL injection prevention
   - ✅ File upload security

### Security Headers

```javascript
// Helmet configuration includes:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security
- Content-Security-Policy
```

### CORS Configuration

**Production CORS Settings:**
- Only allow specific origins
- Secure credential transmission
- Limited allowed headers
- Method restrictions
- Caching optimization

---

## 🎨 FRONTEND SECURITY

### Environment Variables

Create `.env.production` in the frontend directory:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Arbab Portfolio
VITE_APP_VERSION=1.0.0
```

### Security Best Practices

1. **API Communication:**
   - Use HTTPS for all API calls
   - Validate responses
   - Handle errors securely
   - Store tokens securely

2. **Content Security:**
   - Sanitize user input
   - Escape dynamic content
   - Validate file uploads
   - Secure cookie handling

---

## 🚀 DEPLOYMENT SECURITY

### SSL/HTTPS Configuration

1. **Obtain SSL Certificate:**
   - Use Let's Encrypt (free)
   - Or purchase from a certificate authority
   - Configure automatic renewal

2. **Server Configuration:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;

       # SSL security headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
       add_header X-Frame-Options DENY always;
       add_header X-Content-Type-Options nosniff always;
   }
   ```

### Firewall Configuration

```bash
# UFW (Ubuntu) firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Process Management

Use PM2 for production process management:

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat ecosystem.config.js

# Start application
pm2 start ecosystem.config.js --env production

# Setup startup script
pm2 startup
pm2 save
```

### PM2 Configuration

```javascript
module.exports = {
  apps: [{
    name: 'arbab-portfolio-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
```

---

## 📊 MONITORING & MAINTENANCE

### Logging Configuration

```javascript
// Production logging setup
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Security Monitoring

1. **Implement Monitoring:**
   - Failed login attempts
   - Unusual API usage patterns
   - Error rate monitoring
   - Performance metrics

2. **Regular Security Tasks:**
   - Update dependencies weekly
   - Security audit quarterly
   - Password rotation every 90 days
   - Backup verification monthly

### Backup Strategy

1. **Database Backups:**
   ```bash
   # Automated daily backups
   mongodump --uri="<production-uri>" --out="/backup/$(date +%Y%m%d)"

   # Retention policy (30 days)
   find /backup -type d -mtime +30 -exec rm -rf {} \;
   ```

2. **Code Backups:**
   - Git repository with tags
   - Environment variables backup
   - Configuration files backup

---

## 🔄 DEPLOYMENT CHECKLIST

### Pre-Deployment Checklist

- [ ] All credentials replaced with production values
- [ ] Strong JWT secrets generated (64 characters)
- [ ] CORS configured for production domain
- [ ] SSL certificate installed and configured
- [ ] Database security configured
- [ ] Rate limiting properly set
- [ ] Security headers enabled
- [ ] Error handling tested
- [ ] Monitoring implemented
- [ ] Backup strategy configured
- [ ] Security audit completed

### Post-Deployment Checklist

- [ ] Application accessible via HTTPS
- [ ] All API endpoints working
- [ ] Authentication functioning
- [ ] File uploads working
- [ ] Database connections stable
- [ ] Logs are being generated
- [ ] Monitoring alerts configured
- [ ] Performance baseline established
- [ ] Security headers verified
- [ ] SSL certificate valid
- [ ] Backup process tested

---

## 🚨 SECURITY INCIDENT RESPONSE

### Immediate Actions (If Security Breach Detected)

1. **Isolate the affected system**
2. **Change all credentials and secrets**
3. **Enable additional logging**
4. **Notify stakeholders**
5. **Investigate the breach**
6. **Patch vulnerabilities**
7. **Monitor for suspicious activity**

### Emergency Contacts

- **Database Administrator:** [Contact Information]
- **Hosting Provider:** [Contact Information]
- **Security Team:** [Contact Information]

---

## 📚 ADDITIONAL RESOURCES

### Security Tools

- **OWASP ZAP:** Security scanning
- **Nessus:** Vulnerability assessment
- **SSL Labs:** SSL certificate testing
- **SecurityHeaders.com:** Header analysis

### Documentation

- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/security-best-practices.html)

---

**⚠️ IMPORTANT:** This security guide should be reviewed and updated regularly. Security is an ongoing process, not a one-time setup.

**📞 For security issues or questions, contact the development team immediately.**