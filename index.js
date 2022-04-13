require("dotenv").config()
const express = require("express");
const app = require("./app");
const http = require("http");

const port = process.env.PORT || '8000';
app.set('port', port);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });
// const server = http.createServer(app);
// server.listen(port);

