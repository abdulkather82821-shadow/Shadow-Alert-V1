import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppHeader, AppRow, EmptyState, LoadingState, PrimaryButton, ProgressBar, Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon } from '@/components/UiIcon';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { apps, settings, isLoading, hasError, retry } = useShadowAlert();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  if (isLoading) return <Screen><View style={{ paddingTop: topInset }}><LoadingState /></View></Screen>;
  if (hasError) return <Screen><View style={{ paddingTop: topInset }}><EmptyState icon="alert-circle" title="Your space is resting" body="We couldn't open your local data just now." action={<PrimaryButton onPress={retry}>Try again</PrimaryButton>} /></View></Screen>;
  const active = apps.filter((app) => !app.paused);
  const close = [...active].sort((a, b) => (b.usageMinutes / b.limitMinutes) - (a.usageMinutes / a.limitMinutes)).slice(0, 3);
  return <Screen scroll>
    <View style={{ paddingTop: topInset - 14 }}>
      <AppHeader eyebrow="Wednesday evening" title="Driven by intent. Shaped by excellence." action="settings" onAction={() => router.push('/settings')} />
      <View style={[styles.card, { backgroundColor: colors.primary, borderColor: colors.primary, padding: 22 }]}>
        <View style={styles.rowBetween}><View style={{ flex: 1, paddingRight: 12 }}><Text style={{ color: colors.primaryForeground, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>Tonight's note</Text><Text style={{ color: colors.primaryForeground, fontSize: 23, fontWeight: '700', lineHeight: 29, marginTop: 10 }}>{settings.intention}</Text></View><UiIcon name="moon" color={colors.primaryForeground} size={28} /></View>
        <Text style={{ color: colors.primaryForeground, opacity: 0.82, fontSize: 13, lineHeight: 20, marginTop: 18 }}>You don't need to disappear. Just decide what deserves your attention.</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.rowBetween}><View><Text style={[styles.appMeta, { color: colors.mutedForeground }]}>YOUR EVENING</Text><Text style={{ color: colors.foreground, fontSize: 21, fontWeight: '700', marginTop: 6 }}>{active.length} spaces being watched</Text></View><View style={{ backgroundColor: colors.accent, borderRadius: 18, padding: 12 }}><UiIcon name="eye" color={colors.accentForeground} size={19} /></View></View>
        <View style={{ marginTop: 20, gap: 12 }}><View style={styles.rowBetween}><Text style={{ color: colors.inkSoft, fontSize: 13 }}>Time used across limits</Text><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 13 }}>{apps.reduce((total, app) => total + app.usageMinutes, 0)}m</Text></View><ProgressBar value={Math.min(apps.reduce((total, app) => total + app.usageMinutes, 0) / Math.max(apps.reduce((total, app) => total + app.limitMinutes, 0), 1), 1)} /></View>
      </View>
      <View style={styles.rowBetween}><Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginBottom: 12 }}>Close to your line</Text><Link href="/apps" style={{ color: colors.primary, fontSize: 13, fontWeight: '700', marginBottom: 12 }}>See all</Link></View>
      {close.length ? close.map((app) => <AppRow key={app.id} app={app} onPress={() => router.push(`/app/${app.id}`)} compact />) : <EmptyState icon="check-circle" title="Plenty of room" body="Nothing is asking for your attention right now." />}
      <Pressable onPress={() => router.push('/apps')} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, opacity: pressed ? 0.7 : 1 }]}><UiIcon name="plus" size={17} color={colors.primary} /><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>Add another space to watch</Text></Pressable>
    </View>
  </Screen>;
}
