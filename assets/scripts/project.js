const foto = document.querySelector("#projectPhoto");
const addProject = document.querySelector("#addProject");
const myProject = document.querySelector("#myProject");
const dataProject = JSON.parse(localStorage.getItem("saveProject")) || [];

let currentImage = "";
foto.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      currentImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

function submitData() {
  localStorage.setItem("saveProject", JSON.stringify(dataProject));
}

addProject.addEventListener("submit", function (e) {
  e.preventDefault();

  const inputData = {
    id: dataProject.length + 1,
    name: document.querySelector("#projectName").value,
    start: document.querySelector("#startDate").value,
    end: document.querySelector("#endDate").value,
    description: document.querySelector("#description").value,
    foto: currentImage,
  };

  dataProject.push(inputData);
  submitData();

  addProject.reset();
  renderProject();
});

function renderProject() {
  myProject.innerHTML = "";

  for (let i = 0; i < dataProject.length; i++) {
    const list = dataProject[i];

    myProject.innerHTML += `
            <div class="col">
              <div class="card overflow-y-scroll shadow" style="height: 20rem;">
                <img src="${list.foto}" class="card-img-top overflow-hidden" style="height: 10rem; width: auto;" />
                <div class="card-body d-flex flex-column justify-content-end">
                  <h5 class="card-title">${list.name}</h5>
                  <h6 class="card-text" style="font-size: 12px">${list.start} - ${list.end}</h6>
                  <p class="card-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${list.description}
                  </p>
                  <div class="d-flex justify-content-center gap-3">
                    <a class="btn btn-dark text-light" href="detail-project.html?id=${list.id}">detail</a>
                    <button class="btn btn-dark text-light">delete</button>
                  </div>
                </div>
              </div>
            </div>
        `;
  }
}

renderProject();
