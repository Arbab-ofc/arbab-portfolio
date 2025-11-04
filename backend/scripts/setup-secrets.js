#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Production Security Setup Script');
console.log('===================================\n');

// Generate cryptographically secure secrets
const secrets = {
  JWT_SECRET: crypto.randomBytes(64).toString('base64'),
  JWT_REFRESH_SECRET: crypto.randomBytes(64).toString('base64'),
  SESSION_SECRET: crypto.randomBytes(32).toString('base64'),
};

console.log('📝 Generated Secure Secrets:');
console.log('===========================');
Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

console.log('\n⚠️  IMPORTANT SECURITY INSTRUCTIONS:');
console.log('==================================');
console.log('1. Copy these secrets to your .env.production file');
console.log('2. NEVER commit secrets to version control');
console.log('3. Store these secrets in a secure location');
console.log('4. Use different secrets for development and production');
console.log('5. Rotate secrets regularly (every 90 days recommended)');

console.log('\n🔧 Additional Security Recommendations:');
console.log('====================================');
console.log('1. Enable 2FA on all external services (Cloudinary, Email)');
console.log('2. Use environment-specific databases');
console.log('3. Set up monitoring and alerting');
console.log('4. Implement backup and recovery procedures');
console.log('5. Regular security audits and updates');

console.log('\n✅ Setup script completed successfully!');