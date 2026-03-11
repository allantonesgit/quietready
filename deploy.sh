#!/bin/bash
echo "🚀 Pushing to GitHub..."
git add .
git commit -m "${1:-update}"
git push

echo "📡 Deploying to EC2..."
ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com \
  "cd /home/ubuntu/quietready && git pull origin main && cp server.js api/server.js && cp email.js api/email.js && cp billing.js api/billing.js && pm2 restart all --update-env"

echo "✅ Done!"