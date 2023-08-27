const productList = document.getElementById('productList');
const prevBtn = document.getElementById('pagePrevBtn');
const nextBtn = document.getElementById('pageNextBtn');
const mobileCurrentPage = document.getElementById('mobileCurrentPage');
const pageLists = document.getElementById('pageLists');
const largeCategoryList = document.getElementById('largeCategoryList');
const middleCategoryList = document.getElementById('middleCategoryList');
const smallCategoryList = document.getElementById('smallCategoryList');
const searchInput = document.getElementById('searchInput');

let categories = [];

const viewSearchData = async () => {
  const category = await fetch('/categories/large');
  categories = await category.json();

  categories.forEach((info) => {
    largeCategoryList.innerHTML += `<li><a class="dropdown-item" href="#" onclick="largeCategoryChange(${info.id},'${info.name}')">${info.name}</a></li>`;
  });

  const api = await fetch(`/searches${window.location.search}`);
  const result = await api.json();

  const currentPage = result.page;
  const lastPage = Math.ceil(result.count / 12);
  const maxPage = Math.ceil(lastPage / 5) * 5;

  /* 현재 페이지가 최소값일 경우 이전 버튼 삭제 */
  if (currentPage === 1 || result.data.length == 0) {
    prevBtn.remove();
  } else {
    prevBtn.setAttribute('href', '/search?' + window.location.search.replace('&page=' + currentPage, '').replace('?', '') + '&page=' + (currentPage - 1));
  }

  /* 현재 페이지가 최대값일 경우 다음 버튼 삭제 */
  if (currentPage === lastPage || result.data.length == 0) {
    nextBtn.remove();
  } else {
    nextBtn.setAttribute('href', '/search?' + window.location.search.replace('&page=' + currentPage, '').replace('?', '') + '&page=' + (currentPage + 1));
  }

  mobileCurrentPage.innerText = `${maxPage - 4} / ${maxPage}`;

  for (let i = Math.ceil(currentPage / 5) * 5 - 4; i <= Math.ceil(currentPage / 5) * 5; i++) {
    if (i <= lastPage) {
      if (i == currentPage) {
        pageLists.innerHTML += `<li class="page-item d-none d-sm-block active" aria-current="page"><a class="page-link" href="${
          '/search?' + window.location.search.replace('&page=' + currentPage, '').replace('?', '') + '&page=' + i
        }">${i}</a></li>`;
      } else {
        pageLists.innerHTML += `<li class="page-item d-none d-sm-block" aria-current="page"><a class="page-link" href="${
          '/search?' + window.location.search.replace('&page=' + currentPage, '').replace('?', '') + '&page=' + i
        }">${i}</a></li>`;
      }
    }
  }

  if (result.data.length == 0) document.getElementById('noDataDiv').style.display = 'block';

  result.data.forEach((info) => {
    productList.innerHTML += `          <!-- Product-->
          <div class="col-lg-3 col-md-4 col-sm-6 px-2 mb-grid-gutter">
            <div class="card product-card-alt">
              <div class="product-thumb">
                <button class="btn-wishlist btn-sm" type="button"><i class="ci-heart"></i></button>
                <a class="product-thumb-overlay" href="#"></a><img src="${info.productImages[0].imageUrl}" style="width: 300px; height:300px; object-fit: cover ">
              </div>
              <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-start pb-2">
                  <div class="text-muted fs-xs me-1">${info.member.nickname}</div>
                  
                </div>
                <h3 class="product-title fs-sm mb-2"><a href="marketplace-single.html">${info.name}</a></h3>
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                  <div class="bg-faded-accent text-accent rounded-1 py-1 px-2" style="font-size: 14px">${info.price.toLocaleString()}원</small></div>
                </div>
              </div>
            </div>
          </div>`;
  });

  const uriArray = window.location.search
    .slice(1)
    .split('&')
    .map((x) => {
      return { [x.split('=')[0]]: x.split('=')[1] };
    });

  let uriObject = {};
  uriArray.forEach((data) => {
    uriObject = { ...uriObject, ...data };
  });

  if (uriObject.largeCategory) {
    const largeData = categories.find((large) => large.id == uriObject.largeCategory);
    largeCategoryChange(largeData.id, largeData.name);
  }
  if (uriObject.middleCategory) {
    const middleData = categories.find((large) => large.id == uriObject.largeCategory).middleCategories.find((middle) => middle.id == uriObject.middleCategory);
    middleCategoryChange(uriObject.largeCategory, middleData.id, middleData.name);
  }

  if (uriObject.smallCategory) {
    const smallData = categories
      .find((large) => large.id == uriObject.largeCategory)
      .middleCategories.find((middle) => middle.id == uriObject.middleCategory)
      .smallCategories.find((small) => (small.id = uriObject.smallCategory));
    smallCategoryChange(smallData.id, smallData.name);
  }

  if (uriObject.product) {
    searchInput.value = decodeURI(uriObject.product);
  }
};
const largeCategoryChange = (largeId, name) => {
  document.getElementById('searchLargeCategory').innerText = name;
  document.getElementById('searchLargeCategory').dataset.id = largeId;

  document.getElementById('searchMiddleCategory').dataset.id = '';
  document.getElementById('searchMiddleCategory').innerText = '중분류';
  document.getElementById('searchSmallCategory').dataset.id = '';
  document.getElementById('searchSmallCategory').innerText = '소분류';

  middleCategoryList.innerHTML = '';
  smallCategoryList.innerHTML = '';

  categories
    .find((e) => e.id == largeId)
    .middleCategories.forEach((middle) => {
      middleCategoryList.innerHTML += `<li><a class="dropdown-item" href="#" onclick="middleCategoryChange(${largeId},${middle.id},'${middle.name}')">${middle.name}</a></li>`;
    });
};

const middleCategoryChange = (largeId, middleId, name) => {
  document.getElementById('searchMiddleCategory').innerText = name;
  document.getElementById('searchMiddleCategory').dataset.id = middleId;

  document.getElementById('searchSmallCategory').dataset.id = '';
  document.getElementById('searchSmallCategory').innerText = '소분류';

  smallCategoryList.innerHTML = '';

  categories
    .find((large) => large.id == largeId)
    .middleCategories.find((middle) => middle.id == middleId)
    .smallCategories.forEach((small) => {
      smallCategoryList.innerHTML += `<li><a class="dropdown-item" href="#" onclick="smallCategoryChange(${small.id},'${small.name}')">${small.name}</a></li>`;
    });
};

const smallCategoryChange = (smallId, name) => {
  document.getElementById('searchSmallCategory').innerText = name;
  document.getElementById('searchSmallCategory').dataset.id = smallId;
};

searchInput.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    // if (!searchInput.value) return alert('상품명을 입력해주세요.');
    const largeCategoryId = document.getElementById('searchLargeCategory').dataset.id;
    const middleCategoryId = document.getElementById('searchMiddleCategory').dataset.id;
    const smallCategoryId = document.getElementById('searchSmallCategory').dataset.id;

    const uri = `/search?${largeCategoryId ? 'largeCategory=' + largeCategoryId + '&' : ''}${middleCategoryId ? 'middleCategory=' + middleCategoryId + '&' : ''}${
      smallCategoryId ? 'smallCategory=' + smallCategoryId + '&' : ''
    }product=${searchInput.value}`;

    window.location.href = uri;
  }
});

viewSearchData();
