"use strict";
const div = document.querySelector(".wrap")
const ul = document.getElementById("js-list");
const url = "https://jsondata.okiba.me/v1/json/d4ex5210822124352"

function getData() {
  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        async function a() {
          const response = (await fetch(url)).json();
          return response
        }()
      )

    }, 3000);
  })
  return result;
}

async function displayView() {
  loading();

  try {
    const arrayData = await getData();
    createElement(arrayData);
  } catch (e) {
    div.textContent = e.message;
  } finally {
    hideLoading();
  }

}

function hideLoading() {
  ul.style.backgroundImage = "none";
}

function createElement(imgArray) {
  const fragment = document.createDocumentFragment();

  Object.keys(imgArray).forEach(key => {

    Object.keys(imgArray[key]).forEach(keyIndex => {

      const li = document.createElement("li");
      const a = document.createElement("a");
      const img = document.createElement("img");

      a.href = imgArray[key][keyIndex].a;
      a.textContent = imgArray[key][keyIndex].text;
      img.src = imgArray[key][keyIndex].img;
      img.alt = imgArray[key][keyIndex].alt;

      fragment.appendChild(li).appendChild(a).prepend(img);
    });
    ul.appendChild(fragment);
  })
  ul.appendChild(fragment);
}

function loading() {
  ul.style.backgroundImage = "url(./img/loading-circle.gif)";
  ul.style.backgroundRepeat = "no-repeat";
  ul.style.height = "100px";
}




displayView();
