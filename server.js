const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer(function (request, response) {
	console.log("request starting...");

	let filePath = "." + request.url;
	if (filePath == "./") filePath = "./index.html";

	const extname = path.extname(filePath);
	let contentType = "text/html";
	switch (extname) {
		case ".css":
			contentType = "text/css";
			break;
		case ".doc":
			contentType = "application/msword";
			break;
		case ".docx":
			contentType =
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
			break;
		case ".ico":
			contentType = "image/x-icon";
			break;
		case ".jpg":
			contentType = "image/jpeg";
			break;
		case ".js":
			contentType = "text/javascript";
			break;
		case ".json":
			contentType = "application/json";
			break;
		case ".mp3":
			contentType = "audio/mpeg";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".svg":
			contentType = "image/svg+xml";
			break;
		case ".pdf":
			contentType = "application/pdf";
			break;
		case ".wav":
			contentType = "audio/wav";
			break;
	}

	fs.readFile(filePath, function (error, content) {
		if (error) {
			if (error.code == "ENOENT") {
				fs.readFile("./404.html", function (error, content) {
					response.writeHead(200, { "Content-Type": contentType });
					response.end(content, "utf-8");
				});
			} else {
				response.writeHead(500);
				response.end(
					"Sorry, check with the site admin for error: " +
						error.code +
						" ...\n"
				);
				response.end();
			}
		} else {
			response.writeHead(200, { "Content-Type": contentType });
			response.end(content, "utf-8");
			console.log(`request completed to: ${filePath}`);
		}
	});
}).listen(5500);
console.log("Server running at http://127.0.0.1:5500/");
