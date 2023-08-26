const productList = document.getElementById('productList');
const prevBtn = document.getElementById('pagePrevBtn');
const nextBtn = document.getElementById('pageNextBtn');
const mobileCurrentPage = document.getElementById('mobileCurrentPage');
const pageLists = document.getElementById('pageLists');

const viewSearchData = async () => {
  const api = await fetch(`/searches${window.location.search}`);
  const result = await api.json();

  const currentPage = result.page;
  const lastPage = Math.ceil(result.count / 12);
  const maxPage = Math.ceil(lastPage / 5) * 5;

  /* 현재 페이지가 최소값일 경우 이전 버튼 삭제 */
  if (currentPage === 1) {
    prevBtn.remove();
  } else {
    prevBtn.setAttribute('href', '/search?' + window.location.search.replace('&page=' + currentPage, '').replace('?', '') + '&page=' + (currentPage - 1));
  }

  /* 현재 페이지가 최대값일 경우 다음 버튼 삭제 */
  if (currentPage === lastPage) {
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
};

viewSearchData();
