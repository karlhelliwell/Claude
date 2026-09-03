#!/bin/zsh
# One-shot installer for the Outlook + Teams split-screen button.
# Builds a small Mac app called "Work Split" in ~/Applications that opens
# Outlook web on the left half and Teams web on the right half of the
# MacBook's built-in screen when a second display is connected (falling
# back to the only screen when there's just one).
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
SUPPORT_DIR="$HOME/Library/Application Support/WorkSplit"
HELPER="$SUPPORT_DIR/screen-frame.js"
mkdir -p "$APP_DIR" "$SUPPORT_DIR"

# Helper: prints "x,y,width,height" (top-left based coordinates, as browser
# window bounds expect) of the screen to use - the built-in display if it can
# be identified, otherwise the first screen that isn't the main one,
# otherwise the main screen.
cat > "$HELPER" <<'JSEOF'
ObjC.import('AppKit');

function run() {
  var screens = ObjC.unwrap($.NSScreen.screens);
  var main = screens[0];
  var target = null;

  for (var i = 0; i < screens.length; i++) {
    var name = '';
    try { name = ObjC.unwrap(screens[i].localizedName) || ''; } catch (e) {}
    if (name.indexOf('Built-in') !== -1) { target = screens[i]; break; }
  }
  if (!target) target = (screens.length > 1) ? screens[1] : main;

  var mf = main.frame;
  var tf = target.frame;
  // AppKit measures from the bottom-left; window bounds from the top-left.
  var top = mf.size.height - (tf.origin.y + tf.size.height);
  return [
    Math.round(tf.origin.x),
    Math.round(top),
    Math.round(tf.size.width),
    Math.round(tf.size.height)
  ].join(',');
}
JSEOF

SRC="$(mktemp -t worksplit).applescript"
cat > "$SRC" <<EOF
set helperPath to (POSIX path of (path to home folder)) & "Library/Application Support/WorkSplit/screen-frame.js"
set screenInfo to do shell script "osascript -l JavaScript " & quoted form of helperPath
set oldDelims to AppleScript's text item delimiters
set AppleScript's text item delimiters to ","
set parts to every text item of screenInfo
set AppleScript's text item delimiters to oldDelims
set screenX to (item 1 of parts) as integer
set screenY to (item 2 of parts) as integer
set screenW to (item 3 of parts) as integer
set screenH to (item 4 of parts) as integer
set halfW to screenW div 2

tell application "$BROWSER"
	activate
	set outlookWin to make new window
	set URL of active tab of outlookWin to "https://outlook.office.com/mail/"
	set bounds of outlookWin to {screenX, screenY, screenX + halfW, screenY + screenH}
	set teamsWin to make new window
	set URL of active tab of teamsWin to "https://teams.microsoft.com/v2/"
	set bounds of teamsWin to {screenX + halfW, screenY, screenX + screenW, screenY + screenH}
end tell
EOF

rm -rf "$APP"
osacompile -o "$APP" "$SRC"
rm -f "$SRC"

echo ""
echo "Installed: $APP (uses $BROWSER)"
echo "It opens Outlook + Teams on your MacBook's built-in screen when an"
echo "external display is connected. Drag 'Work Split' onto your Dock if it"
echo "isn't there already."
open -R "$APP"
