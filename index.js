"use strict";

const ul = document.getElementById("js-list");
const length = 2;
const fragment = document.createDocumentFragment();

for (let i = 1; i <= length; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  const img = document.createElement("img");

  a.textContent = `a${i}`;
  a.setAttribute("href", `${i}.html`);
  img.setAttribute("src", "bookmark.png");
  img.setAttribute("alt", "ブックマーク");

  fragment.appendChild(li).appendChild(a).prepend(img);
}

ul.appendChild(fragment);
