"cd /home/ubuntu/quietready && git pull origin main && pm2 restart all"#!/bin/bash
echo "🚀 Pushing to GitHub..."
git add .
git commit -m "${1:-update}"
git push

echo "📡 Deploying to EC2..."
ssh -i /Users/allantone/ssh/QuietReady2026.pem ubuntu@ec2-54-160-4-222.compute-1.amazonaws.com \
  "cd /home/ubuntu/quietready && git pull && pm2 restart all"

echo "✅ Done!"
