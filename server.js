const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);
const layoutFile = path.join(dir, 'layout.json');
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp'};
const port = process.env.PORT || 3002;

http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // GET /api/load-layout
  if (req.method === 'GET' && url === '/api/load-layout') {
    fs.readFile(layoutFile, 'utf8', (e, d) => {
      if (e) { res.writeHead(204); res.end(); return; }
      res.writeHead(200, {'Content-Type':'application/json','Cache-Control':'no-cache'});
      res.end(d);
    });
    return;
  }

  // POST /api/save-layout
  if (req.method === 'POST' && url === '/api/save-layout') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      fs.writeFile(layoutFile, body, err => {
        res.writeHead(err ? 500 : 200);
        res.end(err ? 'error' : 'ok');
      });
    });
    return;
  }

  // Static files
  let fp = path.join(dir, url === '/' ? '/index.html' : url);
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[path.extname(fp)] || 'text/plain', 'Cache-Control': 'no-cache'});
    res.end(d);
  });
}).listen(port, () => console.log('Server on port ' + port));
