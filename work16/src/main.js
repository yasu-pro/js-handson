import './style.scss';
import { differenceInCalendarDays } from 'date-fns';

const REQUEST_URL = "https://mocki.io/v1/a9932f2b-87fe-4ac0-b13c-ccc20e883e61";

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
  renderNewsTab(responseJsonData.data);
  renderNewsContent(responseJsonData.data);
  clickedTabEvent(responseJsonData.data);
}

const request = async () => {
  const response = await fetch(REQUEST_URL, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    displayErrorMessage(`${response.status}:${response.statusText}`);
  } else {
    return response.json();
  }
}

const displayErrorMessage = (error) => {
  const p = document.createElement("p");
  p.textContent = error;
  document.body.prepend(p);
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

    li.ariaSelected = isInitialDisplay;
    li.setAttribute("roll", "tab");
    li.id = `${"js_tabTopics" + ++newsCategoryIndex}`;
    li.classList = "tabTopics";

    a.textContent = newsCategoryObj.field
    a.href = "#"

    li.appendChild(a);
    fragment.appendChild(li);
  });
  tabList.appendChild(fragment);
}

const renderNewsContent = (newsDataArray) => {
  newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
    const tabTopics = document.querySelectorAll(".tabTopics");
    const newsSection = createSection(tabTopics, newsCategoryIndex);
    const newsContentsData = newsCategoryObj.contents;
    const newsCategoryImg = newsCategoryObj.img;
    let isInitialDisplay = newsCategoryObj.isInitialDisplay;

    if (isInitialDisplay) {
      const div = document.createElement("div");

      div.classList = "tabpanelTopics_wrap";
      div.id = "js_tabpanelTopics_wrap";

      document.getElementById("js_tabList").after(newsSection);
      div.appendChild(createTopicImg(newsCategoryImg));
      div.prepend(createArticle(newsContentsData));

      newsSection.appendChild(div);
    }
  })
}

const createArticle = (newsContentsData) => {
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

    if (commentArray.length > 0) {
      li.append(createCommentIcon(commentArray));
    }

    if (isLatestArticles(newsArticleData)) {
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

const removeTabPanel = () => {
  document.getElementById("js_tabpanelTopics_wrap").textContent = "";
}

const clickedTabEvent = (newsDataArray) => {
  newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
    const tabTopics = document.querySelectorAll(".tabTopics");
    tabTopics[newsCategoryIndex].addEventListener("click", (event) => {

      removeTabPanel();

      const sectionElem = document.querySelector("section");
      const tabpanelTopicsWrap = document.querySelector(".tabpanelTopics_wrap");
      const selectedTab = document.querySelector('[aria-selected="true"]');

      const clickedArticleContent = newsDataArray[newsCategoryIndex].contents;
      const clickedTopicImg = newsCategoryObj.img

      sectionElem.id = `tabpanelTopics${newsCategoryIndex + 1}`;
      sectionElem.setAttribute("aria-labelledby", `js_tabTopics${newsCategoryIndex + 1}`)
      selectedTab.ariaSelected = false;
      event.currentTarget.ariaSelected = true;

      tabpanelTopicsWrap.prepend(createArticle(clickedArticleContent));
      tabpanelTopicsWrap.appendChild(createTopicImg(clickedTopicImg))
    });
  });
}

init();
