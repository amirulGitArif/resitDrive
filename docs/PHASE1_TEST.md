# Phase 1: install and test

## 1. Create the project (once)
    npx @react-native-community/cli@latest init resitDrive --title "resitDrive" --package-name com.resitdrive.app --skip-git-init
    cd resitDrive && git init && git add -A && git commit -m "chore: init"
    npm run android   # confirm the blank template runs BEFORE adding anything

## 2. Copy Phase 1 files into the project
From the unzipped `resitDrive-phase1` folder:

    cp -R src /path/to/resitDrive/
    cp -R docs scripts /path/to/resitDrive/
    cp App.tsx /path/to/resitDrive/App.tsx      # replaces the template App.tsx

## 3. Install dependencies
    cd /path/to/resitDrive
    ./scripts/install-deps.sh

## 4. Verify SQLite adapter
Open `src/database/client.ts` and compare `open({ name })` and `execute(sql, params)`
with the README of the installed `@op-engineering/op-sqlite`. Adjust only that file if
the API differs. Then:

    npx tsc --noEmit

Fix any type errors before running the app and tell me what they are.

## 5. Run
    npm run android
    npm run ios

## 6. Manual test script
1. Splash shows the resitDrive logo, then Welcome appears.
2. "Sign in with Google" shows a "Coming in Phase 2" alert.
3. Tap "Skip (dev preview)" -> bottom tabs appear; the blue + is in the centre.
4. Home: Tax year chip, 4 stat cards (all zero), empty "Recent receipts".
5. Settings -> "Add sample receipt" twice. Home shows 2 receipts, RM500.00 total.
   (Sample receipts have status "Draft", so Pending stays 0.)
6. Receipts: both rows listed; search "kpj" matches, "zzz" shows "No matches".
7. Categories: Medical shows 2 receipts and RM500.00; others 0.
8. Settings: schema shows v1. "Clear sample receipts" returns everything to zero.
9. Force-quit and reopen: data persists (add a sample, restart, check Receipts).
10. Capture tab shows the Phase 3 placeholder.

## Known Phase 1 limitations
- Sign-in and Drive are stubs (Phase 2).
- Tab icons are text glyphs; swap `src/components/Icon.tsx` for an icon library later.
- Receipt rows are not tappable yet (detail screen is Phase 5).
