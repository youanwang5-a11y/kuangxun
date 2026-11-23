import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));
const staticRoot = resolve(publicDirectory);
const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
};

export function createSiteServer() {
  return createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end();
      return;
    }

    const filePath = resolve(staticRoot, `.${pathname === '/' ? '/index.html' : pathname}`);
    const contentType = contentTypes[extname(filePath).toLowerCase()];
    if (!filePath.startsWith(staticRoot + sep) || !contentType) {
      response.writeHead(404).end();
      return;
    }

    try {
      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': body.length,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
        'Content-Security-Policy': "default-src 'self'; img-src 'self' blob:; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'",
      }).end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      const status = ['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code) ? 404 : 500;
      response.writeHead(status).end();
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createSiteServer().listen(4173, '127.0.0.1', () => {
    console.log('矿寻 · http://127.0.0.1:4173');
  });
}
