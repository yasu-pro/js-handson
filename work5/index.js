"use strict";

const ul = document.getElementById("js-list");
const fragment = document.createDocumentFragment();
const listContents = [
  {
    to: "bookmark.html",
    img: "1.png",
    alt: "画像1",
    text: "ブックマーク",
  },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" },
];

//ver1
function getObj() {
  return new Promise((resolve, reject) => {
    resolve(listContents);
  });
}

getObj().then((items) => {
  items.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = item.to;
    a.textContent = item.text;
    img.src = item.img;
    img.alt = item.alt;

    fragment.appendChild(li).appendChild(a).prepend(img);
  });

  ul.appendChild(fragment);
});

//ver2
const promise = new Promise((resolve, reject) => {
  resolve(listContents);
});

promise.then((items) => {
  items.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = item.to;
    a.textContent = item.text;
    img.src = item.img;
    img.alt = item.alt;

    fragment.appendChild(li).appendChild(a).prepend(img);
  });

  ul.appendChild(fragment);
});
