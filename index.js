"use strict";

const ul = document.getElementById("js-list");

let li = "";
let a = "";
let img = "";

function createTag() {
  li = document.createElement("li");
  a = document.createElement("a");
  img = document.createElement("img");
}

function insertElement() {
  ul.appendChild(li).appendChild(a).prepend(img);
}

for (let i = 1; i <= 2; i++) {
  createTag();

  a.textContent = `a${i}`;
  a.setAttribute("href", `${i}.html`);
  img.setAttribute("src", "bookmark.png");
  img.setAttribute("alt", "ブックマーク");

  insertElement();
}
