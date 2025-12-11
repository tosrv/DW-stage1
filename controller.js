import { genID, getDuration } from "./util.js";

// Database
let projectDatabase = [
  {
    id: 1,
    name: "Back End",
    start: "2025-12-01",
    end: "2025-12-15",
    duration: "14",
    tech: ["Node JS", "Next JS", "TypeScript"],
    description:
      'Backend adalah bagian "di balik layar" aplikasi atau situs web yang bertanggung jawab untuk logika, pengolahan data, penyimpanan, keamanan, dan komunikasi dengan server atau database, memastikan semua fungsi berjalan lancar meskipun tidak terlihat langsung oleh pengguna, seperti otak yang menggerakkan aplikasi. Fungsinya meliputi penyimpanan data, pemrosesan permintaan dari frontend, autentikasi pengguna, dan menjalankan logika bisnis aplikasi menggunakan bahasa pemrograman seperti Python, Java, atau Node.js.',
  },
  {
    id: 2,
    name: "Front End",
    start: "2025-12-16",
    end: "2025-12-31",
    duration: "15",
    tech: ["React JS", "TypeScript"],
    description:
      'Frontend adalah bagian dari situs web atau aplikasi yang dilihat dan diinteraksikan langsung oleh pengguna (user interface), mencakup semua elemen visual seperti tata letak, desain, tombol, dan teks, yang dibangun menggunakan teknologi seperti HTML, CSS, dan JavaScript untuk menciptakan pengalaman pengguna yang menarik, mudah digunakan, dan responsif di berbagai perangkat. Sederhananya, frontend adalah "wajah" dari sebuah produk digital, sedangkan backend adalah "dapur" di baliknya.',
  },
  {
    id: 3,
    name: "Full Stack",
    start: "2025-12-01",
    end: "2025-12-31",
    duration: "30",
    tech: ["Node JS", "React JS", "Next JS", "TypeScript"],
    description:
      'Fullstack adalah kemampuan untuk bekerja pada semua lapisan pengembangan aplikasi atau situs web, mulai dari antarmuka pengguna (frontend) hingga logika server dan basis data (backend). Seorang pengembang fullstack dapat mengerjakan proyek secara menyeluruh, mulai dari tampilan depan hingga "dapur" di belakang layar, dan memastikan semua komponen terintegrasi dengan baik.',
  },
];

// Function Area
export function home(req, res) {
  res.render("index");
}

export function contact(req, res) {
  res.render("contact");
}

export function project(req, res) {
  let projectData = projectDatabase;
  res.render("project", { projectData });
}

export function detail(req, res) {
  let { id } = req.params;
  let result = projectDatabase.find((el) => el.id == id);

  res.render("detail", { result: result || null });
}

export function handleData(req, res) {
  let { name, start, end, tech, description } = req.body;

  let inputData = {
    id: genID(projectDatabase),
    name,
    start,
    end,
    duration: getDuration(start, end),
    tech,
    description,
  };

  projectDatabase.push(inputData);
  res.redirect("/project");
}