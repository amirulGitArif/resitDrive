import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { APP_NAME, APP_VERSION, DRIVE_ROOT_FOLDER_NAME } from '../../../app/config/constants';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Screen } from '../../../components/Screen';
import { getSchemaVersion } from '../../../database/migrations';
import { ReceiptRepository } from '../../../database/repositories';
import { useFocusData } from '../../../hooks/useFocusData';
import { useAuthStore } from '../../../store/authStore';
import { colors, spacing, typography } from '../../../theme';
import { toISODate } from '../../../utils/date';
import { errorMessage } from '../../../utils/format';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function SettingsScreen() {
  const setStatus = useAuthStore(s => s.setStatus);
  const { data, reload } = useFocusData(async () => {
    const [schema, stats] = await Promise.all([
      getSchemaVersion(),
      ReceiptRepository.getStats(new Date().getFullYear()),
    ]);
    return { schema, stats };
  });

  const addSample = async () => {
    try {
      await ReceiptRepository.create({
        merchantName: 'KPJ Healthcare',
        receiptDate: toISODate(),
        amount: 250,
        categoryId: 'medical',
        localImagePath: 'sample://none',
      });
      await reload();
    } catch (e) {
      Alert.alert('Could not add sample', errorMessage(e));
    }
  };

  const clearSamples = async () => {
    try {
      await ReceiptRepository.hardDeleteSamples();
      await reload();
    } catch (e) {
      Alert.alert('Could not clear samples', errorMessage(e));
    }
  };

  return (
    <Screen title="Settings">
      <Text style={styles.section}>Google account</Text>
      <Card style={styles.card}>
        <Row label="Account" value="Not connected" />
        <Row label="Google Drive" value="Not connected (Phase 2)" />
        <Row label="Drive folder" value={`${DRIVE_ROOT_FOLDER_NAME}/`} />
      </Card>
      <Button
        title="Disconnect Google account"
        variant="danger"
        disabled
        onPress={() => undefined}
        style={styles.gap}
      />

      <Text style={styles.section}>Storage & sync</Text>
      <Card style={styles.card}>
        <Row label="Receipts (this tax year)" value={String(data?.stats.totalCount ?? '–')} />
        <Row label="Pending uploads" value={String(data?.stats.pendingCount ?? '–')} />
        <Row label="Failed uploads" value={String(data?.stats.failedCount ?? '–')} />
        <Row label="Database schema" value={data ? `v${data.schema}` : '–'} />
      </Card>

      <Text style={styles.section}>About</Text>
      <Card style={styles.card}>
        <Row label="App" value={APP_NAME} />
        <Row label="Version" value={APP_VERSION} />
        <Row label="Privacy policy" value="Coming soon" />
      </Card>

      {__DEV__ ? (
        <>
          <Text style={styles.section}>Developer tools</Text>
          <Button title="Add sample receipt" variant="secondary" onPress={addSample} />
          <Button
            title="Clear sample receipts"
            variant="ghost"
            onPress={clearSamples}
            style={styles.gap}
          />
          <Button
            title="Back to Welcome (dev)"
            variant="ghost"
            onPress={() => setStatus('signedOut')}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  card: { gap: spacing.md },
  gap: { marginTop: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  label: { ...typography.body, color: colors.textSecondary },
  value: { ...typography.bodyStrong, color: colors.text, flexShrink: 1, textAlign: 'right' },
});
