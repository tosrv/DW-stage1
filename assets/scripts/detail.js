// Open Detail URL
const projectData = JSON.parse(localStorage.getItem("saveProject")) || [];
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Format Date
function dateForm(date) {
  const dateObj = new Date(date);

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
}

// Local Storage Content
const list = projectData.find((item) => item.id == id);

if (list) {
  renderDetail();
} else {
  show404();
}

// Render Content
function renderDetail() {
  const startDate = dateForm(list.start);
  const endDate = dateForm(list.end);

  document.getElementById("detailProject").innerHTML = `
  <h1 class="text-center m-3">${list.name}</h1>
      <section class="d-flex justify-content-center gap-5 mb-5">
        <div>
          <img src="${
            list.image
          }" class="rounded-4" style="width: 50rem; height: auto;">
        </div>
        <div class="d-flex align-items-center">

          <div>
            <h5>Date</h5>
            <h6 class="mb-5">${startDate} - ${endDate}</h6>
            <h5>Duration</h5>
            <h6 class="mb-5">${list.duration} Days</h6>

            <h5>Technologies</h5>
            <div class="d-flex gap-5">
                <div>
              <h6>${list.tech[0] || ""}</h6>
              <h6>${list.tech[1] || ""}</h6>
              </div>
              <div>
              <h6>${list.tech[2] || ""}</h6>
              <h6>${list.tech[3] || ""}</h6>
              </div>
          </div>
        </div>
    </section>

      <div class="container">
        <p class="m-3">${list.description}</p>
      </div>
`;
}

// Not Found
function show404() {
  document.getElementById("detailProject").innerHTML = `
  <h1 class="text-center" style="font-size: 20rem;">404</h1>
  <h2 class="text-center" style="font-size: 5rem;">Page Not Found</h2>
  `;
}