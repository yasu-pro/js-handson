"use strict";
const wrap = document.getElementById("js-wrap")
const ul = document.getElementById("js-list");
const url = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// const url = "https://myjson.dit.upm.es/api/bins/bu5z";
// const url = "https://myjson.dit.upm.es/api/bins/ajy3"


async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error(e);
  } finally {
    hideLoading();
  }
}

async function getListData() {
  loading();
  let listData;
  try {
    listData = await getData();
    console.log(listData);
    if (listData.status !== 200) {
      throw new Error(`status:${listData.status}, message:${listData.message}`);
    }
  } catch (e) {
    wrap.textContent = `エラー内容:${e.message}`;
  } finally {
    hideLoading();
  }
  if (listData.data.length) {
    wrap.textContent = "data is empty";
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
