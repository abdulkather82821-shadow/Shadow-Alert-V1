const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const STATIC_ROOT = path.resolve(__dirname, '..', 'dist');
const rawBasePath = (process.env.BASE_PATH || '/').trim();
const basePath = rawBasePath === '/' ? '' : `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`;

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendText(res, status, text) {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function isInsideRoot(filePath) {
  return filePath === STATIC_ROOT || filePath.startsWith(`${STATIC_ROOT}${path.sep}`);
}

function resolveRequestPath(pathname) {
  let relativePath;
  try {
    relativePath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const filePath = path.resolve(STATIC_ROOT, `.${relativePath}`);
  return isInsideRoot(filePath) ? filePath : null;
}

function serveFile(req, res, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'content-type': MIME_TYPES[extension] || 'application/octet-stream',
    'content-length': stat.size,
    'cache-control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'x-content-type-options': 'nosniff',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { allow: 'GET, HEAD' });
    res.end();
    return;
  }

  let pathname;
  try {
    pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {
    return sendText(res, 400, 'Bad request');
  }

  if (pathname === '/status' || pathname === '/health') {
    return sendText(res, 200, 'ok');
  }

  if (basePath) {
    if (pathname === basePath) pathname = '/';
    else if (pathname.startsWith(`${basePath}/`)) pathname = pathname.slice(basePath.length);
    else return sendText(res, 404, 'Not found');
  }

  const indexPath = path.join(STATIC_ROOT, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return sendText(res, 503, 'The web build is missing. Run npm run build first.');
  }

  let filePath = resolveRequestPath(pathname);
  if (!filePath) return sendText(res, 403, 'Forbidden');

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(req, res, filePath);
  }

  // Expo Router handles app routes in the browser, so unknown non-asset paths
  // should render the application shell and let the router show its not-found page.
  if (path.extname(pathname)) return sendText(res, 404, 'Not found');
  return serveFile(req, res, indexPath);
});

const port = Number.parseInt(process.env.PORT || '3000', 10);
server.listen(port, '0.0.0.0', () => {
  console.log(`Serving the Shadow Alert web app on port ${port}`);
});
