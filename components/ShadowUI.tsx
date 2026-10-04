import * as Haptics from 'expo-haptics';
import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { MonitoredApp } from '@/context/ShadowAlertContext';
import { BrandAppIcon, isBrandAppIcon } from '@/components/BrandAppIcon';
import { UiIcon, isUiIconName, type UiIconName } from '@/components/UiIcon';

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  const colors = useColors();

  if (!scroll) {
    return (
      <View style={[styles.screenFrame, { backgroundColor: colors.background }]}>
        <View style={styles.screen}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function AppHeader({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: UiIconName;
  onAction?: () => void;
}) {
  const colors = useColors();
  const isLongTitle = title.length > 28;

  return (
    <View style={styles.header}>
      <View style={styles.headerTitleGroup}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, isLongTitle && styles.titleLong, { color: colors.foreground }]}>
          {title}
        </Text>
      </View>
      {action ? <IconButton icon={action} onPress={onAction} label="Open settings" /> : null}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  tone = 'soft',
  testID,
}: {
  icon: UiIconName;
  onPress?: () => void;
  label: string;
  tone?: 'soft' | 'plain';
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.iconButton,
        tone === 'soft' && { backgroundColor: colors.secondary },
        tone === 'plain' && { backgroundColor: 'transparent' },
        pressed && styles.pressed,
      ]}
    >
      <UiIcon name={icon} size={21} color={colors.foreground} />
    </Pressable>
  );
}

export function PrimaryButton({
  children,
  onPress,
  testID,
  disabled = false,
  secondary = false,
}: {
  children: ReactNode;
  onPress: () => void;
  testID?: string;
  disabled?: boolean;
  secondary?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
        onPress();
      }}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: secondary ? colors.secondary : colors.primary,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
        },
        secondary && { borderWidth: 1, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.primaryText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const colors = useColors();
  const percentage = Math.max(0, Math.min(value, 1));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage * 100) }}
      style={[styles.progressTrack, { backgroundColor: colors.muted }]}
    >
      <View style={[styles.progressFill, { width: `${percentage * 100}%`, backgroundColor: color ?? colors.primary }]} />
    </View>
  );
}

export function AppGlyph({ app, size = 48 }: { app: MonitoredApp; size?: number }) {
  const icon = isUiIconName(app.icon) ? app.icon : 'info';
  return (
    <View
      accessibilityElementsHidden
      style={[styles.glyph, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: app.color }]}
    >
      {isBrandAppIcon(app.id) ? (
        <BrandAppIcon name={app.id} size={size * 0.58} color="#FFFFFF" />
      ) : (
        <UiIcon name={icon} size={size * 0.43} color="#FFFFFF" />
      )}
    </View>
  );
}

export function AppRow({
  app,
  onPress,
  compact = false,
}: {
  app: MonitoredApp;
  onPress: () => void;
  compact?: boolean;
}) {
  const colors = useColors();
  const ratio = app.limitMinutes ? app.usageMinutes / app.limitMinutes : 0;
  const status = app.paused
    ? 'Paused'
    : ratio >= 1
      ? 'Limit reached'
      : `${Math.max(app.limitMinutes - app.usageMinutes, 0)}m left`;

  return (
    <Pressable
      onPress={onPress}
      testID={`app-row-${app.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${app.name}, ${app.category}, ${status}`}
      accessibilityHint="Opens this space's daily limit and check-in controls"
      style={({ pressed }) => [
        styles.appRow,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <AppGlyph app={app} size={compact ? 42 : 48} />
      <View style={styles.appRowBody}>
        <View style={styles.rowBetween}>
          <Text style={[styles.appName, { color: colors.foreground }]}>{app.name}</Text>
          <UiIcon name="chevron-right" size={18} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.appMeta, { color: colors.mutedForeground }]}>
          {app.category} · {status}
        </Text>
        <ProgressBar value={ratio} color={ratio >= 1 ? colors.destructive : app.color} />
      </View>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: UiIconName;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <UiIcon name={icon} size={26} color={colors.primary} />
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{body}</Text>
      {action}
    </View>
  );
}

export function LoadingState() {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity, padding: 20, gap: 14 }}>
      <View style={[styles.skeleton, { backgroundColor: colors.muted, width: '38%', height: 18 }]} />
      <View style={[styles.skeleton, { backgroundColor: colors.muted, width: '80%', height: 34 }]} />
      <View style={[styles.skeleton, { backgroundColor: colors.muted, width: '100%', height: 104 }]} />
    </Animated.View>
  );
}

export const styles = StyleSheet.create({
  screenFrame: { flex: 1, width: '100%', alignItems: 'center' },
  screen: { flex: 1, width: '100%', maxWidth: 740, paddingHorizontal: 20, paddingTop: 14 },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 740,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 116,
  },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 22 },
  headerTitleGroup: { flex: 1, minWidth: 0, paddingRight: 12 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 7 },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  titleLong: { fontSize: 25, lineHeight: 30, letterSpacing: -0.7 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  card: { borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1 },
  appRow: { borderRadius: 20, padding: 14, borderWidth: 1, flexDirection: 'row', gap: 13, marginBottom: 10 },
  appRowBody: { flex: 1, justifyContent: 'center', gap: 7 },
  appName: { fontSize: 16, fontWeight: '600' },
  appMeta: { fontSize: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  glyph: { alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 6, borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 6 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  primaryButton: { minHeight: 52, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 15, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 30, borderWidth: 1, borderRadius: 22, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 3 },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 21, maxWidth: 300 },
  skeleton: { borderRadius: 10 },
});
