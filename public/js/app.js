const accountToggler = document.querySelector(".userAccountToggler");
const userDropDown = document.querySelector("#user-dropdown");
const reloadBtns = document.querySelectorAll(".reloadBtn");
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
