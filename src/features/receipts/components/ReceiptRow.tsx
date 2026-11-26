import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/Card';
import { colors, spacing, typography } from '../../../theme';
import type { Receipt } from '../../../types';
import { formatDisplayDate } from '../../../utils/date';
import { formatRM } from '../../../utils/format';
import { StatusBadge } from './StatusBadge';

export function ReceiptRow({ receipt }: { receipt: Receipt }) {
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.merchant} numberOfLines={1}>
          {receipt.merchantName || 'Untitled receipt'}
        </Text>
        <Text style={styles.amount}>{receipt.amount != null ? formatRM(receipt.amount) : '—'}</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDisplayDate(receipt.receiptDate)} · {receipt.categoryName ?? receipt.categoryId}
        </Text>
        <StatusBadge status={receipt.uploadStatus} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md, marginBottom: spacing.sm },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  merchant: { ...typography.bodyStrong, color: colors.text, flex: 1, marginRight: spacing.sm },
  amount: { ...typography.bodyStrong, color: colors.text },
  meta: { ...typography.caption, color: colors.textSecondary, flex: 1, marginRight: spacing.sm },
});
