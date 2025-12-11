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

