import { loader, main, button } from "./index.js";

const baseURL = "https://jsonplaceholder.typicode.com";

function createUserCard(user) {
  const card = /*html*/ `
        <article class="card" id="${user.id}">
            <h3 class="name">${user.name}</h3>
            <p class="username">username: ${user.username}</p>
            <p class="phone">Phone: ${user.phone}</p>
            <p class="email">Email: ${user.email}</p>
        </article>
    `;

  return card;
}

function createUserPage(user) {
  const userPage = /*html*/ `
    <section class="user-page">
      <h3 class="name">${user.name}</h3>
      <p class="username">username: ${user.username}</p>
      <p class="phone">Phone: ${user.phone}</p>
      <p class="email">Email: ${user.email}</p>
      <div class="address">
        <p>${user.address.city}</p>
        <p>${user.address.street}</p>
      </div>
      <div class = "posts">
        <h3>Users Posts</h3>
        <div class="posts-container">
        <!-- posts will be inserted here -->
        </div>
      <div class="actions">
        <button id="back-btn">Back to user list</button>
      </div>
    </section>
  `;

  return userPage;
}

export async function getAllUsers() {
  const cachedUsers = getFromLocalStorage("users");
  if (cachedUsers) {
    console.log("Fetching users from LocalStorage");
    return cachedUsers;
  }

  console.log("Fetching users from API");
  const res = await fetch(baseURL + "/users");
  const users = await res.json();
  saveToLocalStorage("users", users);
  return users;
}

async function getUserById(userId) {
  const cachedUser = getFromLocalStorage(`user_${userId}`);
  if (cachedUser) {
    console.log(`Fetching user ${userId} from LocalStorage`);
    return cachedUser;
  }

  console.log(`Fetching user ${userId} from API`);
  const res = await fetch(baseURL + `/users/${userId}`);
  const user = await res.json();
  saveToLocalStorage(`user_${userId}`, user);
  return user;
}



function handleOnCardClick(card) {
  insertLoaderToDOM();
  getUserById(card.id).then((user) => {
    const userPageAsHtmlString = createUserPage(user);
    main.innerHTML = userPageAsHtmlString;

    const backButton = document.querySelector("#back-btn");
    const postsContainer = document.querySelector(".posts-container");

    // Hantera "Back"-knappen
    backButton.addEventListener("click", () => {
      getAllUsers().then((users) => {
        insertUsersToDOM(users);
      });
    });

    // Hämta och visa poster direkt
    getPostsByUser(user.id).then((posts) => {
      const postsHtml = renderPosts(posts);
      postsContainer.innerHTML = postsHtml;
      postsContainer.style.display = "block";
    });
  });
}


export function handleOnClick(event) {
  const { target } = event;
  const closetsCard = target.closest(".card");
  if (closetsCard) handleOnCardClick(closetsCard);
}

function insertLoaderToDOM() {
  main.innerHTML = loader.outerHTML;
}

export function insertUsersToDOM(users) {
  const usersAsHtmlString = users.map((user) => createUserCard(user)).join("");
  main.innerHTML = usersAsHtmlString;
}

async function getPostsByUser(userId) {
  const cachedPosts = getFromLocalStorage(`posts_user_${userId}`);
  if (cachedPosts) {
    console.log(`Fetching posts for user ${userId} from LocalStorage`);
    return cachedPosts;
  }

  console.log(`Fetching posts for user ${userId} from API`);
  const res = await fetch(`${baseURL}/posts?userId=${userId}`);
  const posts = await res.json();
  saveToLocalStorage(`posts_user_${userId}`, posts);
  return posts;
}

function saveToLocalStorage(KeyboardEvent, data) {
  localStorage.setItem(KeyboardEvent, JSON.stringify(data)); 
}

function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null; 

}

function renderPosts(posts) {
  return posts
    .map(
      (post) => `
      <article class="post">
        <h4>${post.title}</h4>
        <p>${post.body}</p>
      </article>
    `
    )
    .join("");
}







    