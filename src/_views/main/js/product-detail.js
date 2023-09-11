const productId = window.location.pathname.split('/product/')[1];
const productImageEl = document.querySelector('#product-image');
const nameEl = document.querySelector('#product-name');
const priceEl = document.querySelector('#product-price');
const contentEl = document.querySelector('#product-content');
const memberProfileImageEl = document.querySelector('#member-profile-image');
const memberNicknameEl = document.querySelector('#member-nickname');
const reviewerProfileImageEl = document.querySelector('#reviewer-profile-image');
const reviewerNicknameEl = document.querySelector('#reviewer-nickname');
const reviewContentEl = document.querySelector('#review-content');
const reviewUpdatedAtEl = document.querySelector('#review-updated-at');
const smallImageGalleryEl = document.querySelector('#small-image-gallery');
const categoryEl = document.querySelector('#small-category');
const productReviewEl = document.querySelector('.product-review');
const resister = document.getElementById('resister');
const updated = document.getElementById('updated');
const productStatus = document.getElementById('productStatus');
const payButton = document.getElementById('payButton');

loadProduct();
async function loadProduct() {
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();

// updateAt쪽이 리뷰와 상품쪽이랑 겹쳐서 상품쪽만 변경
  const { productImages, price, name: productName, content, createdAt, updatedAt: productUpdatedAt } = result;
  /** 최근본 상품 로컬스토리지  **/
  const product = {
    id: productId,
    product_image: productImages[0].imageUrl,
    product_name: productName
  };
// 기존에 저장된 viewedProducts 데이터 가져오기
  let viewedProducts = localStorage.getItem('viewedProducts');
  if (!viewedProducts) {
    // 만약 데이터가 없다면 빈 배열로 초기화하기
    viewedProducts = [];
  } else {
    // 데이터가 있다면 파싱하여 사용하기
    viewedProducts = JSON.parse(viewedProducts);
  }
// 새로운 상품 정보 추가하기
  viewedProducts.push(product);
// 변경된 데이터 다시 저장하기
  localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));

  console.log(result);
  if (result.trades.length === 0) {
    productStatus.innerText = '거래없음';
  } else {
    const tradeStatus = result.trades[0].status;
    if (tradeStatus === 1) {
      productStatus.innerText = '거래중';
      payButton.disabled = true;
    } else if (tradeStatus === 2) {
      productStatus.innerText = '거래완료';
      payButton.disabled = true;
    } else {
      productStatus.innerText = '거래없음';
    }
  }


  const { profileImage, nickname: memberNickname } = result.member;

  const { name: categoryName } = result.smallCategory;

  if (result.trades.length === 0 || !result.trades[0].review) {
    productReviewEl.innerHTML = '';
  } else {
    const { nickname: reviewerNickname, profileImage: reviewerProfile } = result.trades[0].member;
    const { id: reviewId, content: reviewContent, updatedAt } = result.trades[0].review;
    reviewerProfileImageEl.src = reviewerProfile;
    reviewerNicknameEl.innerHTML = reviewerNickname;
    reviewContentEl.innerHTML = reviewContent;
    reviewDeleteBtn.setAttribute('data-review-id', reviewId);

    // 년 월 일만 출력
    var date_obj = new Date(updatedAt);
    var reviewUpdatedAt = date_obj.toISOString().split('T')[0];
    reviewUpdatedAtEl.innerHTML = reviewUpdatedAt;
  }

  productImageEl.src = productImages[0].imageUrl;
  nameEl.innerText = productName;
  contentEl.innerText = content;
  priceEl.innerText = price.toLocaleString() + '원';
  memberProfileImageEl.src = profileImage;
  memberNicknameEl.innerText = memberNickname;
  categoryEl.innerText = categoryName;
  // resister.innerText = new Date(createdAt).toLocaleString();
  // updated.innerText = new Date(updatedAt).toLocaleString();
  function timeAgo(dateParam){
    const now = new Date()
    const past = new Date(dateParam)
    const msPerMinute = 60 * 1000
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24

    const elapsed = now - past

    if(elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + ' 초전'
    }
    else if(elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' 분전'
    }
    else if(elapsed < msPerDay){
      return Math.round(elapsed/msPerHour) +' 시간전'
    }
    else {
      return Math.round(elapsed/msPerDay) + ' 일전'
    }
  }
  resister.innerText = timeAgo(createdAt)
  updated.innerText = timeAgo(productUpdatedAt)

  // 이미지가 두장 이상일경우
  if (productImages.length >= 2) {
    const smallImageGallery = document.createElement('div');
    smallImageGallery.setAttribute('class', 'row');

    for (let i = 1; i < productImages.length; i++) {
      const imageUrl = productImages[i].imageUrl;
      const smallImage = document.createElement('div');
      smallImage.setAttribute('class', 'col-sm-6');
      smallImage.innerHTML = `<a
                            class="gallery-item rounded-3 mb-grid-gutter smallImage"
                            href="img/marketplace/single/02.jpg"
                            data-sub-html='&lt;h6 class="fs-sm text-light"&gt;UI Psd iPhone X Monochrome&lt;/h6&gt;'
                          >
                            <img src=${imageUrl} alt="Gallery preview" />
                            <span class="gallery-item-caption">UI Psd iPhone X Monochrome</span>
                          </a>`;

      smallImageGalleryEl.appendChild(smallImage);
    }
    const smallImages = document.querySelectorAll('.smallImage img');
    smallImages.forEach((img) => {
      img.style.width = '380px';
      img.style.height = '308px';
    });
  }
}

// 리뷰 삭제
const reviewDeleteBtn = document.querySelector('#review-delete');
reviewDeleteBtn.addEventListener('click', deleteReview);

async function deleteReview() {
  const reviewId = reviewDeleteBtn.getAttribute('data-review-id');
  const result = await callApi(`/reviews/${reviewId}`, 'DELETE');
  if (result === null) return;
  location.reload();
}

// 리뷰 수정 폼 보여주기
const reviewEditBtn = document.querySelector('#review-edit');
reviewEditBtn.addEventListener('click', editReview);

async function editReview() {
  reviewEditBtn.classList.add('d-none');
  reviewDeleteBtn.classList.add('d-none');
  const reviewContentWrapper = document.querySelector('#review-content-wrapper');
  reviewContentWrapper.innerHTML = `<div>
                                      <div class="mb-3">
                                      
                                        <textarea class="form-control" rows="6" required id="review-edit-content"></textarea>
                                        
                                      </div>
                                      

                                      <button id="edit" class="btn btn-primary btn-shadow d-block w-100" type="click">수정</button><br>
                                    </div>`;

  // 리뷰 수정
  const updateReviewBtn = document.querySelector('#edit');
  updateReviewBtn.addEventListener('click', updateReview);

  async function updateReview() {
    console.log('수정하기');
    const reviewId = reviewDeleteBtn.getAttribute('data-review-id');
    const reviewEditContent = document.querySelector('#review-edit-content');
    const data = {
      content: reviewEditContent.value,
    };
    const result = await callApi(`/reviews/${reviewId}`, 'PATCH', data);
    if (result === null) return;
    location.reload();
  }
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

//결제버튼 이벤트
payButton.addEventListener('click', function () {
  window.location.href = `/payment/${productId}`;
});
