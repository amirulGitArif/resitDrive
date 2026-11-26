import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/Card';
import { Icon } from '../../../components/Icon';
import { Screen } from '../../../components/Screen';
import { ErrorView, LoadingView } from '../../../components/StateViews';
import { CategoryRepository } from '../../../database/repositories';
import { useFocusData } from '../../../hooks/useFocusData';
import { colors, radius, spacing, typography } from '../../../theme';
import { formatRM } from '../../../utils/format';

export function CategoriesScreen() {
  const { data, loading, error, reload } = useFocusData(() => CategoryRepository.getSummaries());

  return (
    <Screen title="Categories" subtitle="Receipts and entered totals">
      {loading ? <LoadingView /> : null}
      {!loading && error && !data ? <ErrorView message={error} onRetry={reload} /> : null}
      {data?.map(c => (
        <Card key={c.id} style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name={c.icon ?? 'other'} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.meta}>
              {c.receiptCount} {c.receiptCount === 1 ? 'receipt' : 'receipts'}
            </Text>
          </View>
          <Text style={styles.total}>{formatRM(c.totalAmount)}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, padding: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  name: { ...typography.bodyStrong, color: colors.text },
  meta: { ...typography.caption, color: colors.textSecondary },
  total: { ...typography.bodyStrong, color: colors.text },
});
