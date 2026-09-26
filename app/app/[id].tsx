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
  const { apps, simulateUsage, togglePaused, deleteApp } = useShadowAlert();
  const app = apps.find((item) => item.id === id);
  if (!app) return <Screen><View style={{ paddingTop: Platform.OS === 'web' ? 67 : insets.top }}><Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '700' }}>Space not found</Text><Text style={{ color: colors.mutedForeground, marginTop: 8 }}>It may have been removed from your watch list.</Text></View></Screen>;
  const ratio = app.usageMinutes / Math.max(app.limitMinutes, 1);
  const confirmDelete = () => Alert.alert(`Remove ${app.name}?`, 'This removes the local limit and its history.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => { deleteApp(app.id); router.back(); } }]);
  return <Screen scroll><View style={{ paddingTop: Platform.OS === 'web' ? 67 : insets.top }}><View style={styles.rowBetween}><Pressable testID="detail-back" onPress={() => router.back()} style={{ paddingVertical: 8 }}><BackIcon size={23} color={colors.foreground} /></Pressable><Pressable testID="delete-app" onPress={confirmDelete} style={{ padding: 8 }}><UiIcon name="trash-2" size={19} color={colors.destructive} /></Pressable></View>
    <View style={{ alignItems: 'center', paddingTop: 18, paddingBottom: 20 }}><AppGlyph app={app} size={72} /><Text style={{ color: colors.foreground, fontSize: 28, fontWeight: '700', marginTop: 14 }}>{app.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 5 }}>{app.category} space</Text></View>
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.rowBetween}><View><Text style={[styles.appMeta, { color: colors.mutedForeground }]}>TODAY'S USE</Text><Text style={{ color: colors.foreground, fontSize: 38, fontWeight: '700', marginTop: 6 }}>{app.usageMinutes}<Text style={{ fontSize: 16, fontWeight: '500' }}> min</Text></Text></View><View style={{ alignItems: 'flex-end' }}><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>of {app.limitMinutes}m</Text><Text style={{ color: ratio >= 1 ? colors.destructive : colors.primary, fontWeight: '700', fontSize: 13, marginTop: 8 }}>{app.paused ? 'Paused' : ratio >= 1 ? 'At the line' : `${Math.max(app.limitMinutes - app.usageMinutes, 0)}m remaining`}</Text></View></View><View style={{ marginTop: 18 }}><ProgressBar value={ratio} color={ratio >= 1 ? colors.destructive : app.color} /></View><Pressable testID="edit-limit" onPress={() => router.push(`/app/limit/${app.id}`)} style={{ marginTop: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Edit daily limit</Text><UiIcon name="chevron-right" color={colors.primary} size={16} /></Pressable></View>
    <View style={[styles.card, { backgroundColor: colors.secondary, borderColor: colors.secondary }]}><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700' }}>Try a small experiment</Text><Text style={{ color: colors.mutedForeground, fontSize: 13, lineHeight: 19, marginTop: 5 }}>Log a few minutes to see how the line feels. This stays on your device.</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 15 }}>{[5, 10, 15].map((minutes) => <Pressable testID={`simulate-${minutes}`} key={minutes} onPress={() => { simulateUsage(app.id, minutes); if (app.usageMinutes + minutes >= app.limitMinutes) router.push(`/block/${app.id}`); }} style={({ pressed }) => [{ backgroundColor: colors.card, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 15, opacity: pressed ? 0.7 : 1 }]}><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>+{minutes}m</Text></Pressable>)}</View></View>
    <PrimaryButton testID="pause-monitoring" secondary onPress={() => togglePaused(app.id)}>{app.paused ? 'Resume monitoring' : 'Pause monitoring'}</PrimaryButton>
    <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginTop: 24, marginBottom: 12 }}>Seven-day rhythm</Text>
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'row', alignItems: 'flex-end', height: 155, gap: 8, paddingBottom: 18 }]}>{app.history.slice(-7).map((value, index) => <View key={`${index}-${value}`} style={{ flex: 1, alignItems: 'center', gap: 7 }}><View style={{ width: '100%', height: Math.max(8, Math.min(94, value / Math.max(app.limitMinutes, 1) * 94)), borderRadius: 6, backgroundColor: index === 6 ? app.color : colors.accent }} /><Text style={{ color: colors.mutedForeground, fontSize: 10 }}>{['M', 'T', 'W', 'T', 'F', 'S', 'T'][index]}</Text></View>)}</View>
    <Text style={{ color: colors.mutedForeground, textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 10 }}>A limit is a promise you can keep adjusting.</Text>
  </View></Screen>;
}