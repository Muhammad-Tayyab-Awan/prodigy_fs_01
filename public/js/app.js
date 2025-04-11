const accountToggler = document.querySelector(".userAccountToggler");
const userDropDown = document.querySelector("#user-dropdown");
const toggleUserDropDown = () => {
  userDropDown.classList.toggle("hidden");
  userDropDown.classList.toggle("flex");
};
accountToggler.addEventListener("click", toggleUserDropDown);
