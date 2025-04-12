#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking TypeScript build...${NC}"
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Build successful! Proceeding with commit and deployment...${NC}"
else
  echo "Build failed. Please fix TypeScript errors before committing."
  exit 1
fi

echo -e "${BLUE}Adding files to staging...${NC}"
git add .

echo -e "${BLUE}Creating commit with detailed message...${NC}"
git commit -F commit_message.txt

echo -e "${BLUE}Pushing changes to remote repository...${NC}"
git push

echo -e "${BLUE}Deploying to Firebase Hosting...${NC}"
npm run deploy

echo -e "${GREEN}Deployment complete!${NC}"
