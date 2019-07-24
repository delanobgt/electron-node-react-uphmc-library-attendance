require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const morgan = require("morgan");
const express = require("express");
const app = express();
const server = require("http").Server(app);

// App Setup
app.use(
  morgan("combined", {
    skip: function(req, res) {
      return res.statusCode < 400;
    }
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes Setup
app.use((req, res, next) => {
  req.locals = {
    originUrl: req.get("origin"),
    hostUrl: `https://${req.get("host")}`
  };
  next();
});
app.use("/api/users", require("./routes/user"));
app.use("/api/attendances", require("./routes/attendance"));
app.use("/api/students", require("./routes/student"));

app.all("*", (req, res) => {
  res.send("404 not found");
});

// Server Setup
const PORT = process.env.SERVER_PORT || 3010;
server.listen(PORT, () => {
  console.log("\n\n\n");
  console.log(`Server listening on port ${PORT}.`);
  console.log("\n\n\n");
});
