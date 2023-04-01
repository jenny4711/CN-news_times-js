// api key FhB1kRYynAfupADuyHWKxWofbihyzFy3w-yg0KqFBs4
// Qapg-UqPwZcLdzQmb8Kkg9fBRhdF4M7CiXJ1ulAehKY
// e9e6b1a12aa54dd5bff096fc2f99ee54
let news = [];

let page = 1;
let total_page = 1;

const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (evt) => getNewsByTopic(evt))
);
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="role">${message}</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

let searchBtn = document.getElementById("searchBtn");
let url;
const getNews = async () => {
  try {
    url.searchParams.set("page", page);

    let res = await fetch(url);
    let data = await res.json();
    console.log(data);
    total_page = data.totalResults;
    pagination();

    if (res.status == 200) {
      news = data.articles;
      render();
      pagination();
      if (news.length === 0) {
        throw new Error("검색된 결과 값이 없습니다. ");
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는 ", error.message);
    errorRender(error.message);
  }
};

const getLatestnews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=e9e6b1a12aa54dd5bff096fc2f99ee54`
  );

  await getNews();
};

const getNewsByTopic = async (evt) => {
  let topic = evt.target.textContent.toLowerCase();
  console.log(topic);
  url = new URL(
    `https://newsapi.org/v2/top-headlines?category=${topic}&country=us&pageSize=5&apiKey=e9e6b1a12aa54dd5bff096fc2f99ee54`
  );

  await getNews();
};

const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-input").value;

  url = new URL(
    `https://newsapi.org/v2/everything?q=${keyword}&from=2023-03-27&sortBy=popularity&pageSize=5&apiKey=e9e6b1a12aa54dd5bff096fc2f99ee54`
  );

  await getNews();
};

const render = () => {
  let newsHTML = "";

  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
        <img class="news-img" src="${item.urlToImage}"/>
    </div>
    <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div>
          ${item.author} * ${item.publishedAt}
        </div>
    </div>
</div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const pagination = () => {
  let pagenationHTML = ``;

  // total page
  // page
  let pageGroup = Math.ceil(page / 8);
  console.log(pageGroup, "playing");
  // page group
  let last = pageGroup * 8;
  console.log(last, "last");

  // last page
  let first = last - 7;
  console.log(first, "first");

  // first page
  pagenationHTML += ` <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 7
  })">
    <span class=${page == 1 ? "hide" : ""} aria-hidden="true">&laquo;</span>
  </a>
</li>`;

  pagenationHTML += ` <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
      page - 1
    })">
      <span class=${page == 1 ? "hide" : ""} aria-hidden="true">&lt;</span>
    </a>
  </li>`;
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page === i ? "active" : ""
    } "><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }
  pagenationHTML += `<li class="page-item">
   <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
     page + 1
   })">
     <span class=${page == 8 ? "hide" : ""} aria-hidden="true">&gt;</span>
   </a>
 </li>`;

  pagenationHTML += `<li class="page-item">
 <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
   page + 7
 })">
   <span class=${page == 8 ? "hide" : ""} aria-hidden="true">&raquo;</span>
 </a>
</li>`;

  // first~last page print

  // ---------------------------------------------
  // displayList(news, last, page);
  render();

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = async (pageNum) => {
  // 이동하고싶은 페이지 알고
  page = pageNum;
  // 이동하고싶은 페이지를 가지고 api 호출
  if (page < 1) {
    page = 8;
  } else if (page > 8) {
    page = 1;
  } else {
    page;
  }
  await getNews();
  //
};

searchBtn.addEventListener("click", getNewsByKeyword);
getLatestnews();

// total_page:15
// page:12(11-16)
// 한장에 5개씩 보여주고싶다
// 1-5,6-10,11-16

// 페이지 정보 기준으로 내가 몇번째 그룹인지 안다  Math.ceil(12/5)
// 그 그룹의 첫번째와 마지막페이지를 안다  첫번째 페이지 아는 방밥->마지막 빼기 4 마지막 페이지 아는방법->그룹숫자 *5
// 첫번째부터 마지막 페이지까지 그려준다
