import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface Props {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  children: ReactNode;
  contentStyle?: ViewStyle;
  header?: ReactNode;
}

export function Screen({ title, subtitle, scroll = true, children, contentStyle, header }: Props) {
  const insets = useSafeAreaInsets();
  const head = (
    <>
      {header}
      {title ? (
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </>
  );

  if (!scroll) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.lg }, styles.pad]}>
        {head}
        <View style={[styles.flex, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.pad,
        { paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxl },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled">
      {head}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  pad: { paddingHorizontal: spacing.lg },
  titleWrap: { marginBottom: spacing.lg },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
