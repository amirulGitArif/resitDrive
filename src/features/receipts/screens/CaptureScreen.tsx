import React from 'react';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/StateViews';

/** Phase 3 replaces this with the VisionCamera capture flow. */
export function CaptureScreen() {
  return (
    <Screen title="Capture" scroll={false}>
      <EmptyState
        title="Camera arrives in Phase 3"
        message="Capture, crop, compress and save receipts will live here."
      />
    </Screen>
  );
}
