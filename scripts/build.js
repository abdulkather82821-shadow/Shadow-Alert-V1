const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const expoCli = path.join(
  projectRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'expo.cmd' : 'expo',
);

if (!fs.existsSync(expoCli)) {
  console.error('Expo is not installed. Run npm install before building.');
  process.exit(1);
}

console.log('Exporting Shadow Alert for the web...');
const result = spawnSync(expoCli, ['export', '--platform', 'web'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    EXPO_OFFLINE: process.env.EXPO_OFFLINE || '1',
    EXPO_NO_TELEMETRY: '1',
  },
});

if (result.error) {
  console.error(`Unable to start Expo: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
