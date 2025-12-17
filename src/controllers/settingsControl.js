import bcrypt from "bcrypt";
import db from "../config/database.js";

export async function home(req, res) {
  const qData = `SELECT role, greeting, intro, image FROM public.user WHERE id = $1`;
  let data = [];
  if (req.session.user) {
    const database = await db.query(qData, [req.session.user.id]);
    data = database.rows[0] || [];
  }

  res.render("pages/home", {
    layout: "layouts/main",
    title: "Home",
    data: data,
  });
}

export function settings(req, res) {
  res.render("pages/settings", {
    layout: "layouts/main",
    title: "Settings",
    subtitle: "SETTINGS",
    action: "/settings",
    display: true,
    btn: "Submit",
  });
}

export function delPage(req, res) {
  res.render("pages/settings", {
    layout: "layouts/main",
    title: "Delete",
    subtitle: "DELETE",
    action: "/deleteuser",
    confirm: true,
    btn: "Delete User",
  });
}

// UPDATE USER
export async function updateUser(req, res) {
  const { name, email, role, greet, intro } = req.body;
  const userID = req.session.user.id;
  let image = "profile.jpg";
  if (req.file) {
    image = req.file.filename;
  }
  try {
    // SEND UPDATED DATA
    const qData = `UPDATE public.user
      SET name=$1, email=$2, role=$3, greeting=$4, intro=$5, image=$6
      WHERE id = $7`;
    await db.query(qData, [name, email, role, greet, intro, image, userID]);

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

// DELETE USER
export async function delUser(req, res) {
  const { email, password } = req.body;
  const userID = req.session.user.id;

  // CHECK ACCOUNT
  if (!email || !password) {
    req.flash("error", "Email and password are required!");
    return res.redirect("/deleteuser");
  }

  try {
    // CHECK EMAIL
    const qMail = `SELECT id, email, password FROM public.user WHERE email = $1`;
    const registered = await db.query(qMail, [email]);

    // IF DOESN'T EXIST IN DATABASE SEND ERROR
    if (registered.rowCount === 0) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/deleteuser");
    }

    const user = registered.rows[0];

    // ENSURE DELETE OWN ACCOUNT
    if (user.id !== userID) {
      req.flash("error", "Unauthorized action.");
      return res.redirect("/deleteuser");
    }

    // CHECK PASSWORD
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/deleteuser");
    }

    // DELETE USER ACCOUNT AND DATA
    await db.query("BEGIN");
    await db.query(
      `DELETE FROM project_tech WHERE project_id IN (SELECT id FROM project WHERE user_id = $1)`,
      [user.id]
    );
    await db.query(`DELETE FROM project WHERE user_id = $1`, [user.id]);
    await db.query(`DELETE FROM public.user WHERE id = $1`, [user.id]);
    await db.query("COMMIT");

    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).render("pages/error", {
      layout: "layouts/main",
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });
  }
}
