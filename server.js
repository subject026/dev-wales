const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const helpers = require("./lib/templateHelpers");

/* Setup templating */

var hbs = exphbs.create({
  defaultLayout: "main",
  helpers
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

/* Routing */

const appRouter = require("./routes/index");

app.use("/", appRouter);
app.use("/static", express.static("public"));

/* Start server */

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
