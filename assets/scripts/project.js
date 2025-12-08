// Local Storage Data
const projectData = JSON.parse(localStorage.getItem("saveProject")) || [];

function submitData() {
  localStorage.setItem("saveProject", JSON.stringify(projectData));
}

// Generate ID
function generateId(data) {
  if (data.length === 0) return 1;
  return Math.max(...data.map((item) => item.id)) + 1;
}

// Date Function
const startDateInput = document.getElementById("projectStart");
const endDateInput = document.getElementById("projectEnd");

startDateInput.addEventListener("change", function () {
  const startDateValue = this.value;

  endDateInput.min = startDateValue;

  if (endDateInput.value < startDateValue) {
    endDateInput.value = startDateValue;
  }
});

const editStart = document.getElementById("editStart");
const editEnd = document.getElementById("editEnd");

editStart.addEventListener("change", function () {
  const editStartValue = this.value;

  editEnd.min = editStartValue;

  if (editEnd.value < editStartValue) {
    editEnd.value = editStartValue;
  }
});

// Duration Function
function getDuration(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const durationMiliseconds = endDate - startDate;
  const days = Math.floor(durationMiliseconds / (1000 * 60 * 60 * 24));
  return `${days}`;
}

// Base64 Encoded Image
let currentImage = "";
const foto = document.getElementById("projectImage");

foto.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      currentImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Save Object to Array
const inputForm = document.getElementById("inputForm");

inputForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const duration = getDuration(startDateInput.value, endDateInput.value);

  // Checkbox Input
  const tech = Array.from(
    document.querySelectorAll(".form-check-input:checked")
  ).map((cb) => cb.value);

  const projectObj = {
    id: generateId(projectData),
    name: document.getElementById("projectName").value,
    start: startDateInput.value,
    end: endDateInput.value,
    duration: duration,
    description: document.getElementById("projectDesc").value,
    tech: tech,
    image: currentImage,
  };

  projectData.push(projectObj);
  submitData();
  inputForm.reset();
  renderProject();
  alert("Berhasil menambahkan data!");
});

// Create Card
const myProject = document.getElementById("projectArea");
const template = document.getElementById("projectTemplate");

function renderProject() {
  myProject.innerHTML = "";

  projectData.forEach((list) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".cardImage").src = list.image;
    clone.querySelector(".cardName").textContent = list.name;
    clone.querySelectorAll(".urlId").forEach((el) => {
      el.onclick = () => detail(list.id);
    });
    clone.querySelector(
      ".cardDuration"
    ).textContent = `Duration: ${list.duration} days`;
    clone.querySelector(".cardDesc").textContent = list.description;

    // Edit Button
    clone.querySelector(".editBtn").onclick = () => editProject(list.id);

    // Delete Button
    const modal = clone.querySelector(".confModal");
    const confBtn = clone.querySelector(".confBtn");
    const deleteBtn = clone.querySelector(".deleteBtn");

    clone.querySelector(
      ".confirmationMsg"
    ).innerHTML = `Are you sure want to delete <strong>${list.name}</strong>?`;
    modalId = `confModal-${list.id}`;
    modal.id = modalId;
    confBtn.setAttribute("data-bs-target", `#${modalId}`);
    deleteBtn.onclick = () => deleteCard(list.id);

    myProject.appendChild(clone);
  });
}

// Delete Card
function deleteCard(id) {
  const updateData = projectData.filter((item) => item.id != id);
  localStorage.setItem("saveProject", JSON.stringify(updateData));
  projectData.length = 0;
  projectData.push(...updateData);
  renderProject();
}

// Detail Page
function detail(url) {
  window.location.href = `detail-project.html?id=${url}`;
}

function addProject() {
  document.getElementById("inputProject").classList.remove("d-none");
  document.getElementById("editProject").classList.add("d-none");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Edit Form
function editProject(id) {
  document.getElementById("inputProject").classList.add("d-none");
  document.getElementById("editProject").classList.remove("d-none");
  window.scrollTo({ top: 0, behavior: "smooth" });

  const editData = projectData.find((item) => item.id === id);

  document.getElementById("editName").value = editData.name;
  document.getElementById("editStart").value = editData.start;
  document.getElementById("editEnd").value = editData.end;
  document.getElementById("editDesc").value = editData.description;
  document.querySelectorAll(".editCheck").forEach((cb) => {
    cb.checked = editData.tech.includes(cb.value);
  });

  editForm.dataset.editId = id;
}

const editForm = document.getElementById("editForm");

editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const id = Number(editForm.dataset.editId);

  const index = projectData.findIndex((item) => item.id === id);

  const newName = document.getElementById("editName").value;
  const newStart = document.getElementById("editStart").value;
  const newEnd = document.getElementById("editEnd").value;
  const newDuration = getDuration(newStart, newEnd);
  const newDesc = document.getElementById("editDesc").value;

  const newTech = Array.from(document.querySelectorAll(".editCheck"))
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  projectData[index] = {
    ...projectData[index],
    name: newName,
    start: newStart,
    end: newEnd,
    duration: newDuration,
    description: newDesc,
    tech: newTech,
  };

  submitData();
  editForm.reset();
  renderProject();
  alert("Berhasil mengubah data!");
  addProject();
});

renderProject();
