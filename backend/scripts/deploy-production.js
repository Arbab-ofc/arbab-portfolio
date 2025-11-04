#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Production Deployment Validation Script');
console.log('==========================================\n');

// Check for required environment files
const requiredFiles = [
  '.env.production',
  '.env.example'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Missing required files. Please create them before proceeding.');
  process.exit(1);
}

// Validate production environment configuration
console.log('\n🔧 Validating production configuration...');
const prodEnvPath = path.join(__dirname, '..', '.env.production');
const prodEnvContent = fs.readFileSync(prodEnvPath, 'utf8');

const criticalVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
  'CORS_ORIGIN',
  'EMAIL_USER',
  'CLOUDINARY_CLOUD_NAME',
  'ADMIN_EMAIL'
];

let validationErrors = [];

criticalVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = prodEnvContent.match(regex);

  if (match) {
    const value = match[1].trim();

    // Check for placeholder values
    if (value.includes('<') && value.includes('>')) {
      validationErrors.push(`❌ ${varName} contains placeholder value: ${value}`);
    } else if (varName.includes('SECRET') && value.length < 32) {
      validationErrors.push(`❌ ${varName} is too short (minimum 32 characters)`);
    } else if (varName === 'NODE_ENV' && value !== 'production') {
      validationErrors.push(`❌ NODE_ENV should be 'production', got '${value}'`);
    } else {
      console.log(`✅ ${varName} is configured`);
    }
  } else {
    validationErrors.push(`❌ ${varName} is missing`);
  }
});

// Check for deprecated options
if (prodEnvContent.includes('useNewUrlParser') ||
    prodEnvContent.includes('useUnifiedTopology')) {
  console.log('⚠️  Warning: Deprecated MongoDB options found');
}

if (validationErrors.length > 0) {
  console.log('\n❌ Validation errors found:');
  validationErrors.forEach(error => console.log(error));
  console.log('\nPlease fix these issues before deploying to production.');
  process.exit(1);
}

// Check if secrets need to be generated
console.log('\n🔐 Checking security configuration...');
const jwtSecretMatch = prodEnvContent.match(/^JWT_SECRET=(.+)$/m);
const jwtRefreshSecretMatch = prodEnvContent.match(/^JWT_REFRESH_SECRET=(.+)$/m);

if (jwtSecretMatch && jwtRefreshSecretMatch) {
  const jwtSecret = jwtSecretMatch[1];
  const jwtRefreshSecret = jwtRefreshSecretMatch[1];

  if (jwtSecret.length < 64) {
    console.log('⚠️  Warning: JWT_SECRET should be at least 64 characters for production');
  }

  if (jwtRefreshSecret.length < 64) {
    console.log('⚠️  Warning: JWT_REFRESH_SECRET should be at least 64 characters for production');
  }

  if (jwtSecret === jwtRefreshSecret) {
    console.log('❌ Error: JWT_SECRET and JWT_REFRESH_SECRET should be different');
    process.exit(1);
  }
}

// Check directory structure
console.log('\n📁 Checking directory structure...');
const requiredDirs = [
  'logs',
  'uploads',
  'scripts'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/ directory exists`);
  } else {
    console.log(`📁 Creating ${dir}/ directory...`);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ ${dir}/ directory created`);
  }
});

// Security checks
console.log('\n🔒 Performing security checks...');

// Check if .gitignore includes sensitive files
const gitignorePath = path.join(__dirname, '..', '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const sensitivePatterns = ['.env', 'logs/', 'node_modules/', '*.log'];

  let allIgnored = true;
  sensitivePatterns.forEach(pattern => {
    if (!gitignoreContent.includes(pattern)) {
      console.log(`⚠️  Warning: ${pattern} should be in .gitignore`);
      allIgnored = false;
    }
  });

  if (allIgnored) {
    console.log('✅ Sensitive files are properly ignored');
  }
} else {
  console.log('⚠️  Warning: .gitignore file not found');
}

// Check package.json for production dependencies
console.log('\n📦 Checking production dependencies...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const productionDeps = Object.keys(packageJson.dependencies || {});
const securityPackages = ['helmet', 'express-rate-limit', 'express-mongo-sanitize', 'xss-clean'];

securityPackages.forEach(pkg => {
  if (productionDeps.includes(pkg)) {
    console.log(`✅ ${pkg} is installed`);
  } else {
    console.log(`⚠️  Warning: ${pkg} not found in dependencies`);
  }
});

// Final validation summary
console.log('\n📊 Validation Summary');
console.log('=====================');

if (validationErrors.length === 0) {
  console.log('✅ All critical checks passed!');
  console.log('✅ Application is ready for production deployment');

  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm run build (if applicable)');
  console.log('2. Set up SSL certificate');
  console.log('3. Configure reverse proxy (nginx/apache)');
  console.log('4. Set up process manager (PM2)');
  console.log('5. Configure monitoring and logging');
  console.log('6. Test all functionality');
  console.log('7. Set up backup procedures');

  console.log('\n🎉 You can now proceed with production deployment!');

} else {
  console.log('❌ Validation failed. Please fix the issues above.');
  process.exit(1);
}

// Generate deployment command suggestions
console.log('\n💡 Deployment Commands:');
console.log('=========================');
console.log('# Install dependencies');
console.log('npm ci --production');
console.log('');
console.log('# Start with PM2 (recommended)');
console.log('pm2 start ecosystem.config.js --env production');
console.log('');
console.log('# Or start directly');
console.log('NODE_ENV=production npm start');