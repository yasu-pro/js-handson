"use strict";
const wrap = document.getElementById("js-wrap")
const ul = document.getElementById("js-list");
const url = "https://myjson.dit.upm.es/api/bins/ajy3"

async function getData() {
  loading();
  try {
    const response = (await fetch(url)).json();
    return response
  } catch (e) {
    wrap.textContent = e.message;
  } finally {
    hideLoading();
  }
}

getData().then((value) => {
  createElement(value);
})

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

