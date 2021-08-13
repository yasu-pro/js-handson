"use strict";

const ul = document.getElementById("js-list");
const data = [{
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
];

function getData() {
  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);

    }, 3000);
  })
  return result;
}

async function execute() {
  await createElement();
  hideLoading();
}

async function createElement() {
  const fragment = document.createDocumentFragment();
  const imgArray = await getData();

  console.log(imgArray);

  imgArray.forEach((item) => {
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

function loading() {
  ul.style.backgroundImage = "url(./img/loading-circle.gif)";
  ul.style.backgroundRepeat = "no-repeat";
  ul.style.height = "100px";
}

function hideLoading() {
  ul.style.backgroundImage = "none";
}

loading();

execute();
