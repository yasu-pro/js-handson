
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
                for (let k = 0; k < tabTopics.length; k++) {
                    tabTopics[k].setAttribute("aria-selected", false);
                }
                tabTopics[i].setAttribute("aria-selected", true);
            }
        });
    }
}

const renderNewsContent = (newsDataArray) => {
    newsDataArray.forEach((newsCategoryObj, index) => {
        const fragment = document.createDocumentFragment();
        const ul = document.createElement("ul");
        const tabTopics = document.querySelectorAll(".tabTopics");
        const newsContentsData = newsCategoryObj.contents;
        const newsCategoryImg = newsCategoryObj.img;

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

        if (!index) {
            const div = document.createElement("div");
            const newsSection = createSection(tabTopics, index);

            div.classList = "tabpanelTopics_wrap";

            document.getElementById("js_tabList").after(newsSection);
            div.appendChild(createTopicImg(newsCategoryImg));
            div.prepend(ul);
            newsSection.appendChild(div);
        }

        tabTopics[index].addEventListener("click", () => {
            newsContentsData.forEach((newsArticleData, newsArticleDataIndex) => {
                const tabTopicIdName = document.getElementById(tabTopics[index].id).id;
                const currentNewsSectionElem = document.querySelector(`section[aria-hidden="false"]`);
                const currentNewsContentAncorElem = document.querySelectorAll(`section[aria-hidden="false"] a`);
                const currentNewsContentImgElem = document.querySelector(".tabTopicImg > img");

                currentNewsSectionElem.id = `${"tabpanelTopics" + (index + 1)}`;
                currentNewsSectionElem.setAttribute("aria-labelledby", tabTopicIdName);
                currentNewsContentImgElem.src = newsCategoryImg;

                currentNewsContentAncorElem[newsArticleDataIndex].textContent = newsArticleData.title;
            })
        })
    })
}

const createSection = (tabTopics, index) => {
    const section = document.createElement("section");
    const tabTopicElem = document.getElementById(tabTopics[index].id);
    const tabIdName = tabTopicElem.id;

    section.id = `${"tabpanelTopics" + (index + 1)}`;
    section.setAttribute("aria-labelledby", tabIdName);
    section.setAttribute("aria-hidden", "false");
    section.setAttribute("roll", "tabpanel")

    return section;
}

const createTopicImg = (imgPath) => {
    const img = document.createElement("img");
    const div = document.createElement("div");

    div.classList = "tabTopicImg";
    img.src = imgPath;
    img.width = "350";
    img.height = "250";

    div.appendChild(img);
    return div;
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
