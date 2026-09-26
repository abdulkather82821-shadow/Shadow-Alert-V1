import React from 'react';
import { Text, View } from 'react-native';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon, type UiIconName } from '@/components/UiIcon';
export default function AnalyticsScreen() {
  const colors = useColors();
  const { apps, sessions, blocks } = useShadowAlert();
  const total = apps.reduce((sum, app) => sum + app.usageMinutes, 0);
  const limit = apps.reduce((sum, app) => sum + app.limitMinutes, 0);
  return <Screen scroll><View style={{ paddingTop: 8 }}><View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>A GENTLE LOOK BACK</Text><Text style={[styles.title, { color: colors.foreground }]}>Analytics</Text></View><UiIcon name="bar-chart-2" size={25} color={colors.primary} /></View>
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.appMeta, { color: colors.mutedForeground }]}>THIS WEEK</Text><Text style={{ color: colors.foreground, fontSize: 36, fontWeight: '700', letterSpacing: -1, marginTop: 6 }}>{total}<Text style={{ fontSize: 17, fontWeight: '500' }}> min</Text></Text><Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 3 }}>across {apps.length} intentional spaces</Text><View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 7, height: 126, marginTop: 24, paddingBottom: 20 }}>{[16, 28, 46, 31, 67, 52, Math.max(18, Math.min(96, total / Math.max(apps.length, 1) / 2))].map((height, index) => <View key={index} style={{ flex: 1, alignItems: 'center', gap: 7 }}><View style={{ width: '100%', height, minHeight: 8, borderRadius: 7, backgroundColor: index === 6 ? colors.primary : colors.accent }} /><Text style={{ color: colors.mutedForeground, fontSize: 10 }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text></View>)}</View></View>
    <View style={{ flexDirection: 'row', gap: 10 }}><Metric label="Within limits" value={`${Math.max(0, limit - total)}m`} icon="check" /><Metric label="Recovery moments" value={`${blocks.length}`} icon="refresh-cw" /></View>
    <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginTop: 16, marginBottom: 12 }}>By space</Text>
    {apps.map((app) => <View key={app.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 15 }]}><View style={styles.rowBetween}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{app.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{app.usageMinutes}m / {app.limitMinutes}m</Text></View><View style={{ marginTop: 11 }}><View style={[{ height: 7, backgroundColor: colors.muted, borderRadius: 7 }]}><View style={{ height: 7, borderRadius: 7, width: `${Math.min(100, app.usageMinutes / Math.max(app.limitMinutes, 1) * 100)}%`, backgroundColor: app.color }} /></View></View></View>)}
    {!sessions.length && <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: 'center', marginTop: 5 }}>Simulated sessions will appear here as your week takes shape.</Text>}
  </View></Screen>;
}
function Metric({ label, value, icon }: { label: string; value: string; icon: UiIconName }) { const colors = useColors(); return <View style={[styles.card, { flex: 1, backgroundColor: colors.secondary, borderColor: colors.secondary, padding: 15 }]}><UiIcon name={icon} size={17} color={colors.primary} /><Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '700', marginTop: 14 }}>{value}</Text><Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 3 }}>{label}</Text></View>; }