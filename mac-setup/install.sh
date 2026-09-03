#!/bin/zsh
# One-shot installer for the Outlook + Teams split-screen button.
# Builds a small Mac app called "Work Split" in ~/Applications that opens
# Outlook web on the left half of the screen and Teams web on the right half.
#
# Run it with:
#   curl -fsSL https://raw.githubusercontent.com/karlhelliwell/Claude/claude/outlook-teams-docker-windows-11p71h/mac-setup/install.sh | zsh

set -e

if [ -d "/Applications/Google Chrome.app" ]; then
  BROWSER="Google Chrome"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  BROWSER="Microsoft Edge"
else
  echo "Please install Google Chrome (or Microsoft Edge) first, then re-run this."
  exit 1
fi

APP_DIR="$HOME/Applications"
APP="$APP_DIR/Work Split.app"
mkdir -p "$APP_DIR"

SRC="$(mktemp -t worksplit).applescript"
cat > "$SRC" <<EOF
tell application "Finder" to set screenBounds to bounds of window of desktop
set screenW to item 3 of screenBounds
set screenH to item 4 of screenBounds
set halfW to screenW div 2

tell application "$BROWSER"
	activate
	set outlookWin to make new window
	set URL of active tab of outlookWin to "https://outlook.office.com/mail/"
	set bounds of outlookWin to {0, 0, halfW, screenH}
	set teamsWin to make new window
	set URL of active tab of teamsWin to "https://teams.microsoft.com/v2/"
	set bounds of teamsWin to {halfW, 0, screenW, screenH}
end tell
EOF

rm -rf "$APP"
osacompile -o "$APP" "$SRC"
rm -f "$SRC"

echo ""
echo "Installed: $APP (uses $BROWSER)"
echo "Opening its folder now - drag 'Work Split' onto your Dock to get your one-click button."
open -R "$APP"
