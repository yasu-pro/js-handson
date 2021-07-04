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

function getObj() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(obj);


      reject(new Error("エラー"));

    }, 3000);
  })
}

getObj().then((items) => {
  createElement(items);
  ul.style.backgroundImage = "none";
})
  .catch((error) => {
    console.error(error);
  });

function loading() {
  ul.style.backgroundImage = "url(./img/loading-circle.gif)";
  ul.style.backgroundRepeat = "no-repeat";
  ul.style.height = "100px";
}

loading();