#!/bin/bash

# Script to add, commit and push all changes at once

# Get the branch name to push to
echo "Enter the branch name to push to (e.g., main): "
read branch_name

# Get the commit message
echo "Enter your commit message: "
read commit_message

# Add all changes
git add .

# Commit with the provided message
git commit -m "$commit_message"

# Push to the specified branch
git push origin $branch_name

echo "Push completed!"