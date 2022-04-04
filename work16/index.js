// loadingとhideloading関数を作成
// 取得したデータからニュースのカテゴリーを作成

// ニュースの記事を表示
// コメントがあれば表示

const requestURL = "https://mocki.io/v1/764bd14c-1995-4f85-88f1-eb30bbfcefd8"

// 間違っているURLの場合↓
// const requestURL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const requestURL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
// const requestURL = "https://httpstat.us/503";

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
    renderLoadingImg();

    let responseJsonData;
    const p = document.createElement("p");

    try {
        responseJsonData = await request();
        console.log(responseJsonData);
        if (!responseJsonData) {
            return;
        }
    } catch (e) {
        p.textContent = e.message;
        document.body.prepend(p);
    }
    finally {
        hideLoadingImg();
    }

    if (!responseJsonData.data.length) {
        p.textContent = "data is empty";
        document.body.prepend(p);
        return;
    }
    // return responseJsonData.data;
}

const renderLoadingImg = () => {
    const div = document.createElement("div");
    const img = document.createElement("img");

    div.classList = "loading_wrap";
    div.id = "js_loading_wrap"
    img.src = "./img/loading-circle.gif";
    img.alt = "ローディング画像"

    div.appendChild(img);
    document.body.prepend(div);
}

const hideLoadingImg = () => {
    document.getElementById("js_loading_wrap").remove();
}

console.log(init());
