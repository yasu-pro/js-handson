"use strict";
const REQUEST_URL = "https://mocki.io/v1/d4a57e5a-8c84-4fee-aa05-70a1791c0d86";

// 間違っているURLの場合↓
// const REQUEST_URL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const REQUEST_URL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
// const REQUEST_URL = "https://httpstat.us/503";

const init = async () => {
    let imgJsonData;
    try {
        imgJsonData = await getRequestData(REQUEST_URL);
    } catch (error) {
        renderErrorMessage(`${error.message}`)
    }
    if (!imgJsonData.data.length) {
        renderErrorMessage("JSONデータが空です。");
        return;
    }
    renderSlideImg(imgJsonData.data);
}

const getRequestData = async (REQUEST_URL) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchSlideImgData(REQUEST_URL));
        }, 300);
    })
}

const fetchSlideImgData = async () => {
    const parameter = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch(REQUEST_URL, parameter);
    if (!response.ok) {
        renderErrorMessage(`${response.status}:${response.statusText}`);
    } else {
        const jsonData = response.json();
        return jsonData;
    }
}

const renderErrorMessage = (errorMessage) => {
    const p = document.createElement("p");

    p.textContent = errorMessage;
    document.body.prepend(p);
}

const renderSlideImg = imagesDataArray => {
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    const fragment = document.createDocumentFragment();

    ul.classList = "slider_item"
    div.classList = "slider_wrap";

    for (let i = 0; i < imagesDataArray.length; i++) {
        const li = document.createElement("li");
        const img = document.createElement("img");

        img.src = imagesDataArray[i].src;
        li.classList = "slider_items";
        li.style.zIndex = `-${i + 1}`;
        li.id = `js-sliderItems${i + 1}`;

        li.appendChild(img);
        fragment.appendChild(li);
    }
    document.body.appendChild(div).appendChild(ul).appendChild(fragment);
    renderSlideArrow();
    clickedSliderEvent();
}

const renderPagingNumber = () => {
    const sliderListElements = [...document.querySelectorAll(".slider_items")];
    const span = document.createElement("span");

    span.classList = "slider_pageNum";

    for (let i = 0; i < sliderListElements.length; i++) {
        if (sliderListElements[i].style.zIndex === "-1") {
            span.textContent = `${i + 1} / ${sliderListElements.length}`;
        }
        return span;
    }
}

const renderSlideArrow = () => {
    const ulElement = document.querySelector(".slider_item");
    const divLeft = document.createElement("div")
    const divRight = document.createElement("div")
    const iLeft = document.createElement("i");
    const iRight = document.createElement("i");

    divLeft.classList = "slider_arrowBox-left slider_arrowBox";
    divRight.classList = "slider_arrowBox-right slider_arrowBox";
    iLeft.classList = "fas fa-angle-left fa-3x";
    iRight.classList = "fas fa-angle-right fa-3x";

    divLeft.appendChild(iLeft);
    divRight.appendChild(iRight);

    ulElement.appendChild(divLeft);
    ulElement.appendChild(divRight);
}

const clickedSliderEvent = () => {
    const arrowLeftDiv = document.querySelector(".slider_arrowBox-left");
    const arrowRightDiv = document.querySelector(".slider_arrowBox-right");

    arrowLeftDiv.addEventListener("click", () => {
        const sliderListElements = [...document.querySelectorAll(".slider_items")];

        for (let i = 0; i < sliderListElements.length; i++) {
            if (sliderListElements[i].style.zIndex === "-5") {
                sliderListElements[i].style.zIndex = -1;
            } else {
                const currentZIndex = parseInt(sliderListElements[i].style.zIndex);
                sliderListElements[i].style.zIndex = currentZIndex - 1
            }
        }
    })

    arrowRightDiv.addEventListener("click", () => {
        const sliderListElements = [...document.querySelectorAll(".slider_items")];

        for (let i = 0; i < sliderListElements.length; i++) {
            if (sliderListElements[i].style.zIndex === "-1") {
                sliderListElements[i].style.zIndex = -sliderListElements.length;
            } else {
                const currentZIndex = parseInt(sliderListElements[i].style.zIndex);
                sliderListElements[i].style.zIndex = currentZIndex + 1
            }
        }
    })
}

init();
