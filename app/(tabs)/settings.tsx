import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { PrimaryButton, Screen, styles } from '@/components/ShadowUI';
import { useColors } from '@/hooks/useColors';
import { UiIcon, type UiIconName } from '@/components/UiIcon';
export default function SettingsScreen() {
  const colors = useColors();
  const { settings, toggleSetting, updateIntention, clearHistory, resetLimits } = useShadowAlert();
  const [about, setAbout] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [intentionDraft, setIntentionDraft] = useState(settings.intention);
  useEffect(() => setIntentionDraft(settings.intention), [settings.intention]);

  const confirm = (title: string, body: string, action: () => void) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${body}`)) action();
      return;
    }
    Alert.alert(title, body, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', style: 'destructive', onPress: action },
    ]);
  };
  const saveIntention = () => {
    const nextIntention = intentionDraft.trim();
    if (nextIntention) updateIntention(nextIntention);
  };
  return (
    <Screen scroll>
      <View style={{ paddingTop: 8 }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR SPACE</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
          </View>
          <View
            style={{
              padding: 10,
              borderRadius: 16,
              backgroundColor: colors.accent,
            }}
          >
            <UiIcon name="sliders" size={20} color={colors.accentForeground} />
          </View>
        </View>

        <Text style={[styles.appMeta, { color: colors.mutedForeground, marginBottom: 9 }]}>YOUR INTENTION</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '600' }}>A thought to carry with you</Text>
          <TextInput
            testID="intention-input"
            accessibilityLabel="Your intention"
            value={intentionDraft}
            onChangeText={setIntentionDraft}
            maxLength={120}
            multiline
            textAlignVertical="top"
            placeholder="Use what helps. Leave what pulls."
            placeholderTextColor={colors.mutedForeground}
            style={{ color: colors.foreground, fontSize: 15, lineHeight: 22, minHeight: 76, paddingTop: 12, paddingBottom: 12 }}
          />
          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 12 }}>This note appears on your home screen.</Text>
          <PrimaryButton
            testID="save-intention"
            disabled={!intentionDraft.trim() || intentionDraft.trim() === settings.intention}
            onPress={saveIntention}
          >
            Save intention
          </PrimaryButton>
        </View>

        <Text style={[styles.appMeta, { color: colors.mutedForeground, marginBottom: 9 }]}>COACHING</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, paddingVertical: 4 },
          ]}
        >
          <SettingRow
            icon="bell"
            title="Limit reminders"
            body="Show a pause when a manual check-in reaches your line."
            value={settings.alerts}
            onChange={() => toggleSetting('alerts')}
          />
          <SettingRow
            icon="eye"
            title="Manual check-ins"
            body="Allow activity logging in this preview."
            value={settings.monitoring}
            onChange={() => toggleSetting('monitoring')}
          />
          <SettingRow
            icon="moon"
            title="Dark evening"
            body="Use the deeper, low-light palette."
            value={settings.darkMode}
            onChange={() => toggleSetting('darkMode')}
          />
        </View>

        <Text
          style={[
            styles.appMeta,
            { color: colors.mutedForeground, marginTop: 12, marginBottom: 9 },
          ]}
        >
          LOCAL DATA
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, paddingVertical: 4 },
          ]}
        >
          <ActionRow
            icon="trash-2"
            title="Clear usage history"
            onPress={() =>
              confirm(
                'Clear usage history?',
                'Your limits stay. Usage, sessions, and recovery moments will be cleared.',
                clearHistory,
              )
            }
          />
          <ActionRow
            icon="rotate-ccw"
            title="Reset all limits"
            onPress={() =>
              confirm(
                'Reset all limits?',
                'Every space will return to a 30 minute daily line.',
                resetLimits,
              )
            }
          />
        </View>

        <Text
          style={[
            styles.appMeta,
            { color: colors.mutedForeground, marginTop: 12, marginBottom: 9 },
          ]}
        >
          ABOUT
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, paddingVertical: 4 },
          ]}
        >
          <Disclosure
            title="About Shadow Alert"
            icon="info"
            open={about}
            onPress={() => setAbout(!about)}
          >
            <Text style={{ color: colors.mutedForeground, lineHeight: 21, fontSize: 13 }}>
              Shadow Alert is a gentle pause, not a lockbox or a scorecard. This preview lets you
              log sample check-ins and experiment with daily lines; system-wide app tracking and
              blocking are not enabled.
            </Text>
          </Disclosure>
          <Disclosure
            title="Privacy"
            icon="shield"
            open={privacy}
            onPress={() => setPrivacy(!privacy)}
          >
            <Text style={{ color: colors.mutedForeground, lineHeight: 21, fontSize: 13 }}>
              Your plan and check-ins are saved locally on this device or browser. Shadow Alert
              does not send them to a server or read app activity in the background.
            </Text>
          </Disclosure>
        </View>

        <Text
          style={{
            color: colors.mutedForeground,
            textAlign: 'center',
            fontSize: 11,
            marginTop: 20,
          }}
        >
          Shadow Alert · made for the moment before the scroll
        </Text>
        <Text
          style={{
            color: colors.mutedForeground,
            textAlign: 'center',
            fontSize: 10,
            marginTop: 5,
          }}
        >
          Version 1.0
        </Text>
      </View>
    </Screen>
  );
}
function SettingRow({
  icon,
  title,
  body,
  value,
  onChange,
}: {
  icon: UiIconName;
  title: string;
  body: string;
  value: boolean;
  onChange: () => void;
}) {
  const colors = useColors();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 11,
          backgroundColor: colors.secondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UiIcon name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 14 }}>
          {title}
        </Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 3 }}>
          {body}
        </Text>
      </View>
      <Switch
        testID={`setting-${title}`}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.muted, true: colors.accent }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
      />
    </View>
  );
}
function ActionRow({
  icon,
  title,
  onPress,
}: {
  icon: UiIconName;
  title: string;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      testID={title.replace(/\s/g, '-')}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          gap: 12,
          opacity: pressed ? 0.65 : 1,
        },
      ]}
    >
      <UiIcon name={icon} size={17} color={colors.destructive} />
      <Text style={{ color: colors.foreground, fontSize: 14, flex: 1 }}>{title}</Text>
      <UiIcon name="chevron-right" size={17} color={colors.mutedForeground} />
    </Pressable>
  );
}

function Disclosure({
  title,
  icon,
  open,
  onPress,
  children,
}: {
  title: string;
  icon: UiIconName;
  open: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const colors = useColors();

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 16,
        }}
      >
        <UiIcon name={icon} size={17} color={colors.primary} />
        <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '600', flex: 1 }}>
          {title}
        </Text>
        <UiIcon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={17}
          color={colors.mutedForeground}
        />
      </Pressable>
      {open ? <View style={{ paddingLeft: 29, paddingBottom: 16 }}>{children}</View> : null}
    </View>
  );
}