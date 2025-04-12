const accountToggler = document.querySelector(".userAccountToggler");
const userDropDown = document.querySelector("#user-dropdown");
const reloadBtns = document.querySelectorAll(".reloadBtn");
const register = document.querySelector("#register");
const year = document.querySelector("#year");
const deleteAccountBtns = document.querySelectorAll(".deleteAccountBtn");
const updateAccountBtn = document.querySelector("#updateAccountBtn");
const deleteModal = document.querySelector("#deleteModal");
if (year) year.innerHTML = new Date().getFullYear();
const toggleUserDropDown = () => {
  userDropDown.classList.toggle("hidden");
  userDropDown.classList.toggle("flex");
};
const reloadPage = () => {
  window.location.reload();
};
const submitForm = (e) => {
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
};
const toggleDeleteModal = () => {
  deleteModal.classList.toggle("hidden");
  deleteModal.classList.toggle("flex");
};
const toggleUpdateModal = (e) => {};
accountToggler?.addEventListener("click", toggleUserDropDown);
reloadBtns?.forEach((btn) => {
  btn.addEventListener("click", reloadPage);
});
register?.addEventListener("submit", submitForm);
deleteAccountBtns?.forEach((deleteAccountBtn) => {
  deleteAccountBtn.addEventListener("click", toggleDeleteModal);
});

updateAccountBtn?.addEventListener("click", toggleUpdateModal);
