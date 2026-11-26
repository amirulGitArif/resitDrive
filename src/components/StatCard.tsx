import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';
import { Card } from './Card';

interface Props {
  label: string;
  value: string;
  tone?: 'default' | 'warning' | 'danger';
}

export function StatCard({ label, value, tone = 'default' }: Props) {
  const valueColor =
    tone === 'danger' ? colors.danger : tone === 'warning' ? colors.warning : colors.text;
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: '45%' },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  value: { ...typography.stat },
});
