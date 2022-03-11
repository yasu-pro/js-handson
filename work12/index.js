"use strict";
const wrap = document.getElementById("js-wrap");
const ul = document.getElementById("js-list");

// const url = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// const url = "https://myjson.dit.upm.es/api/bins/86vb";
// const url = "https://myjson.dit.upm.es/api/bins/eu2f";
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

async function getData() {
  try {
    // const response = await fetch(url);
    // if (response.ok) {
    //   const json = await response.json();
    //   return json;
    // } else {
    //.okでなければerrorを投げる
    //   throw new Error(`Server request failed:${response.statusText}`);
    // }
    // 下記は、固定値をそのままpromiseの返り値とする
    const json = url

    return json
  } catch (e) {
    //上記のthrowでエラーが出ていれば、ここでコンソールに表示し、
    //エラーを投げる
    console.error(e)
    throw new Error(e);
  }
}

async function getListData() {
  try {
    const listData = await getData();
    if (listData.data.length === 0) {
      throw new Error("data is empty");
    }
    return listData;
  } catch (e) {
    // 上記の `catch` の中にある `throw` を取得し表示する
    wrap.textContent = `エラー内容:${e.message}`;
  } finally {
    hideLoading();
  }
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

function renderButtonElement() {
  const buttonWrap = document.createElement("div");
  const buttonTag = document.createElement("button");

  buttonWrap.id = "js-button-wrap";

  buttonTag.id = "js-button";
  buttonTag.type = "submit";
  buttonTag.textContent = "クリック";

  wrap.after(buttonWrap);
  buttonWrap.appendChild(buttonTag);

  return buttonWrap;
}

const init = async () => {
  loading();
  const data = await getListData();
  renderListElement(data);
}

renderButtonElement();

const button = document.getElementById("js-button");
button.addEventListener("click", () => {
  init();
  button.remove();
})
