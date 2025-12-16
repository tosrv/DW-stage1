import express from "express";
import hbs from "hbs";
import path from "path";
import flash from "connect-flash";
import session from "express-session";
import {
  home,
  contact,
  project,
  addProject,
  detail,
  edit,
  update,
  del,
} from "../controllers/projectController.js";
import {
  register,
  login,
  handleReg,
  handleLogin,
  logout,
  userData,
} from "../controllers/authController.js";

const app = express();

// HANDLEBARS
app.set("view engine", "hbs");
app.set("views", "src/views");
hbs.registerPartials(path.join(process.cwd(), "src/views/partials"));
app.use("/assets", express.static("src/assets"));

// BODY PARSER
app.use(express.urlencoded({ extended: true }));

// SESSION
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// FLASH
app.use(flash());
app.use(userData);

// ROUTES
app.get("/", home);
app.get("/contact", contact);
app.get("/project", project);
app.get("/register", register);
app.get("/login", login);
app.get("/logout", logout);
app.get("/project/:id/edit", edit);
app.get("/detail/:id", detail);

app.post("/project", addProject);
app.post("/project/:id/del", del);
app.post("/project/:id/up", update);
app.post("/register", handleReg);
app.post("/login", handleLogin);

export default app;
