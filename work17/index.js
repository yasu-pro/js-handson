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

const getRequestData = async REQUEST_URL => {
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

const renderErrorMessage = errorMessage => {
    const p = document.createElement("p");

    p.textContent = errorMessage;
    document.body.prepend(p);
}

const renderSlideImg = imagesDataArray => {
    const wrapDiv = document.createElement("div");
    const slideDiv = document.createElement("div");
    const ul = document.createElement("ul");
    const fragment = document.createDocumentFragment();

    ul.classList = "slider_item"
    wrapDiv.classList = "slider_wrap";
    slideDiv.classList = "slider_slide";

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

    document.body.appendChild(wrapDiv)
        .appendChild(slideDiv).appendChild(ul).appendChild(fragment);
    slideDiv.appendChild(renderPagingNumber());
    renderSlideArrow();
    clickedSliderEvent();
}

const renderPagingNumber = () => {
    let count = 1;
    const sliderListElements = [...document.querySelectorAll(".slider_items")];
    const span = document.createElement("span");

    const span = document.createElement("span");
    span.classList = "slider_pageNum";

    sliderListElements.forEach(element => {
        if (element.classList.contains("is-display")) {
            span.textContent = `${count} / ${sliderListElements.length}`;
            return span;
        }
    });
    return span;
};

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

    addOrRemoveDisabledImg();
}

const addOrRemoveDisabled = (index, nextOrPrevButton) => {
    const sliderListElements = document.querySelector(".slider_item");
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
        addOrRemoveDisabledImg();
    })

const clickedSliderEvent = () => {
    const buttonElements = [...document.querySelectorAll(".slider_button")];
    let count = 1;
    buttonElements.forEach((nextOrPrevButton) => {
        nextOrPrevButton.addEventListener("click", (e) => {
            const sliderListElements = [...document.querySelectorAll(".slider_items")];
            const displayElem = document.querySelector(".is-display");
            displayElem && displayElem.classList.remove("is-display");

            e.currentTarget.classList.contains("slider_next") ? count++ : count--;

            switchImg(count);
            addOrRemoveDisabled(count, nextOrPrevButton);
            changePageNum(count, sliderListElements.length);
        })
    })
}

init();
