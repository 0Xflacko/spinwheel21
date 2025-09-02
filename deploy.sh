#!/bin/bash

# WTF Games Spinning Wheel - Deployment Script
echo "🎯 Preparing WTF Games Spinning Wheel for deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if all changes are committed
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Uncommitted changes found. Committing them..."
    git add .
    read -p "Enter commit message: " commit_message
    git commit -m "$commit_message"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add your environment variables:"
echo "   - GOOGLE_SHEETS_ID"
echo "   - GOOGLE_PROJECT_ID"
echo "   - GOOGLE_PRIVATE_KEY_ID"
echo "   - GOOGLE_PRIVATE_KEY"
echo "   - GOOGLE_CLIENT_EMAIL"
echo "   - GOOGLE_CLIENT_ID"
echo "4. Deploy!"
echo ""
echo "📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
