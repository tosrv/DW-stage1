import express from "express";
import { home, contact, project, detail, handleData } from "./controller.js"

const app = express();
const port = 3000;

// Handlebars
app.set("view engine", "hbs");
app.set("views", "src/views");

// Public Folder
app.use("/assets", express.static("src/assets"));
app.use("/partials", express.static("src/assets/partials"));

// Body Parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", home);
app.get("/contact", contact);
app.get("/project", project);
app.get("/detail/:id", detail);
app.post("/project", handleData);

// Run Server
app.listen(port, () => {
  console.log("Server running on port " + port);
});
