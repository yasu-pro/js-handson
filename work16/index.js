// const requestURL = "https://mocki.io/v1/764bd14c-1995-4f85-88f1-eb30bbfcefd8"

// 間違っているURLの場合↓
// const requestURL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const requestURL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
const requestURL = "https://httpstat.us/503";

const request = async () => {
    try {
        const response = await fetch(requestURL);
        if (!response.ok) {
            console.log(`${response.status}:${response.statusText}`);
        } else {
            return response.json();
        }

    } catch (e) {
        throw new Error(e);
    }
}

const init = async () => {
    let responseJsonData;
    const p = document.createElement("p");

    try {
        responseJsonData = await request();
        if (!responseJsonData) {
            return;
        }
    } catch (e) {
        p.textContent = e.message;
        document.body.prepend(p);
    }

    if (!responseJsonData.data.length) {
        p.textContent = "data is empty";
        document.body.prepend(p);
        return;
    }
    // return responseJsonData.data;
}


console.log(init());
