@echo off
setlocal

REM Define the files to be zipped
set FILES=manifest.json,setup.mjs

REM Define the output zip file
set ZIPFILE=melvor-auto-level.zip

REM Create the zip file
powershell Compress-Archive -Path %FILES% -DestinationPath %ZIPFILE% -Force

echo Files have been zipped into %ZIPFILE%
endlocal