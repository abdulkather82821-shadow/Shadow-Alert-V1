import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

export type BrandAppIconName =
  | 'instagram'
  | 'youtube'
  | 'reddit'
  | 'tiktok'
  | 'threads'
  | 'x'
  | 'snapchat'
  | 'facebook'
  | 'linkedin'
  | 'pinterest'
  | 'discord'
  | 'twitch';

const BRAND_ICON_NAMES = new Set<BrandAppIconName>([
  'instagram',
  'youtube',
  'reddit',
  'tiktok',
  'threads',
  'x',
  'snapchat',
  'facebook',
  'linkedin',
  'pinterest',
  'discord',
  'twitch',
]);

export function isBrandAppIcon(name: string): name is BrandAppIconName {
  return BRAND_ICON_NAMES.has(name as BrandAppIconName);
}

export function BrandAppIcon({
  name,
  color = '#FFFFFF',
  size = 28,
}: {
  name: BrandAppIconName;
  color?: string;
  size?: number;
}) {
  const line = {
    fill: 'none' as const,
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'instagram' && (
        <>
          <Rect x="4" y="4" width="16" height="16" rx="4" {...line} />
          <Circle cx="12" cy="12" r="3.5" {...line} />
          <Circle cx="17.2" cy="6.8" r="0.7" fill={color} stroke="none" />
        </>
      )}
      {name === 'youtube' && (
        <>
          <Path d="M20.2 8.1a2.3 2.3 0 0 0-1.6-1.6C17.2 6.1 12 6.1 12 6.1s-5.2 0-6.6.4a2.3 2.3 0 0 0-1.6 1.6 24 24 0 0 0-.4 3.9 24 24 0 0 0 .4 3.9 2.3 2.3 0 0 0 1.6 1.6c1.4.4 6.6.4 6.6.4s5.2 0 6.6-.4a2.3 2.3 0 0 0 1.6-1.6 24 24 0 0 0 .4-3.9 24 24 0 0 0-.4-3.9Z" {...line} />
          <Path d="m10.2 14.8 4.1-2.8-4.1-2.8v5.6Z" fill={color} stroke="none" />
        </>
      )}
      {name === 'reddit' && (
        <>
          <Circle cx="12" cy="13" r="6.4" {...line} />
          <Circle cx="9.5" cy="12.7" r="0.9" fill={color} stroke="none" />
          <Circle cx="14.5" cy="12.7" r="0.9" fill={color} stroke="none" />
          <Path d="M9 15.2c1.6 1.2 4.4 1.2 6 0" {...line} />
          <Path d="m14.5 6.7 1-2.7 2.4.7" {...line} />
          <Circle cx="18.2" cy="4.8" r="1.1" {...line} />
        </>
      )}
      {name === 'tiktok' && (
        <Path d="M14.4 4v9.7a3.2 3.2 0 1 1-2.4-3.1V8.1a5.8 5.8 0 1 0 4.8 5.6V8.3c1.1 1 2.4 1.5 3.7 1.5V7.3c-1.9-.2-3.3-1.3-3.7-3.3h-2.4Z" fill={color} stroke="none" />
      )}
      {name === 'threads' && (
        <>
          <Path d="M17.7 10.7c-.4-3.3-2.2-5.1-5.5-5.1-3.1 0-5.1 1.7-5.1 4.4 0 2.5 1.7 3.8 4.8 3.8 2.5 0 4.5-.9 5.7-2.5" {...line} />
          <Path d="M12.1 9.8c3.8 0 6.1 1.3 6.1 4.1 0 3.1-2.5 5.1-6.2 5.1-3.4 0-5.3-1.6-5.3-4.2 0-2.3 1.7-3.9 4.3-3.9 3.1 0 5 1.5 5 4.1" {...line} />
        </>
      )}
      {name === 'x' && (
        <Path d="m5 4.5 5.3 6.7L5.2 19.5h2.4l3.8-5.8 4.6 5.8H19l-5.5-7 4.8-8h-2.4l-3.4 5.3-4.2-5.3H5Z" fill={color} stroke="none" />
      )}
      {name === 'snapchat' && (
        <Path d="M12 4.5c-2.4 0-3.8 1.7-3.8 4.1v1.7c0 .8-.5 1.3-1.5 1.6-.5.1-.6.7-.2 1 .5.4 1 .5 1.6.6-.2.8-.7 1.4-1.5 1.8 1.2.7 2.5.3 3.1 1.1.6.8 1.2 1.1 2.3 1.1s1.7-.3 2.3-1.1c.6-.8 1.9-.4 3.1-1.1-.8-.4-1.3-1-1.5-1.8.6-.1 1.1-.2 1.6-.6.4-.3.3-.9-.2-1-1-.3-1.5-.8-1.5-1.6V8.6c0-2.4-1.4-4.1-3.8-4.1Z" {...line} />
      )}
      {name === 'facebook' && (
        <Path d="M13.6 20v-7h2.4l.4-2.7h-2.8V8.6c0-.8.2-1.4 1.5-1.4h1.6V4.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v1.8H8.3V13h2.5v7h2.8Z" fill={color} stroke="none" />
      )}
      {name === 'linkedin' && (
        <>
          <Rect x="4.5" y="4.5" width="3" height="3" fill={color} stroke="none" />
          <Rect x="4.8" y="9.3" width="2.4" height="10.2" fill={color} stroke="none" />
          <Path d="M11 9.3v10.2M11 13.4c.3-2.5 1.7-4.1 4-4.1 2.7 0 4 1.7 4 4.8v5.4" {...line} />
        </>
      )}
      {name === 'pinterest' && (
        <>
          <Circle cx="12" cy="12" r="7.5" {...line} />
          <Path d="M10.5 18.8c.6-1.5.8-2.1 1.1-3.4-.7-.7-1.1-1.6-1.1-2.7 0-2.1 1.5-3.8 3.4-3.8 1.6 0 2.7 1.1 2.7 2.7 0 1.8-1.1 4.1-2.8 4.1-.9 0-1.6-.7-1.4-1.6l.5-2c.2-.8-.2-1.4-.9-1.4-1 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4" {...line} />
        </>
      )}
      {name === 'discord' && (
        <>
          <Path d="M7.1 7.1C8.6 6.4 10.3 6 12 6s3.4.4 4.9 1.1c1.2 1.8 1.9 4 2.1 6.4-.9 1.4-2 2.4-3.3 3.1l-1-1.3c.5-.2 1-.5 1.4-.8M7.9 14.5c.4.3.9.6 1.4.8l-1 1.3c-1.3-.7-2.4-1.7-3.3-3.1.2-2.4.9-4.6 2.1-6.4" {...line} />
          <Circle cx="9.4" cy="11.6" r="1" fill={color} stroke="none" />
          <Circle cx="14.6" cy="11.6" r="1" fill={color} stroke="none" />
        </>
      )}
      {name === 'twitch' && (
        <>
          <Path d="M5 4.5h14v10.2l-3.5 3.1h-3.2l-2.2 2.2v-2.2H5V4.5Z" {...line} />
          <Line x1="10" y1="8.2" x2="10" y2="12" {...line} />
          <Line x1="14.2" y1="8.2" x2="14.2" y2="12" {...line} />
        </>
      )}
    </Svg>
  );
}