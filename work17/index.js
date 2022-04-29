"use strict";
const REQUEST_URL = "https://mocki.io/v1/7b2982fb-cf34-4c47-a68f-79fdd1db1b7e";

// 間違っているURLの場合↓
// const REQUEST_URL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const REQUEST_URL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
// const REQUEST_URL = "https://httpstat.us/503";


const init = async () => {
    let imgJsonData;
    try {
        imgJsonData = await response();
    } catch (error) {
        renderErrorMessage(`${error.message}`)
    }
    if (!imgJsonData.data.length) {
        renderErrorMessage("JSONデータが空です。");
        return;
    }
    return imgJsonData;
}

const response = async () => {
    const parameter = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const result = await fetch(REQUEST_URL, parameter);
    if (!result.ok) {
        console.log(`${result.status}:${result.statusText}`)
        renderErrorMessage(`${result.status}:${result.statusText}`);
    } else {
        const jsonData = result.json();
        return jsonData;
    }
}

const renderErrorMessage = (errorMessage) => {
    const p = document.createElement("p");

    p.textContent = errorMessage;
    document.body.prepend(p);
}


init();
