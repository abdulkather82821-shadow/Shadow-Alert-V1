import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppHeader, AppRow, EmptyState, ProgressBar, Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon } from '@/components/UiIcon';

function greetingForHour(hour: number) {
  if (hour < 12) return 'A GENTLER MORNING';
  if (hour < 18) return 'A MOMENT FOR YOURSELF';
  return 'A CALMER EVENING';
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { apps, settings } = useShadowAlert();
  const topInset = Platform.OS === 'web' ? 8 : insets.top;

  const readyApps = apps.filter((app) => !app.paused && settings.monitoring);
  const sortedByProgress = [...readyApps]
    .sort((a, b) => b.usageMinutes / Math.max(b.limitMinutes, 1) - a.usageMinutes / Math.max(a.limitMinutes, 1));
  const totalUsed = apps.reduce((total, app) => total + app.usageMinutes, 0);
  const totalLimit = apps.reduce((total, app) => total + app.limitMinutes, 0);
  const progress = totalLimit ? totalUsed / totalLimit : 0;
  const hour = new Date().getHours();

  return (
    <Screen scroll>
      <View style={{ paddingTop: topInset }}>
        <AppHeader
          eyebrow={greetingForHour(hour)}
          title="Make room for what matters."
          action="settings"
          onAction={() => router.push('/settings')}
        />

        <View style={[styles.card, { backgroundColor: colors.primary, borderColor: colors.primary, padding: 22 }]}>
          <View style={styles.rowBetween}>
            <Text style={{ color: colors.primaryForeground, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
              A NOTE TO YOURSELF
            </Text>
            <View style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
              <UiIcon name="moon" color={colors.primaryForeground} size={19} />
            </View>
          </View>
          <Text style={{ color: colors.primaryForeground, fontSize: 24, fontWeight: '700', lineHeight: 31, marginTop: 15 }}>
            {settings.intention || 'Use what helps. Leave what pulls.'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 17 }}>
            <View style={{ width: 21, height: 1, backgroundColor: colors.primaryForeground, opacity: 0.65 }} />
            <Text style={{ color: colors.primaryForeground, opacity: 0.86, fontSize: 13, lineHeight: 19, flex: 1 }}>
              One small pause can make room for a better next choice.
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 20 }]}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.appMeta, { color: colors.mutedForeground, letterSpacing: 1.1 }]}>TODAY'S RHYTHM</Text>
              <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '700', marginTop: 5 }}>
                {readyApps.length} of {apps.length} spaces ready
              </Text>
            </View>
            <View style={{ width: 42, height: 42, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <UiIcon name="eye" color={colors.accentForeground} size={19} />
            </View>
          </View>
          <View style={{ marginTop: 20, gap: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={{ color: colors.inkSoft, fontSize: 13 }}>Check-ins against your daily lines</Text>
              <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 13 }}>{totalUsed} / {totalLimit}m</Text>
            </View>
            <ProgressBar value={progress} />
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18, marginTop: 12 }}>
            {settings.monitoring ? 'Your activity is saved privately on this device.' : 'Check-ins are paused in Settings.'}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginBottom: 12 }}>
            Near your daily line
          </Text>
          <Link href="/apps" style={{ color: colors.primary, fontSize: 13, fontWeight: '700', marginBottom: 12 }}>
            All spaces
          </Link>
        </View>
        {sortedByProgress.length ? (
          sortedByProgress.slice(0, 3).map((app) => (
            <AppRow key={app.id} app={app} onPress={() => router.push(`/app/${app.id}`)} compact />
          ))
        ) : (
          <EmptyState
            icon="check-circle"
            title={apps.length ? 'Take a breath' : 'A fresh start'}
            body={apps.length ? 'Your spaces are paused. Resume check-ins whenever you are ready.' : 'Add a space when you want to set a gentle daily limit.'}
          />
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/apps')}
          style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 15, opacity: pressed ? 0.7 : 1 }]}
        >
          <UiIcon name="plus" size={17} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>Add another space</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 3, marginBottom: 8 }}>
          <UiIcon name="info" size={15} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, flex: 1 }}>
            Preview activity is sample data. Log minutes from a space to explore the experience; this app does not read system-wide screen time.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
