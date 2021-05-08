"use strict";

const ul = document.getElementById("js-list");

function createTag() {
  const li = document.createElement("li");
  const a = document.createElement("a");
  const img = document.createElement("img");

  return [li, a, img];
}

for (let i = 1; i <= 2; i++) {
  const array = createTag();
  console.log(createTag());
  array[0].textContent = `a${i}`;
  array[0].setAttribute("href", `${i}.html`);
  array[2].setAttribute("src", "bookmark.png");
  array[2].setAttribute("alt", "ブックマーク");

  ul.appendChild(array[0]).appendChild(array[1]).prepend(array[2]);
}
