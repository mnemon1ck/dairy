let fs = require('fs');
let http = require('http');

let server = http.createServer((req, res) => {
  if (req.url == '/') return fs.createReadStream('./index.html').pipe(res);
  if (req.url == '/bundle.js') return fs.createReadStream('./bundle.js').pipe(res);

  return res.end('ERROR');
});

server.listen(1212, () => console.log('listening'));