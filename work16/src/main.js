import './style.scss';
import { differenceInCalendarDays } from 'date-fns';

const REQUEST_URL = "https://mocki.io/v1/720cde09-820e-4541-b003-c36cf2f1a414";

// 間違っているURLの場合↓
// const REQUEST_URL = "https://myjson.dit.upm.es/api/bins/ほげほげajy3";
// 空の配列の場合↓
// const REQUEST_URL = "https://mocki.io/v1/242b685f-a3d7-45a8-aeca-0376bd495b89";
// 503エラーの場合↓
// const REQUEST_URL = "https://httpstat.us/503";

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

const displayErrorMessage = (error) => {
  const p = document.createElement("p");
  p.textContent = error;
  document.body.prepend(p);
}

const displayNews = (newsDataArray) => {
  renderNewsTab(newsDataArray);
  renderNewsContent(newsDataArray);
}

const renderLoadingImg = () => {
  const div = document.createElement("div");
  const img = document.createElement("img");

  div.classList = "loading_wrap";
  div.id = "js_loading_wrap"
  img.src = "https://i.postimg.cc/k2RLrq7B/loading-circle.gif";
  img.alt = "ローディング画像"

  div.appendChild(img);
  document.body.prepend(div);
}

const renderNewsTab = (newsDataArray) => {
  const tabList = document.getElementById("js_tabList");
  const fragment = document.createDocumentFragment();

  newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    let isInitialDisplay = newsCategoryObj.isInitialDisplay;

    if (isInitialDisplay === "true") {
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

  clickEventChangeTabAttribute();
}

const renderNewsContent = (newsDataArray) => {
  newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
    const tabTopics = document.querySelectorAll(".tabTopics");
    const newsContentsData = newsCategoryObj.contents;
    const newsCategoryImg = newsCategoryObj.img;
    let isInitialDisplay = newsCategoryObj.isInitialDisplay;

    if (isInitialDisplay === "true") {
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
      removeNewIcon();

      newsContentsData.forEach((newsArticleData, categoryNewsArticleDataIndex) => {
        const commentArray = newsArticleData.comments;
        const liElements = document.querySelectorAll(".tabpanelTopics_wrap li");
        const liElement = liElements[categoryNewsArticleDataIndex];

        changeCategoryConetent(newsCategoryIndex, e.currentTarget);
        changeCategoryTitle(newsArticleData, categoryNewsArticleDataIndex);
        changeCategoryImg(newsCategoryImg);

        if (commentArray.length > 0) {
          liElement.append(createCommentIcon(commentArray));
        }

        if (isLatestArticles(newsArticleData) === true) {
          const h1Elements = document.querySelectorAll(".tabpanelTopics_wrap h1");
          const h1Element = h1Elements[categoryNewsArticleDataIndex];
          h1Element.insertAdjacentElement("afterend", createNewIcon());
        }
      })
    })
  })
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

    if (isLatestArticles(newsArticleData) === true) {
      h1.insertAdjacentElement("afterend", createNewIcon());
    }

    fragment.appendChild(li);
  })
  ul.appendChild(fragment);

  return ul;
}

const createNewIcon = () => {
  const span = document.createElement("span");

  span.classList = "newIcon";
  span.textContent = "NEW"

  return span;
}

const createCommentIcon = (commentArray) => {
  const div = document.createElement("div");
  const spanLayers = document.createElement("span");
  const i = document.createElement("i");
  const spanCounter = document.createElement("span");

  div.classList = "commentIcon";
  spanLayers.classList = "fa-layers fa-fw";
  i.classList = "fa fa-light fa-comment faa-vertical animated";
  spanCounter.classList = "fa-layers-counter";

  spanCounter.textContent = `${commentArray.length}`;

  spanLayers.appendChild(i);
  spanLayers.appendChild(spanCounter)
  div.appendChild(spanLayers);

  return div;
}

const createSection = (tabTopics, index) => {
  const section = document.createElement("section");
  const tabTopicElem = document.getElementById(tabTopics[index].id);
  const tabIdName = tabTopicElem.id;

  section.id = `${"tabpanelTopics" + (index + 1)} `;
  section.setAttribute("aria-labelledby", tabIdName);
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

const changeCategoryTitle = (newsArticleData, categoryNewsArticleDataIndex) => {
  const currentNewsContentAncorElements = document.querySelectorAll(`section[roll="tabpanel"] a`);
  currentNewsContentAncorElements[categoryNewsArticleDataIndex].textContent = newsArticleData.title;
}

const changeCategoryImg = (newsCategoryImg) => {
  const currentNewsContentImgElem = document.querySelector(".tabTopicImg > img");
  currentNewsContentImgElem.src = newsCategoryImg;
}

const changeCategoryConetent = (newsCategoryIndex, clickedTabElement) => {
  const tabTopicIdName = clickedTabElement.id;
  const currentNewsSectionElem = document.querySelector(`section[roll="tabpanel"]`);

  currentNewsSectionElem.id = `${"tabpanelTopics" + (newsCategoryIndex + 1)}`;
  currentNewsSectionElem.setAttribute("aria-labelledby", tabTopicIdName);
}

const removeCommentIcon = () => {
  const commentIconWrapElements = document.querySelectorAll(".commentIcon");
  for (let i = 0; i < commentIconWrapElements.length; i++) {
    commentIconWrapElements[i].remove();
  }
}

const removeNewIcon = () => {
  const newIconElements = document.querySelectorAll(".newIcon");
  for (let i = 0; i < newIconElements.length; i++) {
    newIconElements[i].remove();
  }
}

const hideLoadingImg = () => {
  document.getElementById("js_loading_wrap").remove();
}

const isLatestArticles = (newsArticleData) => {
  const PERIODOFLATESTARTICLES = 3;
  const newsArticleDate = newsArticleData.date;

  const nowDate = new Date();
  const postDate = new Date(newsArticleDate);

  const periodOfDays = differenceInCalendarDays(nowDate, postDate);
  const result = periodOfDays <= PERIODOFLATESTARTICLES;

  return result;
}

const clickEventChangeTabAttribute = () => {
  const tabTopics = document.querySelectorAll(".tabTopics");
  for (let i = 0; i < tabTopics.length; i++) {
    tabTopics[i].addEventListener("click", (event) => {
      const selectedTab = document.querySelector('[aria-selected="true"]');
      selectedTab.ariaSelected = false;
      event.currentTarget.ariaSelected = true;
    });
  }
}

init();
