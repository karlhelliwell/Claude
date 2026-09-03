#!/bin/zsh
#
# open-work-split.sh
# Opens Outlook (web) on the LEFT half of the screen and Teams (web) on the
# RIGHT half, each in its own browser window. Safe to run repeatedly.
#
# Works with Microsoft Edge or Google Chrome (whichever is installed).
# Bind it to a hotkey with the macOS Shortcuts app - see README.md.

OUTLOOK_URL="https://outlook.office.com/mail/"
TEAMS_URL="https://teams.microsoft.com/v2/"

# Pick a browser (Chrome preferred)
if [ -d "/Applications/Google Chrome.app" ]; then
  BROWSER="Google Chrome"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  BROWSER="Microsoft Edge"
else
  osascript -e 'display alert "open-work-split" message "Please install Google Chrome or Microsoft Edge first."'
  exit 1
fi

osascript <<EOF
-- Get the full desktop size
tell application "Finder" to set screenBounds to bounds of window of desktop
set screenW to item 3 of screenBounds
set screenH to item 4 of screenBounds
set halfW to screenW div 2

tell application "$BROWSER"
  activate

  -- Outlook: left half
  set outlookWin to make new window
  set URL of active tab of outlookWin to "$OUTLOOK_URL"
  set bounds of outlookWin to {0, 0, halfW, screenH}

  -- Teams: right half
  set teamsWin to make new window
  set URL of active tab of teamsWin to "$TEAMS_URL"
  set bounds of teamsWin to {halfW, 0, screenW, screenH}
end tell
EOF
