const accountToggler = document.querySelector(".userAccountToggler");
const userDropDown = document.querySelector("#user-dropdown");
const reloadBtns = document.querySelectorAll(".reloadBtn");
const register = document.querySelector("#register");
const toggleUserDropDown = () => {
  userDropDown.classList.toggle("hidden");
  userDropDown.classList.toggle("flex");
};
const reloadPage = () => {
  window.location.reload();
};
accountToggler?.addEventListener("click", toggleUserDropDown);
reloadBtns?.forEach((btn) => {
  btn.addEventListener("click", reloadPage);
});
register?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputFields = e.target.getElementsByTagName("input");
  const password = inputFields[2].value;
  const cPassword = inputFields[3].value;
  if (password !== cPassword) {
    alert("Passwords do not match");
    e.target.reset();
    return;
  }
  e.target.submit();
});
