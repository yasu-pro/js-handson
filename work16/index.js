
const REQUEST_URL = "https://mocki.io/v1/21ee587f-5a59-40ff-98c6-46b2d4715f25"

// 間違っているURLの場合↓
// const REQUEST_URL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const REQUEST_URL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
// const REQUEST_URL = "https://httpstat.us/503";

const request = async () => {
    const response = await fetch(REQUEST_URL, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error(`${response.status}:${response.statusText}`);
    } else {
        return response.json();
    }
}

const init = async () => {
    renderLoadingImg();

    let responseJsonData;

    try {
        responseJsonData = await request();

        if (!responseJsonData) {
            return;
        }
    } catch (error) {
        displayErrorMessage(error.message);
    }
    finally {
        hideLoadingImg();
    }

    if (!responseJsonData.data.length) {
        displayErrorMessage("data is empty");
        return;
    }
    displayNews(responseJsonData.data);
}

const displayErrorMessage = (error) => {
    const p = document.createElement("p");
    p.textContent = error;
    document.body.prepend(p);
}

const displayNews = (newsDataArray) => {
    renderNewsTab(newsDataArray);
    renderNewsContent(newsDataArray);
}

const renderNewsTab = (newsDataArray) => {
    const tabList = document.getElementById("js_tabList");
    const fragment = document.createDocumentFragment();

    newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        if (!newsCategoryIndex) {
            li.setAttribute("aria-selected", true);
        } else {
            li.setAttribute("aria-selected", false);
        }
        li.setAttribute("roll", "tab");
        li.id = `${"js_tabTopics" + ++newsCategoryIndex}`;
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
    newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
        const tabTopics = document.querySelectorAll(".tabTopics");
        const newsContentsData = newsCategoryObj.contents;
        const newsCategoryImg = newsCategoryObj.img;

        if (!newsCategoryIndex) {
            const div = document.createElement("div");
            const newsSection = createSection(tabTopics, newsCategoryIndex);

            div.classList = "tabpanelTopics_wrap";

            document.getElementById("js_tabList").after(newsSection);
            div.appendChild(createTopicImg(newsCategoryImg));
            div.prepend(renderArticle(newsContentsData, newsCategoryIndex));

            newsSection.appendChild(div);
        }

        tabTopics[newsCategoryIndex].addEventListener("click", (e) => {
            removeCommentIcon();

            newsContentsData.forEach((newsArticleData, categoryNewsArticleDataIndex) => {
                const commentArray = newsArticleData.comments;

                changeCategoryConetent(newsCategoryIndex, clickedTabElement = e.currentTarget);
                changeCategoryTitle(newsArticleData, categoryNewsArticleDataIndex);
                changeCategoryImg(newsCategoryImg);

                if (commentArray.length !== 0) {
                    const liElements = document.querySelectorAll(".tabpanelTopics_wrap li");
                    const liElement = liElements[categoryNewsArticleDataIndex];

                    liElement.append(createCommentIcon(commentArray));
                }
            })
        })
    })
}

const removeCommentIcon = () => {
    const commentIconWrapElements = document.querySelectorAll(".commentIcon_wrap");
    for (let k = 0; k < commentIconWrapElements.length; k++) {
        commentIconWrapElements[k].remove();
    }
}

const changeCategoryTitle = (newsArticleData, categoryNewsArticleDataIndex) => {
    const currentNewsContentAncorElements = document.querySelectorAll(`section[aria-hidden="false"] a`);
    currentNewsContentAncorElements[categoryNewsArticleDataIndex].textContent = newsArticleData.title;
}

const changeCategoryImg = (newsCategoryImg) => {
    const currentNewsContentImgElem = document.querySelector(".tabTopicImg > img");
    currentNewsContentImgElem.src = newsCategoryImg;
}

const changeCategoryConetent = (newsCategoryIndex, clickedTabElement) => {
    const tabTopicIdName = clickedTabElement.id;
    const currentNewsSectionElem = document.querySelector(`section[aria-hidden="false"]`);

    currentNewsSectionElem.id = `${"tabpanelTopics" + (newsCategoryIndex + 1)}`;
    currentNewsSectionElem.setAttribute("aria-labelledby", tabTopicIdName);
}

const renderArticle = (newsContentsData) => {
    const ul = document.createElement("ul");
    const fragment = document.createDocumentFragment();

    newsContentsData.forEach(newsArticleData => {
        const li = document.createElement("li");
        const h1 = document.createElement("h1");
        const a = document.createElement("a");

        const title = newsArticleData.title;
        const commentArray = newsArticleData.comments;

        a.href = "#";
        a.textContent = title;

        h1.appendChild(a)
        li.appendChild(h1);

        if (commentArray.length !== 0) {
            li.append(createCommentIcon(commentArray));
        }
        fragment.appendChild(li);
    })
    ul.appendChild(fragment);

    return ul;
}

const createCommentIcon = (commentArray) => {
    const div = document.createElement("div");

    div.classList = "commentIcon_wrap";
    div.insertAdjacentHTML("beforeend",
        `<span class="fa-layers fa-fw">
            <i class="fa fa-light fa-comment faa-vertical animated"></i>
            <span class= "fa-layers-counter" > ${commentArray.length}</span>
        </span>`
    );

    return div;
}

const createSection = (tabTopics, index) => {
    const section = document.createElement("section");
    const tabTopicElem = document.getElementById(tabTopics[index].id);
    const tabIdName = tabTopicElem.id;

    section.id = `${"tabpanelTopics" + (index + 1)} `;
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
