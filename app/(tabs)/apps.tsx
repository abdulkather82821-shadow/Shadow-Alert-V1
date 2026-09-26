import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppGlyph, AppRow, EmptyState, Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon } from '@/components/UiIcon';

const catalog = [
  { id: 'snapchat', name: 'Snapchat', category: 'Social' as const, icon: 'camera', color: '#C5A83A', limitMinutes: 25 },
  { id: 'facebook', name: 'Facebook', category: 'Social' as const, icon: 'users', color: '#4F6FAE', limitMinutes: 30 },
  { id: 'linkedin', name: 'LinkedIn', category: 'Social' as const, icon: 'briefcase', color: '#3E6E9E', limitMinutes: 30 },
  { id: 'pinterest', name: 'Pinterest', category: 'Social' as const, icon: 'heart', color: '#B9585F', limitMinutes: 25 },
  { id: 'discord', name: 'Discord', category: 'Social' as const, icon: 'message-square', color: '#6473B5', limitMinutes: 30 },
  { id: 'tiktok', name: 'TikTok', category: 'Entertainment' as const, icon: 'music', color: '#6A606F', limitMinutes: 30 },
  { id: 'threads', name: 'Threads', category: 'Social' as const, icon: 'at-sign', color: '#5D6670', limitMinutes: 25 },
  { id: 'twitch', name: 'Twitch', category: 'Entertainment' as const, icon: 'radio', color: '#7D6591', limitMinutes: 30 },
  { id: 'x', name: 'X', category: 'News' as const, icon: 'hash', color: '#59656C', limitMinutes: 20 },
];
const categories = ['All', 'Social', 'Entertainment', 'News', 'Focus'];
export default function AppsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { apps, addApp } = useShadowAlert();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => apps.filter((app) => app.name.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || app.category === category)), [apps, query, category]);
  const available = catalog.filter((item) => !apps.some((app) => app.id === item.id) && item.name.toLowerCase().includes(query.toLowerCase()));
  return <Screen scroll><View style={{ paddingTop: 8 }}><View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR SPACES</Text><Text style={[styles.title, { color: colors.foreground }]}>Apps</Text></View><View style={[{ padding: 10, borderRadius: 16, backgroundColor: colors.accent }]}><UiIcon name="layers" size={20} color={colors.accentForeground} /></View></View>
    <View style={[{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 15, paddingHorizontal: 13, gap: 9, height: 48, marginBottom: 14 }]}><UiIcon name="search" size={18} color={colors.mutedForeground} /><TextInput testID="app-search" value={query} onChangeText={setQuery} placeholder="Search your spaces" placeholderTextColor={colors.mutedForeground} style={{ flex: 1, color: colors.foreground, fontSize: 14 }} /></View>
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>{categories.map((item) => <Pressable testID={`filter-${item}`} key={item} onPress={() => setCategory(item)} style={{ backgroundColor: category === item ? colors.foreground : colors.secondary, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: category === item ? colors.background : colors.secondaryForeground, fontSize: 12, fontWeight: '600' }}>{item}</Text></Pressable>)}</View>
    <Text style={[styles.appMeta, { color: colors.mutedForeground, marginBottom: 10 }]}>MONITORED · {filtered.length}</Text>
    {filtered.length ? filtered.map((app) => <AppRow key={app.id} app={app} onPress={() => router.push(`/app/${app.id}`)} />) : <EmptyState icon="search" title="No spaces found" body="Try another name or category." />}
    {available.length > 0 && <><Text style={[styles.appMeta, { color: colors.mutedForeground, marginTop: 18, marginBottom: 10 }]}>CATALOG · READY WHEN YOU ARE</Text>{available.map((item) => <Pressable testID={`add-app-${item.id}`} key={item.id} onPress={() => addApp(item)} style={({ pressed }) => [styles.appRow, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', opacity: pressed ? 0.72 : 1 }]}><AppGlyph app={{ ...item, usageMinutes: 0, paused: false, history: [] }} size={42} /><View style={{ flex: 1 }}><Text style={[styles.appName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.appMeta, { color: colors.mutedForeground }]}>{item.category} · starts with {item.limitMinutes}m</Text></View><View style={{ backgroundColor: colors.secondary, borderRadius: 16, padding: 9 }}><UiIcon name="plus" size={17} color={colors.foreground} /></View></Pressable>)}</>}
  </View></Screen>;
}