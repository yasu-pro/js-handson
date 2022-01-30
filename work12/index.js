"use strict";
const wrap = document.getElementById("js-wrap")
const ul = document.getElementById("js-list");
const button_wrap = document.getElementById("js-button-wrap");

// const url = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// const url = "https://myjson.dit.upm.es/api/bins/bu5z";
// const url = "https://myjson.dit.upm.es/api/bins/2hj3";
// 下記は、myjson繋がらない時の固定値
const url = {
  "data": [
    {
      "a": "bookmark",
      "img": "img/1.png",
      "alt": "画像１",
      "text": "ブックマーク"
    },
    {
      "a": "message",
      "img": "img/2.png",
      "alt": "画像２",
      "text": "メッセージ"
    }
  ]
}

// async function getData() {
//   try {
//     const response = await fetch(url);
//     if (response.ok) {
//       const json = await response.json();
//       return json;
//     } else {
//       throw new Error(`Server request failed:${response.statusText}`);
//     }
//   } catch (e) {
//     throw new Error(e);
//   }
// }

// 下記は、固定値をそのままpromiseの返り値とする
async function getData() {
  return url
}


async function getListData() {
  let listData;
  try {
    listData = await getData();
  } catch (e) {
    wrap.textContent = `エラー内容:${e.message}`;
  } finally {
    hideLoading();
  }
  if (listData.data.length === 0) {
    wrap.textContent = "data is empty";
    return;
  }
  return listData;
}

function hideLoading() {
  ul.style.backgroundImage = "none";
  ul.style.height = "auto";
}

function renderListElement({ data }) {
  const fragment = document.createDocumentFragment();

  data.forEach((value) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = value.a;
    a.textContent = value.text;
    img.src = value.img;
    img.alt = value.alt;
    img.style.width = "30px";
    img.style.verticalAlign = "middle"

    fragment.appendChild(li).appendChild(a).prepend(img);
  });

  ul.appendChild(fragment);
}

function loading() {
  ul.style.backgroundImage = "url(./img/loading-circle.gif)";
  ul.style.backgroundRepeat = "no-repeat";
  ul.style.height = "100px";
}

function createButtonTag() {
  const buttonTag = document.createElement("button");
  buttonTag.id = "js-button";
  buttonTag.type = "submit";
  buttonTag.textContent = "クリック";
  return buttonTag;
}

function renderButtonElement(createButtonTag) {
  button_wrap.appendChild(createButtonTag);
}

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("js-button");

  button.addEventListener("click", async () => {
    loading();
    button.style.display = "none";
    const data = await getListData();
    renderListElement(data);
  })
});

renderButtonElement(createButtonTag());
