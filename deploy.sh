#!/bin/bash
echo "Building Exam Hero project..."
npm run build

echo "Deploying to Firebase..."
npx firebase deploy

echo "Deployment complete!"

