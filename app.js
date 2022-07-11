var express = require("express");
const { engine } = require("express-handlebars");

var app = express();

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: "main" })
);

app.set("view engine", "handlebars");

app.use('/', express.static('public'));

app.get("/", function (req, res) {
  res.render("home", { sky: "#ECECEC" });
});

app.listen(3000);
