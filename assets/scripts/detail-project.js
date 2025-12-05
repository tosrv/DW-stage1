const dataProject = JSON.parse(localStorage.getItem("saveProject")) || [];
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const project = dataProject.find((item) => item.id == id);

document.querySelector("#detailFoto").src = project.foto;
document.querySelector("#detailName").innerText = project.name;
document.querySelector("#detailStart").innerText = project.start;
document.querySelector("#detailEnd").innerText = project.end;
document.querySelector("#detailDesc").innerText = project.description;

function back() {
  window.location.href = "project.html";
}
