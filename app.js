const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const description = document.querySelector("#description");
const ul = document.querySelector("ul");
const search = document.querySelector(".search input");
const addBtn = document.querySelector("#add-btn");

const date = () => {
  let time = new Date();
  return `"${time.getFullYear()} / ${
    time.getMonth() + 1 > 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)
  } / ${time.getDate() > 10 ? time.getDate() : "0" + time.getDate()}"`;
};

let todos = [];

const obj = {
  id: "",
  name: "",
  description: "",
  createTime: "",
  updateTime: "",
};

window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("data")) || [];
  showData();
});

form.onsubmit = (e) => {
  e.preventDefault();
  let id = todos.length + 1;
  let finIndex = todos.findIndex((item) => item.id == nameInput.dataset.id);

  if (nameInput.value.trim() === "" || description.value.trim() === "") {
    return;
  }

  if (finIndex >= 0) {
    todos[finIndex].name = nameInput.value;
    todos[finIndex].description = description.value;
    todos[finIndex].updateTime = date();
  } else {
    todos.push({
      ...obj,
      id: id,
      name: nameInput.value,
      description: description.value,
      createTime: date(),
      updateTime: "",
    });
  }
  localStorage.setItem("data", JSON.stringify(todos));
  showData();
  nameInput.value = "";
  description.value = "";
  addBtn.textContent = "Add";
  nameInput.setAttribute("data-id", ``);
};

const showData = (datas = todos) => {
  let html = `
      <li>
        <p class="number">No.</p>
        <p class="name">Name</p>
        <p class="desc">Description</p>
        <p class="times">Created at</p>
        <p class="update">Update at</p>
        <p class="btns">Actions</p>
      </li>`;
  datas.forEach((item) => {
    html += `
      <li>
         <p class="number">${item.id}</p>
         <p class="name">${item.name}</p>
         <p class="desc">${item.description}</p>
         <p class="times">${item.createTime}</p>
         <p class="update">${item.updateTime || "No Info"}</p>
         <p class="btns">
           <button class="edit" data-id=${item.id}>Edit</button>
           <button class="delete" data-id=${item.id}>Delete</button>
         </p>
      </li>
      `;
  });
  ul.innerHTML = html;

  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((item) => {
    item.addEventListener("click", () => {
      let deleteItem = todos.filter((data) => data.id != item.dataset.id);
      todos = deleteItem;
      localStorage.setItem("data", JSON.stringify(todos));
      showData();
    });
  });

  const editBtn = document.querySelectorAll(".edit");
  editBtn.forEach((item) => {
    item.addEventListener("click", () => {
      let editItem = todos.find((data) => data.id == item.dataset.id);
      nameInput.value = editItem.name;
      description.value = editItem.description;
      addBtn.textContent = "Update";
      nameInput.setAttribute("data-id", `${item.dataset.id}`);
      showData();
    });
  });
};

search.addEventListener("input", (e) => {
  let value = e.target.value.toUpperCase();
  let datas = todos.filter(
    (item) =>
      item.name.toUpperCase().includes(value) ||
      item.description.toUpperCase().includes(value)
  );
  showData(datas);
});
