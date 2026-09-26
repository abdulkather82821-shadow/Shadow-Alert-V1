/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#155EEF',
    tint: '#155EEF',
    background: '#FFFFFF',
    foreground: '#155EEF',
    card: '#FFFFFF',
    cardForeground: '#155EEF',
    primary: '#155EEF',
    primaryForeground: '#FFFFFF',
    secondary: '#EEF4FF',
    secondaryForeground: '#174EA6',
    muted: '#F4F7FC',
    mutedForeground: '#5B78A8',
    accent: '#DCE9FF',
    accentForeground: '#174EA6',
    destructive: '#C93737',
    destructiveForeground: '#FFFFFF',
    border: '#D7E2F2',
    input: '#B7C9E4',
    success: '#237B57',
    warning: '#B7791F',
    inkSoft: '#44618F',
  },
  dark: {
    text: '#F6EDE3',
    tint: '#F0A06D',
    background: '#19151A',
    foreground: '#F6EDE3',
    card: '#282026',
    cardForeground: '#F6EDE3',
    primary: '#F0A06D',
    primaryForeground: '#24181A',
    secondary: '#33282C',
    secondaryForeground: '#E4CFC2',
    muted: '#30262B',
    mutedForeground: '#A9958D',
    accent: '#5B3630',
    accentForeground: '#F8C9A6',
    destructive: '#E07872',
    destructiveForeground: '#24181A',
    border: '#45363B',
    input: '#4A3940',
    success: '#9AB28C',
    warning: '#D8A65D',
    inkSoft: '#C0AAA0',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
