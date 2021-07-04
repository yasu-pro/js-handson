"use strict";

const ul = document.getElementById("js-list");
const obj = [{
  to: "bookmark.html",
  img: "1.png",
  alt: "画像1",
  text: "ブックマーク",
},
{
  to: "message.html",
  img: "2.png",
  alt: "画像2",
  text: "メッセージ"
},
]

function createElement(items) {
  const fragment = document.createDocumentFragment();
  ul.style.backgroundImage = "none";
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
}

async function getObj() {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(obj)
    }, 3000);
  })
  createElement(obj);
}

getObj()
  .catch((error) => {
    console.error(error);
  });

function loading() {
  ul.style.backgroundImage = "url(./img/loading-circle.gif)";
  ul.style.backgroundRepeat = "no-repeat";
  ul.style.height = "100px";
}

loading();