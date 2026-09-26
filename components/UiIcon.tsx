import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { TabIcon } from '@/components/TabIcon';

export type UiIconName =
  | 'alert-circle'
  | 'arrow-left'
  | 'bar-chart-2'
  | 'bell'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-up'
  | 'eye'
  | 'feather'
  | 'info'
  | 'layers'
  | 'moon'
  | 'pause'
  | 'plus'
  | 'refresh-cw'
  | 'rotate-ccw'
  | 'search'
  | 'settings'
  | 'shield'
  | 'sliders'
  | 'trash-2'
  | 'x';

export function UiIcon({
  name,
  color,
  size = 20,
}: {
  name: UiIconName;
  color: string;
  size?: number;
}) {
  if (name === 'settings') {
    return <TabIcon name="settings" color={color} size={size} />;
  }

  const line = {
    fill: 'none' as const,
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'alert-circle' && (
        <>
          <Circle cx="12" cy="12" r="9" {...line} />
          <Line x1="12" y1="8" x2="12" y2="13" {...line} />
          <Circle cx="12" cy="16.5" r="0.7" fill={color} stroke="none" />
        </>
      )}
      {name === 'arrow-left' && (
        <>
          <Line x1="19" y1="12" x2="5" y2="12" {...line} />
          <Polyline points="11,6 5,12 11,18" {...line} />
        </>
      )}
      {name === 'bar-chart-2' && (
        <>
          <Line x1="5" y1="20" x2="5" y2="10" {...line} />
          <Line x1="12" y1="20" x2="12" y2="4" {...line} />
          <Line x1="19" y1="20" x2="19" y2="7" {...line} />
        </>
      )}
      {name === 'bell' && (
        <>
          <Path d="M18 10.5a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.2h17C20.5 17.5 18 17.5 18 10.5Z" {...line} />
          <Path d="M10 21h4" {...line} />
        </>
      )}
      {name === 'check' && <Polyline points="5,12.5 10,17.5 19,7" {...line} />}
      {name === 'check-circle' && (
        <>
          <Circle cx="12" cy="12" r="9" {...line} />
          <Polyline points="7.5,12 10.5,15 16.7,8.8" {...line} />
        </>
      )}
      {name === 'chevron-down' && <Polyline points="6,9 12,15 18,9" {...line} />}
      {name === 'chevron-right' && <Polyline points="9,6 15,12 9,18" {...line} />}
      {name === 'chevron-up' && <Polyline points="6,15 12,9 18,15" {...line} />}
      {name === 'eye' && (
        <>
          <Path d="M3 12s3.2-5 9-5 9 5 9 5-3.2 5-9 5-9-5-9-5Z" {...line} />
          <Circle cx="12" cy="12" r="2.2" {...line} />
        </>
      )}
      {name === 'feather' && (
        <>
          <Path d="M20 4c-6.8-.3-12.5 3.4-13.9 8.6C5.4 15.2 6.5 18 9 18c4.1 0 8.4-3.7 9.6-8.3" {...line} />
          <Path d="M4 20c3.8-5.1 7.3-8.3 12.7-11.1" {...line} />
        </>
      )}
      {name === 'info' && (
        <>
          <Circle cx="12" cy="12" r="9" {...line} />
          <Line x1="12" y1="10.7" x2="12" y2="16" {...line} />
          <Circle cx="12" cy="7.4" r="0.7" fill={color} stroke="none" />
        </>
      )}
      {name === 'layers' && (
        <>
          <Path d="m12 4 8 4-8 4-8-4 8-4Z" {...line} />
          <Path d="m4 12 8 4 8-4" {...line} />
          <Path d="m4 16 8 4 8-4" {...line} />
        </>
      )}
      {name === 'moon' && <Path d="M19.5 15.8A8 8 0 0 1 8.2 4.5 8.2 8.2 0 1 0 19.5 15.8Z" {...line} />}
      {name === 'pause' && (
        <>
          <Rect x="7" y="5" width="3.5" height="14" rx="1" {...line} />
          <Rect x="13.5" y="5" width="3.5" height="14" rx="1" {...line} />
        </>
      )}
      {name === 'plus' && (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" {...line} />
          <Line x1="5" y1="12" x2="19" y2="12" {...line} />
        </>
      )}
      {name === 'refresh-cw' && (
        <>
          <Path d="M20 11a8 8 0 0 0-13.7-4.8L4 8.5" {...line} />
          <Polyline points="4,4.5 4,8.5 8,8.5" {...line} />
          <Path d="M4 13a8 8 0 0 0 13.7 4.8l2.3-2.3" {...line} />
          <Polyline points="20,19.5 20,15.5 16,15.5" {...line} />
        </>
      )}
      {name === 'rotate-ccw' && (
        <>
          <Path d="M4 10a8 8 0 1 1 2.3 5.7" {...line} />
          <Polyline points="4,5 4,10 9,10" {...line} />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle cx="10.7" cy="10.7" r="6.2" {...line} />
          <Line x1="15.3" y1="15.3" x2="20" y2="20" {...line} />
        </>
      )}
      {name === 'shield' && <Path d="M12 3.5 19 6v5.2c0 4.4-2.8 7.8-7 9.3-4.2-1.5-7-4.9-7-9.3V6l7-2.5Z" {...line} />}
      {name === 'sliders' && (
        <>
          <Line x1="5" y1="6" x2="19" y2="6" {...line} />
          <Line x1="5" y1="12" x2="19" y2="12" {...line} />
          <Line x1="5" y1="18" x2="19" y2="18" {...line} />
          <Circle cx="9" cy="6" r="1.8" fill={color} stroke="none" />
          <Circle cx="15" cy="12" r="1.8" fill={color} stroke="none" />
          <Circle cx="11" cy="18" r="1.8" fill={color} stroke="none" />
        </>
      )}
      {name === 'trash-2' && (
        <>
          <Path d="M4.5 7h15M9 7V4.5h6V7M7 7l.7 12.5h8.6L17 7M10 10.5v5M14 10.5v5" {...line} />
        </>
      )}
      {name === 'x' && (
        <>
          <Line x1="6" y1="6" x2="18" y2="18" {...line} />
          <Line x1="18" y1="6" x2="6" y2="18" {...line} />
        </>
      )}
    </Svg>
  );
}