@echo off
REM Batch script to add, commit and push all changes at once

REM Get the branch name to push to
SET /P branch_name=Enter the branch name to push to (e.g., main): 

REM Get the commit message
SET /P commit_message=Enter your commit message: 

REM Add all changes
echo Adding all changes...
git add .

REM Commit with the provided message
echo Committing changes...
git commit -m "%commit_message%"

REM Push to the specified branch
echo Pushing to %branch_name%...
git push origin %branch_name%

echo Push completed!
pause