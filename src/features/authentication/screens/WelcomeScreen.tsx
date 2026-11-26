import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Logo } from '../../../components/Logo';
import { Screen } from '../../../components/Screen';
import { useAuthStore } from '../../../store/authStore';
import { colors, spacing, typography } from '../../../theme';

const POINTS = [
  'Snap receipts with your camera, even offline.',
  'Files are saved to a resitDrive folder in YOUR Google Drive.',
  'We only ask for access to files this app creates (drive.file).',
  'Organised by tax year and category, ready for LHDN.',
];

export function WelcomeScreen() {
  const setStatus = useAuthStore(s => s.setStatus);

  const onSignIn = () => {
    // Phase 2 wires this to @react-native-google-signin/google-signin.
    Alert.alert('Coming in Phase 2', 'Google Sign-In is not implemented yet.');
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Logo size={40} />
        <Text style={styles.headline}>Keep every receipt for tax time</Text>
      </View>

      <Card style={styles.card}>
        {POINTS.map(p => (
          <View key={p} style={styles.pointRow}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.point}>{p}</Text>
          </View>
        ))}
      </Card>

      <Button title="Sign in with Google" onPress={onSignIn} />

      {__DEV__ ? (
        <Button
          title="Skip (dev preview)"
          variant="ghost"
          onPress={() => setStatus('signedIn')}
          style={styles.skip}
        />
      ) : null}

      <Text style={styles.note}>
        resitDrive is a receipt organiser, not a tax calculator. Eligibility for tax relief
        depends on the Year of Assessment — check LHDN for current rules.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xxl },
  hero: { alignItems: 'center', marginVertical: spacing.xl, gap: spacing.md },
  headline: { ...typography.heading, color: colors.text, textAlign: 'center' },
  card: { marginBottom: spacing.xl, gap: spacing.md },
  pointRow: { flexDirection: 'row', gap: spacing.sm },
  dot: { ...typography.body, color: colors.primary },
  point: { ...typography.body, color: colors.text, flex: 1 },
  skip: { marginTop: spacing.sm },
  note: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
