import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MainTabParamList } from '../../../app/navigation/types';
import { Button } from '../../../components/Button';
import { Screen } from '../../../components/Screen';
import { EmptyState, ErrorView, LoadingView } from '../../../components/StateViews';
import { StatCard } from '../../../components/StatCard';
import { colors, radius, spacing, typography } from '../../../theme';
import { formatRM } from '../../../utils/format';
import { ReceiptRow } from '../components/ReceiptRow';
import { useHomeData } from '../hooks/useHomeData';

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { data, loading, error, reload } = useHomeData();

  return (
    <Screen title="Welcome back" subtitle="Your receipts at a glance">
      {loading ? <LoadingView /> : null}
      {!loading && error && !data ? <ErrorView message={error} onRetry={reload} /> : null}

      {data ? (
        <>
          <View style={styles.yearChip}>
            <Text style={styles.yearText}>Tax year {data.stats.taxYear}</Text>
          </View>

          <View style={styles.grid}>
            <StatCard label="Receipts saved" value={String(data.stats.totalCount)} />
            <StatCard label="Total amount" value={formatRM(data.stats.totalAmount)} />
            <StatCard
              label="Pending uploads"
              value={String(data.stats.pendingCount)}
              tone={data.stats.pendingCount > 0 ? 'warning' : 'default'}
            />
            <StatCard
              label="Failed uploads"
              value={String(data.stats.failedCount)}
              tone={data.stats.failedCount > 0 ? 'danger' : 'default'}
            />
          </View>

          <Button
            title="Capture receipt"
            onPress={() => navigation.navigate('Capture')}
            style={styles.capture}
          />

          <Text style={styles.sectionTitle}>Recent receipts</Text>
          {data.recent.length === 0 ? (
            <EmptyState
              title="No receipts yet"
              message="Capture your first receipt and it will appear here."
            />
          ) : (
            data.recent.map(r => <ReceiptRow key={r.id} receipt={r} />)
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  yearChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  yearText: { ...typography.caption, color: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  capture: { marginVertical: spacing.xl },
  sectionTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.md },
});
