"use strict";
const wrap = document.getElementById("js_wrap");
const ul = document.getElementById("js_list");
const modalBtn = document.getElementById("js_modalButton");
const modal = document.getElementById("js_modal");
const requestBtn = document.getElementById("js_requestButton");

const url = "https://mocki.io/v1/d6da0b8a-3546-419e-aaec-05f3a247c6d0";
// const url = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// const url = "https://myjson.dit.upm.es/api/bins/eu2f";

// 下記は、myjson繋がらない時の固定値
// const url = {
//   "data": [
//     {
//       "a": "bookmark",
//       "img": "img/1.png",
//       "alt": "画像１",
//       "text": "ブックマーク"
//     },
//     {
//       "a": "message",
//       "img": "img/2.png",
//       "alt": "画像２",
//       "text": "メッセージ"
//     }
//   ]
// }

async function getData() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      // .okでなければerrorを投げる
      throw new Error(`Server request failed:${response.statusText}`);
    }
    // 下記は、固定値をそのままpromiseの返り値とする
    // const json = url
    // return json
  } catch (e) {
    //上記のthrowでエラーが出ていれば、ここでコンソールに表示し、
    //エラーを投げる
    console.error(e)
    throw new Error(e);
  }
}

async function getListData() {
  let listData;
  try {
    listData = await getData();
  } catch (e) {
    wrap.textContent = `エラー内容:${e.message}`;
  } finally {
    removeLoading();
  }
  if (listData.data.length === 0) {
    wrap.textContent = "data is empty";
    return;
  }
  return listData;
}

function removeLoading() {
  document.getElementById("js_loading").remove();
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

    fragment.appendChild(li).appendChild(a).prepend(img);
  });

  ul.appendChild(fragment);
}

function renderLoading() {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const body = document.querySelector("html body");

  div.id = "js_loading";
  img.src = "./img/loading-circle.gif"

  div.append(img);
  body.prepend(div);
}

async function init() {
  renderLoading();
  const data = await getListData();
  renderListElement(data);
}

modalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  modalBtn.parentElement.remove();
});

requestBtn.addEventListener("click", () => {
  init();
  modal.remove();
})
