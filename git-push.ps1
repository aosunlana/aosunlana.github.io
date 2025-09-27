# PowerShell script to add, commit and push all changes at once

# Get the branch name to push to
$branchName = Read-Host -Prompt "Enter the branch name to push to (e.g., main)"

# Get the commit message
$commitMessage = Read-Host -Prompt "Enter your commit message"

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Cyan
git add .

# Commit with the provided message
Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "$commitMessage"

# Push to the specified branch
Write-Host "Pushing to $branchName..." -ForegroundColor Cyan
git push origin $branchName

Write-Host "Push completed!" -ForegroundColor Green