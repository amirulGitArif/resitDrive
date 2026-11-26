# resitDrive development checklist

## Phase 1: Project Foundation
- [x] Folder structure (feature-based)
- [x] Theme (colors, spacing, typography)
- [x] Zustand stores (app init, auth stub)
- [x] SQLite adapter, versioned migrations, seed categories
- [x] Repositories: Category, Receipt, DriveFolder, UploadQueue
- [x] Navigation: splash -> welcome -> bottom tabs with central Capture button
- [x] Screens: Splash, Welcome, Home, Receipts, Capture (placeholder), Categories, Settings
- [x] Reusable components: Button, Card, Screen, StatCard, StateViews, Logo, Icon
- [ ] **Run on Android emulator/device (you)**
- [ ] **Run on iOS simulator/device (you)**
- [ ] **Verify SQLite adapter against installed op-sqlite version (you)**
- [ ] TypeScript passes (`npx tsc --noEmit`) (you)

## Phase 2: Google Integration
- [ ] Google Cloud project, Drive API enabled, OAuth clients (iOS + Android)
- [ ] Google Sign-In with drive.file scope only
- [ ] Secure token handling, disconnect flow
- [ ] Create resitDrive/ root + year/category folders (cached IDs)
- [ ] Upload a sample image

## Phase 3: Receipt Capture
## Phase 4: Google Drive Upload and Queue
## Phase 5: Receipt Management
## Phase 6: Testing and Stabilization
