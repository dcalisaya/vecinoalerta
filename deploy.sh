#!/bin/bash

# Vecino Alerta Deployment Script

echo "🚀 Starting Deployment Process..."
set -e

# 1. Backend Deployment
echo "\n📦 Deploying Backend (Functions & Firestore)..."
cd vecino-alerta-backend/functions
npm install
npm run build
cd ..
# Assumes firebase.json is in vecino-alerta-backend or root. 
# If in backend subfolder:
firebase deploy --only functions,firestore

# 2. Web Panel Deployment
echo "\n🌐 Deploying Web Panel..."
cd ../vecino-alerta-panel
npm install
npm run build
# Deploy to Firebase Hosting
firebase deploy --only hosting --project vecinoalerta-2e0de

echo "\n✅ Deployment Complete!"
