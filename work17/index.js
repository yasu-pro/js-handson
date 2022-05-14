"use strict";
const REQUEST_URL = "https://mocki.io/v1/d4a57e5a-8c84-4fee-aa05-70a1791c0d86";

// 間違っているURLの場合↓
// const REQUEST_URL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const REQUEST_URL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
// const REQUEST_URL = "https://httpstat.us/503";

let currentImgCount = 1;
const wrapDiv = document.getElementById("js-slider_wrap");

const renderLoading = () => {
    const div = document.createElement("div");
    const img = document.createElement("img");

    div.classList = "loading-wrap";
    img.src = "./img/loading-circle.gif";

    wrapDiv.appendChild(div).appendChild(img);
    document.body.appendChild(div);
}

const hideLoadingImg = () => {
    document.querySelector(".loading-wrap").remove();
}

const init = async () => {
    renderLoading();
    let imgJsonData;
    try {
        imgJsonData = await getRequestData(REQUEST_URL);
    } catch (error) {
        renderErrorMessage(`${error.message}`)
    } finally {
        hideLoadingImg();
    }

    if (!imgJsonData.data.length) {
        renderErrorMessage("JSONデータが空です。");
        return;
    }
    renderSlideImg(imgJsonData.data);
    renderSlideArrow();
    clickedSliderEvent();
}

const getRequestData = async REQUEST_URL => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchSlideImgData(REQUEST_URL));
        }, 3000);
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

const renderErrorMessage = errorMessage => {
    const p = document.createElement("p");

    p.textContent = errorMessage;
    document.body.prepend(p);
}

const renderSlideImg = imagesDataArray => {
    const slideDiv = document.createElement("div");
    const ul = document.createElement("ul");
    const fragment = document.createDocumentFragment();

    ul.classList = "slider_list"
    slideDiv.classList = "slider_slide";

    for (let i = 0; i < imagesDataArray.length; i++) {
        const li = document.createElement("li");
        const img = document.createElement("img");

        img.src = imagesDataArray[i].src;
        li.classList = "slider_items";
        i === 0 && li.classList.add("is-display");
        li.id = `js-sliderItems${i + 1}`;

        li.appendChild(img);
        fragment.appendChild(li);
    }

    wrapDiv.appendChild(slideDiv).appendChild(ul).appendChild(fragment);
    slideDiv.appendChild(createPagingNumber());
}

const createPagingNumber = () => {
    const sliderListElements = [...document.querySelectorAll(".slider_items")];

    const span = document.createElement("span");
    span.classList = "slider_pageNum";

    span.textContent = `${currentImgCount} / ${sliderListElements.length}`;
    return span;
}

const renderSlideArrow = () => {
    const wrapDiv = document.querySelector(".slider_slide");
    const divLeft = document.createElement("div");
    const divRight = document.createElement("div");
    const buttonLeft = document.createElement("button");
    const buttonRight = document.createElement("button");
    const iLeft = document.createElement("i");
    const iRight = document.createElement("i");

    divLeft.classList = "slider_arrowBox-left slider_arrowBox";
    divRight.classList = "slider_arrowBox-right slider_arrowBox";
    buttonLeft.classList = "slider_prev slider_button"
    buttonRight.classList = "slider_next slider_button"
    buttonLeft.type = "button";
    buttonLeft.disabled = true;
    buttonRight.type = "button";
    iLeft.classList = "fas fa-angle-left fa-3x";
    iRight.classList = "fas fa-angle-right fa-3x";

    divLeft.appendChild(buttonLeft).appendChild(iLeft);
    divRight.appendChild(buttonRight).appendChild(iRight);

    wrapDiv.appendChild(divLeft);
    wrapDiv.appendChild(divRight);
}

const addOrRemoveDisabled = (index, nextOrPrevButton) => {
    const sliderListElements = document.querySelector(".slider_list");
    const targetElem = document.getElementById(`js-sliderItems${index}`);

    const firstElem = sliderListElements.firstElementChild;
    const lastElem = sliderListElements.lastElementChild;

    if (targetElem === firstElem || targetElem === lastElem) {
        nextOrPrevButton.disabled = true;
    } else {
        const disabledElem = document.querySelector("[disabled]");
        disabledElem && disabledElem.removeAttribute("disabled");
    }
}

const changePageNum = (currentImgNum, maxImgNum) => {
    const pageNumElement = document.querySelector(".slider_pageNum");
    pageNumElement.textContent = `${currentImgNum} / ${maxImgNum}`;
    return pageNumElement;
}

const switchImg = index => {
    document.getElementById(`js-sliderItems${index}`).classList.add("is-display");
}

const clickedSliderEvent = () => {
    const buttonElements = [...document.querySelectorAll(".slider_button")];
    buttonElements.forEach((nextOrPrevButton) => {
        nextOrPrevButton.addEventListener("click", (e) => {
            const sliderListElements = [...document.querySelectorAll(".slider_items")];
            const displayElem = document.querySelector(".is-display");
            displayElem && displayElem.classList.remove("is-display");

            e.currentTarget.classList.contains("slider_next") ? currentImgCount++ : currentImgCount--;

            switchImg(currentImgCount);
            addOrRemoveDisabled(currentImgCount, nextOrPrevButton);
            changePageNum(currentImgCount, sliderListElements.length);
        })
    })
}

init();
