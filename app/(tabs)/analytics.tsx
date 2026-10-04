import React from 'react';
import { Text, View } from 'react-native';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppGlyph, EmptyState, ProgressBar, Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon, type UiIconName } from '@/components/UiIcon';

export default function AnalyticsScreen() {
  const colors = useColors();
  const { apps, sessions, blocks } = useShadowAlert();
  const weeklyTotals = Array.from({ length: 7 }, () => 0);

  apps.forEach((app) => {
    const history = app.history.slice(-7);
    const startIndex = Math.max(0, 7 - history.length);
    history.forEach((minutes, index) => {
      weeklyTotals[startIndex + index] += minutes;
    });
  });

  const weeklyTotal = weeklyTotals.reduce((sum, value) => sum + value, 0);
  const weeklyAverage = Math.round(weeklyTotal / 7);
  const peakDay = Math.max(...weeklyTotals, 1);
  const today = new Date();
  const dayLabels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);
  });
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentBlocks = blocks.filter((block) => new Date(block.at).getTime() >= weekAgo).length;

  return (
    <Screen scroll>
      <View style={{ paddingTop: 8 }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>A GENTLE LOOK BACK</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Your rhythm</Text>
          </View>
          <UiIcon name="bar-chart-2" size={25} color={colors.primary} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 20 }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.appMeta, { color: colors.mutedForeground, letterSpacing: 1.1 }]}>PAST 7 DAYS</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary }} />
              <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>today</Text>
            </View>
          </View>
          <Text style={{ color: colors.foreground, fontSize: 36, fontWeight: '700', letterSpacing: -1, marginTop: 7 }}>
            {weeklyTotal}<Text style={{ fontSize: 16, fontWeight: '500' }}> min</Text>
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 3 }}>
            logged across {apps.length} {apps.length === 1 ? 'space' : 'spaces'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 138, marginTop: 20, paddingBottom: 20 }}>
            {weeklyTotals.map((minutes, index) => {
              const height = minutes === 0 ? 6 : Math.max(9, Math.round((minutes / peakDay) * 88));
              const isToday = index === weeklyTotals.length - 1;
              return (
                <View key={`${dayLabels[index]}-${index}`} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
                  <Text style={{ color: colors.mutedForeground, fontSize: 9, minHeight: 12 }}>
                    {minutes ? `${minutes}m` : ''}
                  </Text>
                  <View style={{ justifyContent: 'flex-end', width: '100%', height: 91 }}>
                    <View style={{ width: '100%', height, borderRadius: 7, backgroundColor: isToday ? colors.primary : colors.accent }} />
                  </View>
                  <Text style={{ color: isToday ? colors.foreground : colors.mutedForeground, fontSize: 10, fontWeight: isToday ? '700' : '500' }}>
                    {dayLabels[index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Metric label="Daily average" value={`${weeklyAverage}m`} icon="bar-chart-2" />
          <Metric label="Gentle pauses" value={`${recentBlocks}`} icon="refresh-cw" />
        </View>

        <View style={styles.rowBetween}>
          <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginTop: 10, marginBottom: 12 }}>
            By space
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 10, marginBottom: 12 }}>
            today's check-ins
          </Text>
        </View>

        {apps.length ? apps.map((app) => (
          <View key={app.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 15 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
              <AppGlyph app={app} size={38} />
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={{ color: colors.foreground, fontWeight: '600' }}>{app.name}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{app.usageMinutes} / {app.limitMinutes}m</Text>
                </View>
                <View style={{ marginTop: 9 }}>
                  <ProgressBar value={app.usageMinutes / Math.max(app.limitMinutes, 1)} color={app.color} />
                </View>
              </View>
            </View>
          </View>
        )) : (
          <EmptyState icon="bar-chart-2" title="No spaces yet" body="Add an app space to start keeping a gentle record." />
        )}

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 3 }}>
          <UiIcon name="info" size={15} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, flex: 1 }}>
            Sample activity is included to help you explore. New check-ins are recorded only when you log them from a space.
            {sessions.length ? ` ${sessions.length} check-in${sessions.length === 1 ? '' : 's'} logged in this session history.` : ''}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: UiIconName }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { flex: 1, backgroundColor: colors.secondary, borderColor: colors.secondary, padding: 15, minHeight: 112 }]}>
      <UiIcon name={icon} size={17} color={colors.primary} />
      <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '700', marginTop: 14 }}>{value}</Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 3 }}>{label}</Text>
    </View>
  );
}
