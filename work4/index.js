"use strict";

const ul = document.getElementById("js-list");
const fragment = document.createDocumentFragment();
const items = [
  { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" },
];

items.forEach((item) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  const img = document.createElement("img");
  console.log(item);

  a.href = item.to;
  a.textContent = item.text;
  img.src = item.img;
  img.alt = item.alt;

  fragment.appendChild(li).appendChild(a).prepend(img);
});

ul.appendChild(fragment);
