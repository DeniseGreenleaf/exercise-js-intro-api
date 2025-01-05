import { getAllUsers, handleOnClick, insertUsersToDOM } from "./utilties.js";

export const loader = document.querySelector(".loader");
export const main = document.querySelector("main");
export const button = document.querySelector("#back-btn")

main.addEventListener("click", handleOnClick);

getAllUsers().then((users) => {
  insertUsersToDOM(users);
});




