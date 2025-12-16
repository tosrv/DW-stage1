import bcrypt from "bcrypt";
import db from "../config/database.js";

export function login(req, res) {
  res.render("pages/login", {
    layout: "layouts/main",
    title: "Login",
    subtitle: "Login",
    action: "/login",
    login: true,
    btn: "Login",
  });
}

export function register(req, res) {
  res.render("pages/login", {
    layout: "layouts/main",
    title: "Register",
    subtitle: "Register",
    action: "/register",
    btn: "Register",
  });
}

export async function handleReg(req, res) {
  const { name, email, password } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 10);
    const qData = `INSERT INTO public."user"(name, email, password)	VALUES ($1, $2, $3)`;
    const qMail = `SELECT * FROM public.user WHERE email = $1`;

    const Registered = await db.query(qMail, [email]);
    if (Registered.rowCount > 0) {
      req.flash("error", "Email already registered!");
      return res.redirect("/register");
    }

    await db.query(qData, [name, email, hashPass]);
    req.flash("message", "Registered successfully. Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).render("pages/error", {
      layout: "layouts/main",
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  }
}

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  try {
    const qMail = `SELECT * FROM public.user WHERE email = $1`;
    const Registered = await db.query(qMail, [email]);
    if (!Registered.rows[0]) {
      req.flash("error", "Incorrect email or password.")
      res.redirect("/login")
    }

    const match = await bcrypt.compare(password, Registered.rows[0].password);
    if (!match) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/login");
    }

    req.session.user = {
      name: Registered.rows[0].name,
    };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("pages/error", {
      layout: "layouts/main",
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  }
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).render("pages/error", {
        layout: "layouts/main",
        title: "Error",
        status: "500",
        message: "Internal Server Error",
      });
    }
    res.redirect("/login");
  });
}

export const userData = (req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  next();
};
