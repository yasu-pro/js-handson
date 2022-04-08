
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
    displayNews(responseJsonData.data);
}

const displayNews = (newsDataArray) => {
    renderNewsTab(newsDataArray);
    renderNewsContent(newsDataArray);
}

const renderNewsTab = (newsDataArray) => {
    const tabList = document.getElementById("js_tabList");
    const fragment = document.createDocumentFragment();

    newsDataArray.forEach((newsCategoryObj, index) => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        if (!index) {
            li.setAttribute("aria-selected", true);
        } else {
            li.setAttribute("aria-selected", false);
        }
        li.setAttribute("roll", "tab");
        li.id = `${"js_tabTopics" + ++index}`;
        li.classList = "tabTopics";

        a.textContent = newsCategoryObj.field
        a.href = "#"

        li.appendChild(a);
        fragment.appendChild(li);
    });
    tabList.appendChild(fragment);



    const tabTopics = document.querySelectorAll(".tabTopics");
    for (let i = 0; i < tabTopics.length; i++) {
        tabTopics[i].addEventListener("click", () => {
            if (tabTopics[i].getAttribute("aria-selected") === "false") {
                for (let j = 0; j < tabTopics.length; j++) {
                    tabTopics[j].setAttribute("aria-selected", false);
                }
                tabTopics[i].setAttribute("aria-selected", true);
            }
        });
    }
}

const renderNewsContent = (newsDataArray) => {
    const tabTopics = document.querySelectorAll(".tabTopics");
    const newsSection = document.createElement("section");
    let tabTopicElem;
    let tabIdName;

    newsSection.setAttribute("roll", "tabpanel")
    document.getElementById("js_tabList").after(newsSection);

    newsDataArray.forEach((newsCategoryObj, index) => {
        const fragment = document.createDocumentFragment();
        const ul = document.createElement("ul");
        const newsContentsData = newsCategoryObj.contents;

        newsContentsData.forEach(newsArticleData => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            const title = newsArticleData.title;

            a.href = "#";
            a.textContent = title;

            li.appendChild(a);
            fragment.appendChild(li);
        })
        ul.appendChild(fragment);

        if (tabTopics[index].getAttribute("aria-selected") === "true") {
            tabTopicElem = document.getElementById(tabTopics[index].id);
            tabIdName = tabTopicElem.id;
        }

        if (!index) {
            newsSection.id = `${"tabpanelTopics" + (index + 1)}`;
            newsSection.setAttribute("aria-labelledby", tabIdName);
            newsSection.setAttribute("aria-hidden", "false");
            newsSection.appendChild(ul);
        }

        tabTopics[index].addEventListener("click", () => {
            tabTopicElem = document.getElementById(tabTopics[index].id);
            tabIdName = tabTopicElem.id;

            newsSection.setAttribute("aria-labelledby", tabIdName);
            newsSection.setAttribute("aria-hidden", "false");
            newsSection.id = `${"tabpanelTopics" + (index + 1)}`;

            newsContentsData.forEach((newsArticleData, newsArticleDataIndex) => {
                const getAncorsElem = document.querySelectorAll(`#tabpanelTopics${index + 1} > ul > li > a`);
                getAncorsElem[newsArticleDataIndex].textContent = newsArticleData.title;
            })
        })
    })
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

init();
