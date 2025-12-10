import express from "express";
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");
app.use("/assets", express.static("src/assets"));

app.get("/home", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(port, () => {
  console.log(`Server running, Homepage here http://localhost:${port}/home`);
});
