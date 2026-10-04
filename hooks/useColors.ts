import colors from '@/constants/colors';
import { useShadowAlert } from '@/context/ShadowAlertContext';

/** Returns the palette selected in Settings. */
export function useColors() {
  const { settings } = useShadowAlert();
  const palette = settings.darkMode ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
