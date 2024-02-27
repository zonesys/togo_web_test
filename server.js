const express = require("express");
const path = require("path");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

// Create a writable stream to the log file
const logFilePath = path.join(__dirname, "server.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" }); // 'a' stands for append mode

// Override the default console.log method to write logs to the log file
console.log = function (message) {
  logStream.write(`${new Date().toISOString()}: ${message}\n`);
  process.stdout.write(`${new Date().toISOString()}: ${message}\n`); // Optionally, display the logs in the terminal
};

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/togo.ps/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/togo.ps/fullchain.pem')
};

// Array of allowed IP addresses for the admin pages
const allowedAdminIPs = ['46.253.95.33']; // Add your allowed IP addresses here

console.log("allowedAdminIPs: " + allowedAdminIPs);

// IP filtering middleware directly in the chain
app.use('/adminapp/signin', (req, res, next) => {
  const clientIP = req.ip;

  console.log("clientIP: " + clientIP);

  if (allowedAdminIPs.includes(clientIP)) {
    next();
  } else {
    res.redirect('/account/signin');
  }
});

// Serve the static React app build files
app.use(express.static(path.join(__dirname, "build")));

app.post("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(8080);
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(8443);
