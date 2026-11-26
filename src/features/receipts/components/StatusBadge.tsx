import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';
import type { UploadStatus } from '../../../types';

const CONFIG: Record<UploadStatus, { label: string; bg: string; fg: string }> = {
  draft: { label: 'Draft', bg: colors.border, fg: colors.textSecondary },
  pending: { label: 'Pending', bg: colors.warningLight, fg: colors.warning },
  uploading: { label: 'Uploading', bg: colors.primaryLight, fg: colors.primary },
  completed: { label: 'Synced', bg: colors.successLight, fg: colors.success },
  failed: { label: 'Failed', bg: colors.dangerLight, fg: colors.danger },
};

export function StatusBadge({ status }: { status: UploadStatus }) {
  const c = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  text: { ...typography.caption },
});
