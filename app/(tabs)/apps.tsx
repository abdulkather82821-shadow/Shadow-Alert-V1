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
const categories = ['All', 'Social', 'Entertainment', 'News', 'Games', 'Focus'];

export default function AppsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { apps, addApp } = useShadowAlert();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filtered = useMemo(
    () => apps.filter((app) =>
      app.name.toLocaleLowerCase().includes(normalizedQuery)
      && (category === 'All' || app.category === category),
    ),
    [apps, category, normalizedQuery],
  );
  const available = useMemo(
    () => catalog.filter((item) =>
      !apps.some((app) => app.id === item.id)
      && item.name.toLocaleLowerCase().includes(normalizedQuery)
      && (category === 'All' || item.category === category),
    ),
    [apps, category, normalizedQuery],
  );

  return (
    <Screen scroll>
      <View style={{ paddingTop: 8 }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR PLAN</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Spaces</Text>
          </View>
          <View style={{ padding: 10, borderRadius: 16, backgroundColor: colors.accent }}>
            <UiIcon name="layers" size={20} color={colors.accentForeground} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 15, paddingHorizontal: 13, gap: 9, height: 48, marginBottom: 14 }}>
          <UiIcon name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            testID="app-search"
            accessibilityLabel="Search spaces"
            value={query}
            onChangeText={setQuery}
            placeholder="Search apps"
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            style={{ flex: 1, color: colors.foreground, fontSize: 14 }}
          />
          {query ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={8}>
              <UiIcon name="x" size={17} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {categories.map((item) => {
            const selected = category === item;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`filter-${item}`}
                key={item}
                onPress={() => setCategory(item)}
                style={{ backgroundColor: selected ? colors.foreground : colors.secondary, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <Text style={{ color: selected ? colors.background : colors.secondaryForeground, fontSize: 12, fontWeight: '600' }}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.appMeta, { color: colors.mutedForeground, marginBottom: 10 }]}>IN YOUR PLAN · {filtered.length}</Text>
        {filtered.length ? (
          filtered.map((app) => (
            <AppRow key={app.id} app={app} onPress={() => router.push(`/app/${app.id}`)} />
          ))
        ) : (
          <EmptyState icon="search" title="No spaces found" body="Try another name or category." />
        )}

        <Text style={[styles.appMeta, { color: colors.mutedForeground, marginTop: 16, marginBottom: 10 }]}>
          DISCOVER · READY WHEN YOU ARE
        </Text>
        {available.length ? (
          available.map((item) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name}, starts with a ${item.limitMinutes} minute daily limit`}
              testID={`add-app-${item.id}`}
              key={item.id}
              onPress={() => addApp(item)}
              style={({ pressed }) => [
                styles.appRow,
                { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', opacity: pressed ? 0.72 : 1 },
              ]}
            >
              <AppGlyph app={{ ...item, usageMinutes: 0, paused: false, history: [] }} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.appName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.appMeta, { color: colors.mutedForeground }]}>{item.category} · starts with {item.limitMinutes}m</Text>
              </View>
              <View style={{ backgroundColor: colors.secondary, borderRadius: 16, padding: 9 }}>
                <UiIcon name="plus" size={17} color={colors.foreground} />
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={{ color: colors.mutedForeground, fontSize: 13, lineHeight: 19, marginBottom: 12 }}>
            {normalizedQuery ? 'No matching apps in the catalog.' : 'You have added every app in this category.'}
          </Text>
        )}
      </View>
    </Screen>
  );
}
