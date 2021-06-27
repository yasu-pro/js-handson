loading();

function loading() {
  const ul = document.getElementById("js-list");
  ul.style.backgroundImage = "url(./img/loading-circle.gif)";
  ul.style.backgroundRepeat = "no-repeat";
  ul.style.height = "100px";
}

function createElement(items) {
  const ul = document.getElementById("js-list");
  const fragment = document.createDocumentFragment();
  ul.style.backgroundImage = "none";

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

      reject(new Error("エラー"));

    }, 3000);
  });
}

getObj().then((items) => {
  createElement(items);
})
  .catch((error) => {
    console.error(error);
  })
