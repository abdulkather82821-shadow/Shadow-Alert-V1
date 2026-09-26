import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppGlyph, PrimaryButton, Screen, styles } from '@/components/ShadowUI';
import { BackIcon } from '@/components/TabIcon';
import { useColors } from '@/hooks/useColors';
export default function LimitScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { apps, updateLimit } = useShadowAlert();
  const app = apps.find((item) => item.id === id);
  const [value, setValue] = useState(app ? String(app.limitMinutes) : '30');
  const [error, setError] = useState('');
  if (!app) return <Screen><Text style={{ color: colors.foreground }}>Space not found.</Text></Screen>;
  const save = () => { const minutes = Number(value); if (!Number.isInteger(minutes) || minutes < 5 || minutes > 240) { setError('Choose a whole number between 5 and 240 minutes.'); return; } Keyboard.dismiss(); updateLimit(app.id, minutes); router.back(); };
  return <Screen scroll><View style={{ paddingTop: Platform.OS === 'web' ? 67 : insets.top }}><Pressable testID="limit-back" onPress={() => router.back()} style={{ paddingVertical: 8, alignSelf: 'flex-start' }}><BackIcon size={23} color={colors.foreground} /></Pressable><View style={{ alignItems: 'center', paddingVertical: 22 }}><AppGlyph app={app} size={62} /><Text style={{ color: colors.foreground, fontSize: 27, fontWeight: '700', marginTop: 13 }}>Set your line</Text><Text style={{ color: colors.mutedForeground, fontSize: 14, marginTop: 6 }}>{app.name} · daily limit</Text></View>
    <View style={[styles.card, { backgroundColor: colors.primary, borderColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontSize: 13, lineHeight: 20 }}>Choose the amount that leaves room for what matters next.</Text><Text style={{ color: colors.primaryForeground, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 16 }}>Your intention</Text><Text style={{ color: colors.primaryForeground, fontSize: 20, fontWeight: '700', marginTop: 6 }}>“I’m here on purpose.”</Text></View>
    <Text style={[styles.appMeta, { color: colors.mutedForeground, marginBottom: 8 }]}>MINUTES PER DAY</Text><View style={[{ borderWidth: 1, borderColor: error ? colors.destructive : colors.border, backgroundColor: colors.card, borderRadius: 17, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }]}><TextInput testID="limit-input" autoFocus keyboardType="number-pad" value={value} onChangeText={(text) => { setValue(text.replace(/[^0-9]/g, '')); setError(''); }} style={{ color: colors.foreground, fontSize: 38, fontWeight: '700', flex: 1, paddingVertical: 14 }} /><Text style={{ color: colors.mutedForeground, fontSize: 15 }}>minutes</Text></View>{!!error && <Text style={{ color: colors.destructive, fontSize: 12, marginBottom: 9 }}>{error}</Text>}
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>{[15, 30, 45, 60].map((minutes) => <Pressable testID={`preset-${minutes}`} key={minutes} onPress={() => { setValue(String(minutes)); setError(''); }} style={{ flex: 1, paddingVertical: 12, borderRadius: 13, alignItems: 'center', backgroundColor: Number(value) === minutes ? colors.foreground : colors.secondary }}><Text style={{ color: Number(value) === minutes ? colors.background : colors.secondaryForeground, fontSize: 12, fontWeight: '700' }}>{minutes}m</Text></Pressable>)}</View><PrimaryButton testID="save-limit" onPress={save}>Save this limit</PrimaryButton><Text style={{ textAlign: 'center', color: colors.mutedForeground, fontSize: 12, marginTop: 13, lineHeight: 18 }}>You can change this whenever your evening changes.</Text>
  </View></Screen>;
}