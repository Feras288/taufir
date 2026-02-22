@echo off
set /p msg="Enter update message: "
git add .
git commit -m "%msg%"
git push origin main
echo Update uploaded successfully to GitHub!
pause