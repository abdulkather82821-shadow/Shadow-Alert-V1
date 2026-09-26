import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { AppGlyph, PrimaryButton, Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon } from '@/components/UiIcon';
export default function BlockScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { apps, recoverFromBlock, togglePaused } = useShadowAlert();
  const app = apps.find((item) => item.id === id);
  if (!app) return <Screen><Text style={{ color: colors.foreground }}>Space not found.</Text></Screen>;
  return <View style={{ flex: 1, backgroundColor: colors.primary, paddingHorizontal: 24, paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 20, paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 20 }}><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><View style={{ width: 78, height: 78, borderRadius: 28, backgroundColor: colors.primaryForeground, alignItems: 'center', justifyContent: 'center', marginBottom: 25 }}><UiIcon name="pause" size={32} color={colors.primary} /></View><AppGlyph app={app} size={48} /><Text style={{ color: colors.primaryForeground, fontSize: 35, fontWeight: '700', letterSpacing: -1, textAlign: 'center', marginTop: 18 }}>A small pause.</Text><Text style={{ color: colors.primaryForeground, opacity: 0.85, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 12, maxWidth: 300 }}>You reached your {app.name} line for today. The next choice is still yours.</Text><View style={{ width: 52, height: 1, backgroundColor: colors.primaryForeground, opacity: 0.4, marginVertical: 26 }} /><Text style={{ color: colors.primaryForeground, fontSize: 20, fontWeight: '700', textAlign: 'center' }}>“I’m here on purpose.”</Text><Text style={{ color: colors.primaryForeground, opacity: 0.75, fontSize: 13, textAlign: 'center', marginTop: 8 }}>Take one breath, then choose what comes next.</Text></View><View style={{ gap: 10 }}><PrimaryButton testID="recover-block" secondary onPress={() => { recoverFromBlock(app.id); router.back(); }}>Choose something else</PrimaryButton><PrimaryButton testID="pause-from-block" onPress={() => { togglePaused(app.id); router.back(); }}>Pause {app.name} for now</PrimaryButton></View></View>;
}