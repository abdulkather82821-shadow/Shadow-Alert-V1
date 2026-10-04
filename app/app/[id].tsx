import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppGlyph, PrimaryButton, ProgressBar, Screen, styles } from '@/components/ShadowUI';
import { BackIcon } from '@/components/TabIcon';
import { UiIcon } from '@/components/UiIcon';
import { useColors } from '@/hooks/useColors';

export default function AppDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { apps, settings, simulateUsage, togglePaused, deleteApp } = useShadowAlert();
  const app = apps.find((item) => item.id === id);

  if (!app) {
    return (
      <Screen>
        <View style={{ paddingTop: Platform.OS === 'web' ? 8 : insets.top + 8 }}>
          <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700' }}>Space not found</Text>
          <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>It may have been removed from your plan.</Text>
        </View>
      </Screen>
    );
  }

  const ratio = app.usageMinutes / Math.max(app.limitMinutes, 1);
  const canLog = settings.monitoring && !app.paused;
  const status = app.paused ? 'Paused' : !settings.monitoring ? 'Check-ins paused' : ratio >= 1 ? 'At the line' : `${Math.max(app.limitMinutes - app.usageMinutes, 0)}m remaining`;
  const topPadding = Platform.OS === 'web' ? 8 : insets.top + 8;

  const confirmDelete = () => {
    const remove = () => {
      deleteApp(app.id);
      router.back();
    };
    const message = `This removes ${app.name}, its daily line, and its saved history.`;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Remove ${app.name}?\n\n${message}`)) remove();
      return;
    }
    Alert.alert(`Remove ${app.name}?`, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: remove },
    ]);
  };

  const logMinutes = (minutes: number) => {
    if (!canLog) return;
    const crossedLine = settings.alerts
      && app.usageMinutes < app.limitMinutes
      && app.usageMinutes + minutes >= app.limitMinutes;
    simulateUsage(app.id, minutes);
    if (crossedLine) router.push(`/block/${app.id}`);
  };

  const historyDays = app.history.slice(-7);
  const firstDay = new Date();
  firstDay.setDate(firstDay.getDate() - (historyDays.length - 1));

  return (
    <Screen scroll>
      <View style={{ paddingTop: topPadding }}>
        <View style={styles.rowBetween}>
          <Pressable testID="detail-back" accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={{ paddingVertical: 8 }}>
            <BackIcon size={23} color={colors.foreground} />
          </Pressable>
          <Pressable testID="delete-app" accessibilityRole="button" accessibilityLabel={`Remove ${app.name}`} onPress={confirmDelete} style={{ padding: 8 }}>
            <UiIcon name="trash-2" size={19} color={colors.destructive} />
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', paddingTop: 18, paddingBottom: 20 }}>
          <AppGlyph app={app} size={72} />
          <Text style={{ color: colors.foreground, fontSize: 28, fontWeight: '700', marginTop: 14 }}>{app.name}</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 5 }}>{app.category} space</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={[styles.appMeta, { color: colors.mutedForeground, letterSpacing: 1.1 }]}>TODAY'S CHECK-INS</Text>
              <Text style={{ color: colors.foreground, fontSize: 38, fontWeight: '700', marginTop: 6 }}>
                {app.usageMinutes}<Text style={{ fontSize: 16, fontWeight: '500' }}> min</Text>
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>of {app.limitMinutes}m</Text>
              <Text style={{ color: ratio >= 1 ? colors.destructive : colors.primary, fontWeight: '700', fontSize: 13, marginTop: 8 }}>{status}</Text>
            </View>
          </View>
          <View style={{ marginTop: 18 }}>
            <ProgressBar value={ratio} color={ratio >= 1 ? colors.destructive : app.color} />
          </View>
          <Pressable
            testID="edit-limit"
            accessibilityRole="button"
            onPress={() => router.push(`/app/limit/${app.id}`)}
            style={{ marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Edit daily line</Text>
            <UiIcon name="chevron-right" color={colors.primary} size={16} />
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.secondary, borderColor: colors.secondary }]}>
          <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700' }}>Try a manual check-in</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, lineHeight: 19, marginTop: 5 }}>
            Add a few minutes to explore the limit flow. This preview doesn't read usage from other apps.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 15 }}>
            {[5, 10, 15].map((minutes) => (
              <Pressable
                testID={`simulate-${minutes}`}
                accessibilityRole="button"
                accessibilityLabel={`Log ${minutes} minutes`}
                accessibilityState={{ disabled: !canLog }}
                disabled={!canLog}
                key={minutes}
                onPress={() => logMinutes(minutes)}
                style={({ pressed }) => [{ backgroundColor: colors.card, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 15, opacity: !canLog ? 0.45 : pressed ? 0.7 : 1 }]}
              >
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>+{minutes}m</Text>
              </Pressable>
            ))}
          </View>
          {!canLog ? (
            <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 11 }}>
              Resume check-ins to add activity.
            </Text>
          ) : null}
        </View>

        <PrimaryButton testID="pause-monitoring" secondary onPress={() => togglePaused(app.id)}>
          {app.paused ? 'Resume this space' : 'Pause this space'}
        </PrimaryButton>

        <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginTop: 24, marginBottom: 12 }}>
          Seven-day rhythm
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'row', alignItems: 'flex-end', height: 155, gap: 8, paddingBottom: 18 }]}>
          {historyDays.map((value, index) => {
            const day = new Date(firstDay);
            day.setDate(firstDay.getDate() + index);
            const label = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(day);
            return (
              <View key={`${index}-${value}`} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
                <View style={{ width: '100%', height: Math.max(8, Math.min(94, value / Math.max(app.limitMinutes, 1) * 94)), borderRadius: 6, backgroundColor: index === historyDays.length - 1 ? app.color : colors.accent }} />
                <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>{label}</Text>
              </View>
            );
          })}
        </View>
        <Text style={{ color: colors.mutedForeground, textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 10 }}>
          A daily line is a promise you can keep adjusting.
        </Text>
      </View>
    </Screen>
  );
}
