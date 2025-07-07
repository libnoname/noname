var http = require("http");
var fs = require("fs");
var server = new http.Server();
server.listen(80);
server.on("request", function (request, response) {
	if (!request.url) {
		return;
	}

	var url = require("url").parse(request.url);
	switch (url.pathname) {
		case "":
		case "/":
			fs.readFile("./index.html", function (err, content) {
				if (err) {
					response.writeHead(404, {
						"Content-Type": 'text/plain; charset="UTF-8"',
					});
					response.write(err.message);
					response.end();
				} else {
					response.writeHead(200, {
						"Content-Type": "text/html; charset=UTF-8",
					});
					response.write(content);
					response.end();
				}
			});
			break;
		case "/test/delay":
			var delay = url.query ? parseInt(url.query) ?? 2000 : 2000;
			response.writeHead(200, {
				"Content-type": "text/plain; charset=UTF-8",
			});
			response.write("Sleeping for" + delay + " milliseconds...");
			setTimeout(function () {
				response.write("done.");
				response.end();
			}, delay);
			break;
		case "/test/mirror":
			response.writeHead(200, {
				"Content-type": "text/plain; charset=UTF-8",
			});
			response.write(
				// @ts-expect-error i don't know
				request.mothod +
					" " +
					request.url +
					" HTTP/" +
					request.httpVersion +
					"\r\n"
			);
			for (var h in request.headers) {
				response.write(h + ":" + request.headers[h] + "\r\n");
			}
			response.write("\r\n");
			request.on("data", function (chunk) {
				response.write(chunk);
			});
			request.on("end", function (chunk) {
				response.end();
			});
			break;
		case "/json":
			response.writeHead(200, {
				"Content-type": "application/json; charset=UTF-8",
			});
			response.write(JSON.stringify({ test: "success" }));
			response.end();
			break;
		default:
			var filename = url.pathname?.substring(1);
			if (!filename) {
				break;
			}

			var type = getType(
				filename.substring(filename.lastIndexOf(".") + 1)
			);
			fs.readFile(filename, function (err, content) {
				if (err) {
					response.writeHead(404, {
						"Content-Type": 'text/plain; charset="UTF-8"',
					});
					response.write(err.message);
					response.end();
				} else {
					response.writeHead(200, { "Content-Type": type });
					response.write(content);
					response.end();
				}
			});
			break;
	}
});
function getType(endTag) {
	var type = null;
	switch (endTag) {
		case "html":
		case "htm":
			type = "text/html; charset=UTF-8";
			break;
		case "js":
			type = 'application/javascript; charset="UTF-8"';
			break;
		case "css":
			type = 'text/css; charset="UTF-8"';
			break;
		case "txt":
			type = 'text/plain; charset="UTF-8"';
			break;
		case "manifest":
			type = 'text/cache-manifest; charset="UTF-8"';
			break;
		default:
			type = "application/octet-stream";
			break;
	}
	return type;
}
