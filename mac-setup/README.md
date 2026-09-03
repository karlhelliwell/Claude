# Outlook + Teams split-screen hotkey (Mac)

One keypress opens **Outlook web on the left half** of your screen and
**Teams web on the right half**, each in its own window.

## Easiest: one-command install

Paste this into Terminal and press return:

```sh
curl -fsSL https://raw.githubusercontent.com/karlhelliwell/Claude/claude/outlook-teams-docker-windows-11p71h/mac-setup/install.sh | zsh
```

It builds a little app called **Work Split** in your `~/Applications`
folder and opens that folder for you. Drag **Work Split** onto your Dock -
that's your one-click button. The first time you click it, macOS asks a
couple of permission questions ("Work Split wants to control Microsoft
Edge/Finder") - click **OK/Allow**.

Want a keyboard shortcut too? Open the **Shortcuts** app → **+** → add the
**Open App** action → pick **Work Split** → ⓘ → **Add Keyboard Shortcut**
(e.g. ⌃⌥⌘W).

Note: don't double-click the downloaded `.sh` files themselves - macOS just
opens them in a text editor. Use the Terminal command above.

## Manual alternative: the script by itself

Download `open-work-split.sh` from this folder to your Mac (e.g. into your
home folder), then make it executable. In Terminal:

```sh
chmod +x ~/open-work-split.sh
```

Test it by running:

```sh
~/open-work-split.sh
```

The first time, macOS may ask permission for the browser to control things -
click **Allow**. You should get Outlook on the left and Teams on the right.

## 2. Give it a hotkey

1. Open the **Shortcuts** app (built into macOS).
2. Click **+** to create a new shortcut, name it e.g. "Work Split".
3. Add the action **Run Shell Script** (search for it in the right-hand
   panel). If you can't find it, enable it first in
   Shortcuts → Settings → Advanced → **Allow Running Scripts**.
4. In the script box, type: `~/open-work-split.sh`
5. Open the shortcut's details (ⓘ icon) and click **Add Keyboard Shortcut**.
   Pick something unused, e.g. **⌃⌥⌘W**.

Now that key combo opens both, side by side, from anywhere.

## 3. Stop the slow reload every time (recommended)

The "it has to load again" pain is because a closed tab starts from scratch.
Two fixes:

- **Hide instead of close.** Press **⌘H** (hide) or **⌘M** (minimise)
  instead of closing the windows. They stay signed in and come back
  instantly from the Dock.
- **Install them as web apps** so they live in your Dock like real apps:
  - **Edge:** open outlook.office.com → menu (…) → **Apps** →
    **Install this site as an app**. Repeat for teams.microsoft.com.
  - **Chrome:** menu (⋮) → **Cast, save and share** → **Install page as app**.
  - **Safari (macOS 14+):** File → **Add to Dock**.

  They keep you signed in, launch faster, and Teams can then show a red
  notification badge on its Dock icon.

## Put them on their own screen (swipe over to them)

To keep both open on a separate screen you swipe to, instead of on your
main desktop:

1. Open both with Work Split.
2. Hover over the **green dot** on the Outlook window →
   **Tile Window to Left of Screen**.
3. Click the Teams window when macOS offers it for the right side.

They merge into one full-screen split view on its own Space. Swipe with
three fingers left/right (or **Ctrl+←/→**) to flick between it and your
normal desktop. Nothing closes or reloads when you swipe away, so they're
always ready. Hover the green dot again → "Exit Full Screen" to undo.

Tip: in System Settings → Desktop & Dock → Mission Control, turn **off**
"Automatically rearrange Spaces based on most recent use" so the screen
stays in a predictable place.

## Notes

- The script prefers **Google Chrome**, falling back to **Microsoft Edge**.
  Edit the `BROWSER` logic or the two URLs at the top of the script to taste.
- It always opens fresh windows; close or hide old ones as you like.
- If windows don't position themselves, go to System Settings →
  Privacy & Security → **Automation** and make sure Shortcuts/Terminal is
  allowed to control your browser.
