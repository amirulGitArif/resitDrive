import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="resitDrive">
      <Text style={[typography.display, { fontSize: size, color: colors.text }]}>resit</Text>
      <Text style={[typography.display, { fontSize: size, color: colors.primary }]}>Drive</Text>
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'baseline' } });
