// DATE FUNCTION
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

startDate.addEventListener("change", function () {
  const val = this.value;
  endDate.min = val;
  if (endDate.value < val) endDate.value = val;
});
