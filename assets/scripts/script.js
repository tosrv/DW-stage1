function home() {
  window.location.href = "index.html";
}

function project() {
  window.location.href = "project.html";
}

function contact() {
  window.location.href = "contact.html";
}

function ig() {
  window.location.assign("https://www.instagram.com/rahmat_tomy");
}

function yt() {
  window.location.assign("https://www.youtube.com/@ra-tom");
}

function github() {
  window.location.assign("https://github.com/tosrv");
}

let addProject = document.querySelector("#addProject");

addProject.addEventListener("submit", function (e) {
  e.preventDefault();

  let projectName = document.querySelector("#projectName").value;
  let startDate = document.querySelector("#startDate").value;
  let endDate = document.querySelector("#endDate").value;
  let description = document.querySelector("#description").value;
  let projectPhoto = document.querySelector("#projectPhoto").value;

  console.log(
    `name: ${projectName}, dimulai: ${startDate}, selesai: ${endDate}, desc: ${description}, file: ${projectPhoto}`
  );
});
