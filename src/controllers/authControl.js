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

  // FORMAT INPUT REGISTER
  if (!name || !email || !password) {
    req.flash("error", "All fields are required!");
    return res.redirect("/register");
  }

  if (name.length < 3) {
    req.flash("error", "Minimal username is 3 characters!");
    return res.redirect("/register");
  }

  if (password.length < 8) {
    req.flash("error", "Password at least 8 characters!");
    return res.redirect("/register");
  }

  try {
    // CHECK EMAIL ARE EXIST OR NOT
    const qMail = `SELECT email FROM public.user WHERE email = $1`;
    const registered = await db.query(qMail, [email]);

    if (registered.rowCount > 0) {
      req.flash("error", "Email already registered!");
      return res.redirect("/register");
    }

    // REGISTER AN ACCOUNT
    const qData = `INSERT INTO public.user(name, email, password)	VALUES ($1, $2, $3)`;
    const hashPass = await bcrypt.hash(password, 10);
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

  // FORMAT INPUT LOGIN
  if (!email || !password) {
    req.flash("error", "Email and password are required!");
    return res.redirect("/login");
  }

  try {
    // CHECKING EMAIL
    const qMail = `SELECT id, name, email, password FROM public.user WHERE email = $1`;
    const registered = await db.query(qMail, [email]);

    // IF DOESN'T EXIST IN DATABASE SEND ERROR
    if (registered.rowCount === 0) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/login");
    }

    // CHECKING PASSWORD
    const user = registered.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/login");
    }

    // SEND USER DATA
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
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

// LOG OUT SESSION
export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

// GLOBALIZE USER DATA
export const userData = (req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  next();
};
