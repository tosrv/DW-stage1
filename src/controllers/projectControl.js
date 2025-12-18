import { fDate, disDate, dur } from "../assets/js/helper.js";
import db from "../config/database.js";

// DISPLAY PROJECT
export async function project(req, res) {
  // RENDER PROJECT CARD
  let data = [];
  if (req.session.user) {
    // FOR LOGIN SESSION THAT WILL ABLE TO ADD, EDIT, DELETE
    data = await db.query(
      `SELECT p.id, p.user_id, p.name, p.description, p.image, u.name AS author FROM project p
       LEFT JOIN public.user u ON p.user_id = u.id WHERE user_id = $1`,
      [req.session.user.id]
    );
  } else {
    // FOR GUEST SESSION TO DISPLAY ALL PROJECT
    data = await db.query(
      `SELECT p.id, p.user_id, p.name, p.description, p.image, u.name AS author FROM project p
       LEFT JOIN public.user u ON p.user_id = u.id`
    );
  }

  const card = data.rows;

  res.render("pages/project", {
    layout: "layouts/main",
    title: "My Project",
    subtitle: "ADD",
    action: "/project",
    hide: true,
    btn: "Submit",
    card: card,
  });
}

// ADD PROJECT
export async function addProject(req, res) {
  const userID = req.session.user.id;
  const { name, start, end, desc, tech } = req.body;
  let image = "frontend.png";
  if (req.file) {
    image = req.file.filename;
  }

  try {
    // INSERT DATA INPUT
    const qData = `INSERT INTO project
      (user_id, name, start, "end", description, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`;
    const data = await db.query(qData, [userID, name, start, end, desc, image]);

    // FOR CHECKBOX DATA
    const projectID = data.rows[0].id;
    if (tech) {
      const techs = Array.isArray(tech) ? tech : [tech];
      const values = techs.map((_, i) => `($1, $${i + 2})`).join(",");

      await db.query(
        `INSERT INTO project_tech (project_id, tech_id)
          VALUES ${values}`,
        [projectID, ...techs]
      );
    }

    res.redirect("/project");
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

// DETAIL PAGE
export async function detail(req, res) {
  const { id } = req.params;
  try {
    // DISPLAY PROJECT DATA
    const qData = `SELECT name, start, "end", description, image FROM project WHERE id = $1`;
    const qTech = `SELECT tech_id FROM project_tech WHERE project_id = $1`;

    const dataDetail = await db.query(qData, [id]);
    const { rows: dataTech } = await db.query(qTech, [id]);

    if (dataDetail.rowCount === 0) {
      return res.status(404).render("pages/error", {
        layout: "layouts/main",
        title: "Error",
        status: "404",
        message: "Project Not Found",
      });
    }

    const data = dataDetail.rows[0];
    const tech = dataTech.map((t) => t.tech_id);

    const result = {
      ...data,
      start: disDate(data.start),
      end: disDate(data.end),
      duration: dur(data.start, data.end),
    };

    res.render("pages/detail", {
      layout: "layouts/main",
      title: "Detail",
      display: result,
      tech: {
        node: tech.includes(1),
        react: tech.includes(2),
        next: tech.includes(3),
        typescript: tech.includes(4),
      },
    });
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

// EDIT PROJECT
export async function edit(req, res) {
  const { id } = req.params;
  try {
    // RENDER CARD
    let data = [];
    if (req.session.user) {
      // FOR LOGIN SESSION THAT WILL ABLE TO ADD, EDIT, DELETE
      data = await db.query(
        `SELECT p.id, p.user_id, p.name, p.description, p.image, u.name AS author FROM project p
       LEFT JOIN public.user u ON p.user_id = u.id WHERE user_id = $1`,
        [req.session.user.id]
      );
    } else {
      // FOR GUEST SESSION TO DISPLAY ALL PROJECT
      data = await db.query(
        `SELECT p.id, p.user_id, p.name, p.description, p.image, u.name AS author FROM project p
       LEFT JOIN public.user u ON p.user_id = u.id`
      );
    }

    const card = data.rows;

    const qTech = `SELECT tech_id FROM project_tech WHERE project_id = $1`; // GET CHECKBOX DATA
    const qEdit = `SELECT id, name, start, "end", description, image FROM project WHERE id = $1`; // GET INPUT DATA

    const { rows: dataTech } = await db.query(qTech, [id]);
    const dataEdit = await db.query(qEdit, [id]);

    const tech = dataTech.map((t) => t.tech_id);
    const edit = dataEdit.rows[0];

    // IF DATA DOESN'T EXIST SEND ERROR
    if (!edit)
      return res.status(404).render("pages/error", {
        layout: "layouts/main",
        title: "Error",
        status: "404",
        message: "Project Not Found",
      });

    // FORMATING DATE FOR INPUT DISPLAY
    edit.start = fDate(edit.start);
    edit.end = fDate(edit.end);

    res.render("pages/project", {
      layout: "layouts/main",
      title: "Edit",
      subtitle: "EDIT",
      action: `/project/${id}/up`,
      edit: edit,
      tech: {
        node: tech.includes(1),
        react: tech.includes(2),
        next: tech.includes(3),
        typescript: tech.includes(4),
      },
      btn: "Update",
      card: card,
    });
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

// UPDATE PROJECT
export async function update(req, res) {
  const { name, start, end, desc, tech } = req.body;
  const { id } = req.params;
  let image = "frontend.png";
  if (req.file) {
    image = req.file.filename;
  }
  try {
    await db.query("BEGIN");

    // SEND UPDATED DATA
    const qData = `UPDATE project
      SET name=$1, start=$2, "end"=$3, description=$4, image=$5
      WHERE id = $6`;
    await db.query(qData, [name, start, end, desc, image, id]);

    // REASSIGN CHECKBOX
    const qTech = `DELETE FROM project_tech WHERE project_id = $1`;
    await db.query(qTech, [id]);

    if (tech) {
      const techs = Array.isArray(tech) ? tech : [tech];
      const values = techs.map((_, i) => `($1, $${i + 2})`).join(",");

      await db.query(
        `INSERT INTO project_tech (project_id, tech_id)
          VALUES ${values}`,
        [id, ...techs]
      );
    }

    await db.query("COMMIT");
    res.redirect("/project");
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

// DELETE PROJECT
export async function del(req, res) {
  const { id } = req.params;

  try {
    await db.query("BEGIN");
    const qTech = `DELETE FROM project_tech WHERE project_id = $1`; // DELETE SELECTED DATA CHECKBOX
    const qData = `DELETE FROM project WHERE id = $1`; // DELETE SELECTED DATA

    await db.query(qTech, [id]);
    await db.query(qData, [id]);

    await db.query("COMMIT");
    res.redirect("/project");
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
