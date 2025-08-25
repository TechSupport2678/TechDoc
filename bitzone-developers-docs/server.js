const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '0.0.0.0';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const BUILD_DIR = path.join(__dirname, 'build');

const AUTH_USER = process.env.AUTH_USER || 'admin';
const AUTH_PASS = process.env.AUTH_PASS || 'admin';
const SESSION_COOKIE = 'DOCS_SESSION';
const SESSION_VALUE = 'ok';

function parseCookies(header) {
  const map = {};
  if (!header) return map;
  header.split(';').forEach(p => {
    const idx = p.indexOf('=');
    if (idx > -1) {
      const k = p.slice(0, idx).trim();
      const v = p.slice(idx + 1).trim();
      map[k] = v;
    }
  });
  return map;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, headers));
  if (body) res.write(body);
  res.end();
}

function sendHtml(res, status, html) {
  send(res, status, html, { 'Content-Type': 'text/html; charset=utf-8' });
}

function redirect(res, location, extraHeaders = {}) {
  res.writeHead(302, Object.assign({ Location: location }, extraHeaders));
  res.end();
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers['cookie']);
  return cookies[SESSION_COOKIE] === SESSION_VALUE;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function serveLogin(req, res, errorMsg) {
  const err = errorMsg ? `<p style="color:#dc2626;margin:0 0 12px">${escapeHtml(errorMsg)}</p>` : '';
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Вход | Docs</title>
  <style>
    :root{color-scheme:dark light}
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;margin:0;display:grid;min-height:100svh;place-items:center;background:#0b1220;color:#e5e7eb}
    .card{width:min(92vw,380px);border:1px solid #23314f;border-radius:12px;padding:24px;background:#0e1628;box-shadow:0 8px 30px rgba(0,0,0,.25)}
    h2{margin:0 0 16px;font-size:20px}
    label{display:block;margin:10px 0 4px;color:#9fb1d3;font-size:14px}
    input{width:100%;padding:10px 12px;border:1px solid #23314f;border-radius:8px;background:#091121;color:#e5e7eb}
    input:focus{outline:2px solid #335a9c;outline-offset:1px}
    button{margin-top:14px;width:100%;padding:10px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer}
    button:hover{background:#1d4ed8}
    .muted{margin-top:10px;color:#9fb1d3;font-size:12px}
  </style>
 </head>
 <body>
  <form class="card" method="post" action="/login">
    <h2>Авторизация</h2>
    ${err}
    <label for="username">Логин</label>
    <input id="username" name="username" required autofocus/>
    <label for="password">Пароль</label>
    <input id="password" type="password" name="password" required/>
    <button type="submit">Войти</button>
    <div class="muted">По умолчанию: admin / admin</div>
  </form>
 </body>
</html>`;
  sendHtml(res, 200, html);
}

function parseForm(req, cb) {
  let data = '';
  req.on('data', chunk => { data += chunk; if (data.length > 1e6) req.connection.destroy(); });
  req.on('end', () => {
    const map = {};
    data.split('&').forEach(p => {
      const idx = p.indexOf('=');
      if (idx > -1) {
        const k = decodeURIComponent(p.slice(0, idx).replace(/\+/g, ' '));
        const v = decodeURIComponent(p.slice(idx + 1).replace(/\+/g, ' '));
        map[k] = v;
      }
    });
    cb(map);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.ico': return 'image/x-icon';
    case '.json': return 'application/json; charset=utf-8';
    case '.map': return 'application/json; charset=utf-8';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.woff2': return 'font/woff2';
    default: return 'application/octet-stream';
  }
}

function serveStatic(req, res, urlPath) {
  let rel = decodeURI(urlPath.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  const filePath = path.normalize(path.join(BUILD_DIR, rel));
  if (!filePath.startsWith(BUILD_DIR)) {
    return send(res, 403, 'Forbidden');
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      // SPA fallback
      const fallback = path.join(BUILD_DIR, 'index.html');
      fs.readFile(fallback, (e2, buf) => {
        if (e2) return send(res, 404, 'Not Found');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(buf);
      });
      return;
    }
    fs.readFile(filePath, (e, buf) => {
      if (e) return send(res, 500, 'Error');
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(buf);
    });
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/login') {
    if (req.method === 'GET') return serveLogin(req, res);
    if (req.method === 'POST') {
      return parseForm(req, form => {
        const user = form.username || '';
        const pass = form.password || '';
        if (user === AUTH_USER && pass === AUTH_PASS) {
          const cookie = `${SESSION_COOKIE}=${SESSION_VALUE}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`;
          return redirect(res, '/', { 'Set-Cookie': cookie });
        }
        serveLogin(req, res, 'Неверный логин или пароль');
      });
    }
    return send(res, 405, 'Method Not Allowed');
  }

  if (url.pathname === '/logout') {
    return redirect(res, '/login', { 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0` });
  }

  if (!isAuthenticated(req)) {
    return redirect(res, '/login');
  }

  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`Docs auth server running at http://${HOST}:${PORT}`);
});

