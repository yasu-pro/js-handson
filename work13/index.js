"use strict";
const wrap = document.getElementById("js_wrap");
const ul = document.getElementById("js_list");
const modalBtn = document.getElementById("js_modalButton");
const modal = document.getElementById("js_modal");

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

const init = async () => {
  loading();
  const data = await getListData();
  renderListElement(data);
}

// モーダルクリック pattern1
modalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  modalBtn.parentElement.remove();
  requestBtnClickEvent();
});

function requestBtnClickEvent() {
  const requestBtn = document.getElementById("js_requestButton");
  requestBtn.addEventListener("click", () => {
    init();
    modal.remove();
  })
}

// モーダルクリック pattern2
// modalBtn.addEventListener("click", () => {
//   modal.style.display = "block";
//   modalBtn.parentElement.remove();
// });


// const requestBtn = document.getElementById("js_requestButton");
// requestBtn.addEventListener("click", (e) => {
//   init();
//   modal.remove();
// })
