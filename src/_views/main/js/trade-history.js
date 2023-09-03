const tradingProductsEl = document.querySelector('#trading');
const tradeCompletedProductsEl = document.querySelector('#trade-completed');
loadTradedProducts();

async function loadTradedProducts() {
  const result = await callApi('/products/trade-history');
  if (result === null) return;

  result.forEach((_product) => {
    const { id: productId, name, price, status, product_image } = _product;
    const productEl = document.createElement('div');
    const completeBtnHtml = `<button data-product-id=${productId} type="button" class="btn btn-success btn-icon complete-trade">
                              거래완료
                            </button>`;
    const reviewBtnHtml = _product.review_id
      ? `<button data-product-id=${productId} type="button" class="btn btn-accent btn-shadow write-review">
          리뷰쓰기
        </button>`
      : `<button type="button" class="btn btn-secondary disabled ">
          리뷰 작성됨
        </button>`;
    const productHtml = `<div class="d-block d-sm-flex align-items-center py-4 border-bottom">
                    <!-- 링크 이미지 -->
                    <a class="d-block mb-3 mb-sm-0 me-sm-4 ms-sm-0 mx-auto" href="/product/${productId}" style="width: 12.5rem"
                    ><img class="rounded-3" src=${product_image} alt="Product"
                    /></a>
                    <div class="text-center text-sm-start">
                        <!-- 제목 -->
                        <h3 class="h6 product-title mb-2"><a href="/product/${productId}">${name}</a></h3>
                        <!-- 가격 -->
                        <div class="d-inline-block text-accent">${price}원</div>
                        <!-- 버튼 -->
                        <div id="buttons" class="d-flex justify-content-sm-start pt-3">
                            ${status === 1 ? completeBtnHtml : reviewBtnHtml}
                        </div>
                      </div>
                    </div>`;

    productEl.innerHTML = productHtml;

    if (status === 1) {
      tradingProductsEl.appendChild(productEl);
      return;
    }

    tradeCompletedProductsEl.appendChild(productEl);
  });
  const completeTradeButtons = document.querySelectorAll('.complete-trade');
  completeTradeButtons.forEach((Btn) => {
    Btn.addEventListener('click', completeTrade);
  });

  const writeReviewButtons = document.querySelectorAll('.write-review');
  writeReviewButtons.forEach((Btn) => {
    Btn.addEventListener('click', writeReview);
  });
}

async function callApi(url, method = 'GET', bodyData = null) {
  try {
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };

    // POST 요청인 경우 body 데이터 추가
    if (bodyData !== null) options.body = JSON.stringify(bodyData);

    let response = await fetch(url, options);

    // 서버 응답에 문제가 있다면 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function completeTrade(e) {
  const productId = e.target.getAttribute('data-product-id');
  const result = await callApi(`trades/complete/${productId}`, 'PATCH');
  if (result === null) return;
  location.reload();
}

async function writeReview(e) {
  const productId = e.target.getAttribute('data-product-id');

  // Remove all existing review forms
  document.querySelectorAll('.review-form').forEach((form) => form.remove());
  // Check if the review form already exists for this product
  if (document.querySelector(`#review-form-${productId}`)) return;

  // Create review form
  const reviewFormHtml = `
    <div class="col-lg-12 mt-2 pt-4 mt-md-0 pt-md-0 review-form">
      <div class="bg-secondary py-grid-gutter px-grid-gutter rounded-3">
        <h3 class="h4 pb-2">후기 작성</h3>
        <form class="needs-validation" id="review-form-${productId}" method="post" novalidate>
          <div class="mb-3">
            <!-- <label class="form-label" for="review-text">리뷰</label> -->
            <textarea class="form-control" rows="6" required id="review-text"></textarea>
            <div class="invalid-feedback">내용을 입력하세요!</div>
            <small class="form-text text-muted">최소 50자 이상 입력해주세요</small>
          </div >
          <div class = 'text-end'>
          <button data-product-id=${productId} type='button' 
                  onClick='submitReview(event)' 
                  class='btn btn-success btn-shadow d-inline-block'>
              작성하기
          </button>

          <button data-product-id=${productId} type='button' 
                  onClick='cancelReview(event)'                  
                  class='btn btn-danger btn-shadow d-inline-block'>
              취소
          </button>
          </div>
        </form>
      </div>
    </div>`;

  // Append the review form to the product div
  const productDiv = e.target.closest('.d-block.d-sm-flex.align-items-center.py-4.border-bottom');
  productDiv.insertAdjacentHTML('afterend', reviewFormHtml);
}

function cancelReview(e) {
  const productId = e.target.getAttribute('data-product-id');
  const formEl = document.querySelector(`#review-form-${productId}`);
  formEl.parentElement.parentElement.remove();
}

async function submitReview(e) {
  const productId = e.target.getAttribute('data-product-id');
  const reviewText = document.querySelector(`#review-form-${productId} #review-text`).value;
  // if (reviewText.length < 50) {
  //   alert('최소 50자 이상 입력해주세요');
  //   return;
  // }
  const result = await callApi(`/reviews/${productId}`, 'POST', { content: reviewText });
  if (result === null) return;

  location.reload();
}
