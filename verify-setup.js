#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 QuickCourt Setup Verification');
console.log('================================');

// Check backend
const backendPath = path.join(__dirname, 'backend');
const backendPackagePath = path.join(backendPath, 'package.json');
const backendEnvPath = path.join(backendPath, '.env');

console.log('\n📁 Backend Status:');
if (fs.existsSync(backendPackagePath)) {
    console.log('✅ package.json found');
} else {
    console.log('❌ package.json missing');
}

if (fs.existsSync(backendEnvPath)) {
    console.log('✅ .env file found');
} else {
    console.log('⚠️  .env file missing - copy from .env.example');
}

// Check frontend
const frontendPath = path.join(__dirname, 'frontend', 'QuickCourt');
const frontendPackagePath = path.join(frontendPath, 'package.json');
const frontendEnvPath = path.join(frontendPath, '.env');

console.log('\n📁 Frontend Status:');
if (fs.existsSync(frontendPackagePath)) {
    console.log('✅ package.json found');
} else {
    console.log('❌ package.json missing');

}

if (fs.existsSync(frontendEnvPath)) {
    console.log('✅ .env file found');
} else {
    console.log('⚠️  .env file missing - copy from .env.example');
}

console.log('\n🎯 Next Steps:');
console.log('1. Install dependencies: npm run setup');
console.log('2. Configure environment variables');
console.log('3. Start MongoDB service');
console.log('4. Run backend: cd backend && npm run dev');
console.log('5. Run frontend: cd frontend/QuickCourt && npm run dev');
