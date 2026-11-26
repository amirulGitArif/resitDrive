import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ErrorView, LoadingView } from '../../../components/StateViews';
import { Logo } from '../../../components/Logo';
import { useAppStore } from '../../../store/appStore';
import { colors, spacing, typography } from '../../../theme';

export function SplashScreen() {
  const initialize = useAppStore(s => s.initialize);
  const initError = useAppStore(s => s.initError);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <View style={styles.root}>
      <Logo size={40} />
      <Text style={styles.tagline}>Your receipts, safe in your own Drive</Text>
      <View style={styles.status}>
        {initError ? (
          <ErrorView message={initError} onRetry={initialize} />
        ) : (
          <LoadingView label="Getting things ready…" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  tagline: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  status: { marginTop: spacing.xxl, minHeight: 120, alignSelf: 'stretch' },
});
