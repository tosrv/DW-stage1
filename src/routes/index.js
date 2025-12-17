import express from "express";
import hbs from "hbs";
import path from "path";
import flash from "connect-flash";
import session from "express-session";
import { upload } from "../config/multer.js";
import {
  project,
  addProject,
  detail,
  edit,
  update,
  del,
} from "../controllers/projectControl.js";
import {
  register,
  login,
  handleReg,
  handleLogin,
  logout,
  userData,
} from "../controllers/authControl.js";
import {
  home,
  settings,
  updateUser,
  delPage,
  delUser,
} from "../controllers/settingsControl.js";

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
app.get("/settings", settings);
app.get("/project", project);
app.get("/register", register);
app.get("/login", login);
app.get("/deleteuser", delPage);
app.get("/logout", logout);
app.get("/project/:id/edit", edit);
app.get("/detail/:id", detail);

app.post("/project", upload.single("image"), addProject);
app.post("/project/:id/up", upload.single("image"), update);
app.post("/settings", upload.single("image"), updateUser);
app.post("/deleteuser", upload.none(), delUser);
app.post("/project/:id/del", del);
app.post("/register", handleReg);
app.post("/login", handleLogin);

export default app;
