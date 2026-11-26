#!/usr/bin/env bash
# Run from the root of the generated resitDrive React Native project.
set -euo pipefail

# Phase 1 dependencies only. No versions are pinned here on purpose:
# npm resolves versions compatible with the React Native template you generated.
# Review any peer-dependency warnings before continuing.
npm install \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  @react-navigation/native-stack \
  react-native-screens \
  react-native-safe-area-context \
  zustand \
  @op-engineering/op-sqlite

if [[ "$(uname)" == "Darwin" ]]; then
  (cd ios && bundle exec pod install)
fi

echo "Done. Next: npm run android  |  npm run ios"
