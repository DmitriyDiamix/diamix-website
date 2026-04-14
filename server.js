const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp'};
const port = process.env.PORT || 3002;
http.createServer((req, res) => {
  let fp = path.join(dir, req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]);
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[path.extname(fp)] || 'text/plain', 'Cache-Control': 'no-cache'});
    res.end(d);
  });
}).listen(port, () => console.log('Server on port ' + port));
