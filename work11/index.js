"use strict";
const wrap = document.getElementById("js-wrap")
const ul = document.getElementById("js-list");
// const url = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// const url = "https://myjson.dit.upm.es/api/bins/bu5z";
const url = "https://myjson.dit.upm.es/api/bins/2hj3";


async function getData() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      throw new Error(response.statusText);
    }
  } catch (e) {
    throw new Error(e);
  }
}

async function getListData() {
  loading();
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
  createElement(listData);
}

function hideLoading() {
  ul.style.backgroundImage = "none";
}

function createElement({ data }) {
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

getListData();
