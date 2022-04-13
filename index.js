require("dotenv").config()

if (process.env.NODE_ENV == "prod") {
  const app = require("./app");
  const http = require("http");
  const https = require("https");
  const fs = require("fs");
  const port = process.env.PORT || '8000';
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/dilutionscout.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/dilutionscout.com/fullchain.pem")
  };
  console.log(port)
  // app.set('port', port);
  //app.listen(port)
  // app.listen(port, () => {
    //    console.log(`Listening to requests on http://localhost:${port}`);
    //  });
  https.createServer(options, app).listen(8080, "localhost");
  http.createServer(app).listen(port, "localhost");
}
else {
  const app = require("./app");
  const http = require("http");
  const { env } = require("process");

  const port = process.env.PORT || '8000';
  app.set('port', port);

  app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  // const server = http.createServer(app);
  // server.listen(port);
  }
