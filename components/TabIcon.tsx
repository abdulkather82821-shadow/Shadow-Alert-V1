import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

export type TabIconName = 'home' | 'apps' | 'analytics' | 'settings';

export function BackIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="m14.5 5-7 7 7 7M8 12h12" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} />
    </Svg>
  );
}

export function TabIcon({
  name,
  color,
  size = 24,
}: {
  name: TabIconName;
  color: string;
  size?: number;
}) {
  const common = {
    fill: 'none' as const,
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <>
          <Path d="M3.5 10.7 12 3.9l8.5 6.8" {...common} />
          <Path d="M5.7 9.6v9.1c0 .8.6 1.4 1.4 1.4h9.8c.8 0 1.4-.6 1.4-1.4V9.6" {...common} />
          <Path d="M9.3 20.1v-5.8h5.4v5.8" {...common} />
        </>
      )}
      {name === 'apps' && (
        <>
          <Rect x="3.6" y="4.2" width="16.8" height="15.6" rx="1.9" {...common} />
          <Line x1="3.8" y1="8.5" x2="20.2" y2="8.5" {...common} />
          <Circle cx="6.8" cy="6.35" r="0.55" fill={color} stroke="none" />
          <Line x1="9.3" y1="6.35" x2="16.9" y2="6.35" {...common} />
        </>
      )}
      {name === 'analytics' && (
        <>
          <Path d="M4.3 4.2v15.5h15.4" {...common} />
          <Line x1="7.8" y1="16.2" x2="7.8" y2="11.9" {...common} />
          <Line x1="12" y1="16.2" x2="12" y2="8.1" {...common} />
          <Line x1="16.2" y1="16.2" x2="16.2" y2="5.2" {...common} />
        </>
      )}
      {name === 'settings' && (
        <>
          <Path
            d="M19.4 13.5c.1-.5.1-1 0-1.5l1.6-1.2-1.7-3-1.9.8c-.4-.3-.9-.6-1.4-.8L15.7 5h-3.4l-.3 2.1c-.5.2-1 .5-1.4.8l-1.9-.8-1.7 3 1.6 1.2c-.1.5-.1 1 0 1.5L7 14.7l1.7 3 1.9-.8c.4.3.9.6 1.4.8l.3 2.1h3.4l.3-2.1c.5-.2 1-.5 1.4-.8l1.9.8 1.7-3-1.6-1.2Z"
            {...common}
          />
          <Circle cx="14" cy="12.7" r="2.3" {...common} />
        </>
      )}
    </Svg>
  );
}