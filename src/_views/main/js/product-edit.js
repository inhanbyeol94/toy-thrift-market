console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴');

const productId = window.location.pathname.split('/')[2];
// const productImageEl = document.querySelector('#product-image');

const largeCategoryOptionEl = document.querySelector('#unp-category-large');
const middleCategoryOptionEl = document.querySelector('#unp-category-middle');
const smallCategoryOptionEl = document.querySelector('#unp-category-small');

// const smallCategoryId = smallCategoryOptionEl;
const productName = document.querySelector('#unp-product-name');
const contentEl = document.querySelector('#unp-product-description');
const priceEl = document.querySelector('#unp-standard-price');

loadProduct();
async function loadProduct() {
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();
  if (!response.ok) {
    console.log(result.message);
    return;
  }
  const { name, content, price, small_category_id } = result;
  productName.value = name;
  contentEl.value = content;
  priceEl.value = price;
  //   productImageEl.setAttribute('src', result.productImages[0].imageUrl);
  loadCategories(small_category_id);
}
const NO_CATEGORY_OPTION = '<option value="0">카테고리 선택</option>';

// 상품의 카테고리를 미리 세팅한다.
async function loadCategories(_smallCategoryId) {
  const response = await fetch('/categories/large');
  const largeCategories = await response.json();
  const middleCategories = [];
  largeCategories.forEach((large) => {
    middleCategories.push(...large.middleCategories);
  });
  const smallCategoryWithParent = await fetch(`/categories/small/${_smallCategoryId}/parent`);
  const data = await smallCategoryWithParent.json();
  const _largeCategoryId = data.middleCategory.largeCategory.id;
  const _middleCategoryId = data.middleCategory.id;

  // 현재 카테고리 세팅
  generateCategories(largeCategories, largeCategoryOptionEl);
  largeCategoryOptionEl.value = _largeCategoryId;
  setMiddleCategories(_largeCategoryId);
  middleCategoryOptionEl.value = _middleCategoryId;
  setSmallCategories(_middleCategoryId);

  smallCategoryOptionEl.value = _smallCategoryId;

  // 라지 카테고리 선택 시, 하위 미들 카테고리 옵션 생성
  largeCategoryOptionEl.addEventListener('change', () => {
    const largeCategoryId = largeCategoryOptionEl.value;
    setMiddleCategories(largeCategoryId);
  });

  // 미들 카테고리 선택 시, 하위 스몰 카테고리 옵션 생성
  middleCategoryOptionEl.addEventListener('change', () => {
    const middleCategoryId = middleCategoryOptionEl.value;
    setSmallCategories(middleCategoryId);
  });

  // 미들 카테고리 옵션 생성 함수
  function setMiddleCategories(largeCategoryId) {
    emptyMiddleOptions();
    emptySmallOptions();
    if (largeCategoryId === '0') return;
    // 에러
    const selectedLarge = largeCategories.find((large) => large.id === largeCategoryId);
    generateCategories(selectedLarge.middleCategories, middleCategoryOptionEl);
  }

  // 스몰 카테고리 옵션 생성 함수
  function setSmallCategories(middleCategoryId) {
    emptySmallOptions();
    if (middleCategoryId === '0') return;

    const selectedMiddle = middleCategories.find((middle) => middle.id === middleCategoryId);
    generateCategories(selectedMiddle.smallCategories, smallCategoryOptionEl);
  }
}

// 카테고리 옵션 생성 함수
function generateCategories(categories, categoryElement) {
  categories.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    categoryElement.appendChild(optionElement);
  });
}

function emptyMiddleOptions() {
  middleCategoryOptionEl.innerHTML = NO_CATEGORY_OPTION;
}

function emptySmallOptions() {
  smallCategoryOptionEl.innerHTML = NO_CATEGORY_OPTION;
}

// ============================ 상품 수정 로직 ============================ //

const form = document.querySelector('form');
const imageUpload = document.querySelector('#imageUpload');
let formData = new FormData();

//-- 상품 추가하기
form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const smallCategoryId = smallCategoryOptionEl.value;
    const productName = document.querySelector('#unp-product-name').value;
    const content = document.querySelector('#unp-product-description').value;
    const price = document.querySelector('#unp-standard-price').value;
    if (smallCategoryId === '0') return alert('카테고리를 선택해주세요.');

    formData.append('smallCategoryId', smallCategoryId);
    formData.append('name', productName);
    formData.append('content', content);
    formData.append('price', price);

    const response = await fetch(`/products`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to post products');
    }
    const result = await response.json();
    location.href = `/product/${result.id}`;
  } catch (error) {
    console.error('Error posting products:', error);
  }
});

// formData에 이미지 할당
imageUpload.addEventListener('change', async (e) => {
  previewImages();
  // s3에 저장 후 url반환하기

  console.log(e.target.files[0].type);
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 이미지 파일 사이즈 검사
    if (file.size > 1 * 1024 * 1024) {
      alert('파일용량은 최대 1mb입니다.');
      return;
    }
    // 확장자 검사
    if (!file.type.includes('jpeg') && !file.type.includes('png')) {
      alert('jpeg 또는 png 파일만 업로드 가능합니다!');
      return;
    }
    formData.append('images', file);
  }
});

// 이미지 미리보기 메서드
function previewImages() {
  // 요소 할당
  let inputEl = document.getElementById('imageUpload');
  let previewEl = document.getElementById('imagePreview');
  previewEl.innerHTML = ''; // 미리보기 지우기

  // 반복문
  for (let file of inputEl.files) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let img = document.createElement('img');
      img.src = e.target.result;
      //   img.style.width = '100px';
      //   img.style.height = '100px';
      //   img.style.margin = '10px';
      previewEl.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}
