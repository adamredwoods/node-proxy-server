var http = require('http'),
    httpProxy = require('http-proxy'),
	 fs = require('fs');

const PROXY_FILE = './proxyConfig.json';

var proxy = httpProxy.createProxyServer({});
const proxyList = JSON.parse(fs.readFileSync( PROXY_FILE, 'utf8'));

proxy.on('error', function(err, req, res) {
	res.writeHead(500, {
	 'Content-Type': 'text/plain'
	});
	res.end('Server Error. Proxy connection down. ');
});

var server = http.createServer(function(req, res) {

	if (proxyList[req.headers.host]) {
		proxy.web(req, res, { target: proxyList[req.headers.host].target } );
	} else {
		res.writeHead(404, {
		 'Content-Type': 'text/plain'
		});
		res.end('Host name not found. ');
	}

});

server.listen(80);
console.log("proxy listening...");
