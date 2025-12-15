import express from "express";
import hbs from "hbs";
import path from "path";
import { Pool } from "pg";

// DATABASE
const db = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "postgres",
  max: 20,
});

const app = express();

// HANDLEBARS
app.set("view engine", "hbs");
app.set("views", "src/views");
hbs.registerPartials(path.join(process.cwd(), "src/views/partials"));
app.use("/assets", express.static("src/assets"));

// BODY PARSER
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get("/", home);
app.get("/contact", contact);
app.get("/project", project);
app.get("/project/:id/edit", edit);
app.get("/detail/:id", detail);

app.post("/project", addProject);
app.post("/project/:id/del", del);
app.post("/project/:id/up", update);

// CONTROLLERS
function home(req, res) {
  res.render("pages/home", {
    layout: "layouts/main",
    title: "Home",
    activePage: "home",
  });
}

function contact(req, res) {
  res.render("pages/contact", {
    layout: "layouts/main",
    title: "Contact",
  });
}

async function project(req, res) {
  const { rows: card } = await db.query(`SELECT * FROM project`);

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
async function addProject(req, res) {
  const { name, start, end, desc, tech } = req.body;
  try {
    const qData = `INSERT INTO project
      (name, start, "end", description)
      VALUES ($1, $2, $3, $4)
      RETURNING id`;
    const data = await db.query(qData, [name, start, end, desc]);

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

// EDIT PROJECT
async function edit(req, res) {
  const { id } = req.params;
  try {
    const qCard = `SELECT * FROM project`;
    const qTech = `SELECT * FROM project_tech WHERE project_id = $1`;
    const qEdit = `SELECT * FROM project WHERE id = $1`;

    const { rows: card } = await db.query(qCard);
    const { rows: dataTech } = await db.query(qTech, [id]);
    const dataEdit = await db.query(qEdit, [id]);

    const tech = dataTech.map((t) => t.tech_id);
    const edit = dataEdit.rows[0];

    if (!edit)
      return res.status(404).render("pages/error", {
        layout: "layouts/main",
        title: "Error",
        status: "404",
        message: "Project Not Found",
      });

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
async function update(req, res) {
  const { name, start, end, desc, tech } = req.body;
  const { id } = req.params;
  try {
    await db.query("BEGIN");

    const qData = `UPDATE project
      SET name=$1, start=$2, "end"=$3, description=$4
      WHERE id = $5`;
    await db.query(qData, [name, start, end, desc, id]);

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
async function del(req, res) {
  const { id } = req.params;

  try {
    const qData = `DELETE FROM project WHERE id = $1`;
    const qTech = `DELETE FROM project_tech WHERE project_id = $1`;

    await db.query(qData, [id]);
    await db.query(qTech, [id]);

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
async function detail(req, res) {
  const { id } = req.params;
  try {
    const qData = `SELECT * FROM project WHERE id = $1`;
    const qTech = `SELECT * FROM project_tech WHERE project_id = $1`;

    const dataDetail = await db.query(qData, [id]);
    const { rows: dataTech } = await db.query(qTech, [id]);
    const data = dataDetail.rows[0];
    const tech = dataTech.map((t) => t.tech_id);

    console.log(tech);

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

// HELPER FUNCTION

// DISPLAY DATE FOR EDIT
export const fDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// DISPLAY DATE FOR DETAIL
export const disDate = (val) => {
  const date = new Date(val);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// DURATION FUNCTION
export const dur = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e - s;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

hbs.registerHelper("activePage", function (page) {
  return page === this.activePage ? "active" : "";
});

export default app;
