import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Screen } from '../../../components/Screen';
import { EmptyState, ErrorView, LoadingView } from '../../../components/StateViews';
import { ReceiptRepository } from '../../../database/repositories';
import { useFocusData } from '../../../hooks/useFocusData';
import { colors, radius, spacing, typography } from '../../../theme';
import { ReceiptRow } from '../components/ReceiptRow';

export function ReceiptListScreen() {
  const [search, setSearch] = useState('');
  const { data, loading, error, reload } = useFocusData(() =>
    ReceiptRepository.list({ search }),
  );

  // Re-query when the search text changes (focus reload is handled by the hook).
  useEffect(() => {
    reload();
  }, [search, reload]);

  return (
    <Screen title="Receipts" subtitle="Search by merchant">
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search merchant"
        placeholderTextColor={colors.textSecondary}
        style={styles.search}
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Search receipts by merchant"
      />

      {loading ? <LoadingView /> : null}
      {!loading && error && !data ? <ErrorView message={error} onRetry={reload} /> : null}
      {data && data.length === 0 ? (
        <EmptyState
          title={search ? 'No matches' : 'No receipts yet'}
          message={
            search ? 'Try a different merchant name.' : 'Captured receipts will be listed here.'
          }
        />
      ) : null}
      {data?.map(r => <ReceiptRow key={r.id} receipt={r} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    color: colors.text,
  },
});
