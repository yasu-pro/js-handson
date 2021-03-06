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
  div.id = "js-loading_wrap"
  img.src = "https://i.postimg.cc/k2RLrq7B/loading-circle.gif";
  img.alt = "ローディング画像"

  div.appendChild(img);
  document.body.prepend(div);
}

const renderNewsTab = (newsDataArray) => {
  const tabList = document.getElementById("js-tabList");
  const fragment = document.createDocumentFragment();

  newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    let isInitialDisplay = newsCategoryObj.isInitialDisplay;

    li.ariaSelected = isInitialDisplay;
    li.setAttribute("roll", "tab");
    li.id = `${"js-tabTopics" + ++newsCategoryIndex}`;
    li.classList = "tabTopics";

    a.textContent = newsCategoryObj.field
    a.href = "#"

    li.appendChild(a);
    fragment.appendChild(li);
  });
  tabList.appendChild(fragment);
}

const renderNewsContent = (newsDataArray) => {
  const fragment = document.createDocumentFragment();
  newsDataArray.forEach((newsCategoryObj, newsCategoryIndex) => {
    const newsContentsData = newsCategoryObj.contents;
    const newsCategoryImg = newsCategoryObj.img;
    let isInitialDisplay = newsCategoryObj.isInitialDisplay;

    if (isInitialDisplay) {
      const div = document.createElement("div");

      div.classList = "tabpanelTopics_wrap";
      div.id = "js-tabpanelTopics_wrap";

      fragment
        .appendChild(createSection(newsCategoryIndex))
        .appendChild(div)
        .appendChild(createArticle(newsContentsData))
        .after(createTopicImg(newsCategoryImg))
    }
    document.getElementById("js-tabList").after(fragment);
  });
};

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

const createSection = (index) => {
  const section = document.createElement("section");

  section.id = "js-tabpanel";
  section.setAttribute("aria-labelledby", `js-tabTopics${index + 1}`);
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
  document.getElementById("js-loading_wrap").remove();
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
  document.getElementById("js-tabpanelTopics_wrap").textContent = "";
}

const clickedTabEvent = (newsDataArray) => {
  const tabTopics = [...document.querySelectorAll(".tabTopics")];
  tabTopics.forEach(tab => {
    tab.addEventListener("click", (event) => {
      removeTabPanel();
      const selectedTab = document.querySelector('[aria-selected="true"]');
      selectedTab.ariaSelected = false;
      event.currentTarget.ariaSelected = true;

      const clickedTabIndex = tabTopics.indexOf(event.currentTarget);
      const tabpanelTopicsWrap = document.querySelector(".tabpanelTopics_wrap");
      tabpanelTopicsWrap.prepend(createArticle(newsDataArray[clickedTabIndex].contents));
      tabpanelTopicsWrap.appendChild(createTopicImg(newsDataArray[clickedTabIndex].img));

      const sectionElem = document.getElementById("js-tabpanel");
      sectionElem.setAttribute("aria-labelledby", `js-tabTopics${clickedTabIndex + 1}`);
    })
  });
}

init();
