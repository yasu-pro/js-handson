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

const renderErrorMessage = (errorMessage) => {
    const p = document.createElement("p");

    p.textContent = errorMessage;
    document.body.prepend(p);
}

const renderSlideImg = imagesDataArray => {
    const div = document.createElement("div");
    div.classList = "slide_wrap";
    const ul = document.createElement("ul");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < imagesDataArray.length; i++) {
        console.log(imagesDataArray[i].src);
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = imagesDataArray[i].src;
        img.id = `js-img${i}`;
        li.appendChild(img);
        fragment.appendChild(li);
    }
    document.body.appendChild(div).appendChild(ul).appendChild(fragment);
}



init();
