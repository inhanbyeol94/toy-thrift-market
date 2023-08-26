const productId = window.location.pathname.split('/')[2];
// const productImageEl = document.querySelector('#product-image');

const largeCategoryOptionEl = document.querySelector('#unp-category-large');
const middleCategoryOptionEl = document.querySelector('#unp-category-middle');
const smallCategoryOptionEl = document.querySelector('#unp-category-small');

// const smallCategoryId = smallCategoryOptionEl;
const productName = document.querySelector('#unp-product-name');
const contentEl = document.querySelector('#unp-product-description');
const priceEl = document.querySelector('#unp-standard-price');
const NO_CATEGORY_OPTION = '<option value="0">카테고리 선택</option>';

// ============================ 상품 정보 받아오기 ============================ //
loadProduct();
async function loadProduct() {
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();
  if (!response.ok) {
    console.log(result.message);
    return;
  }
  const { name, content, price, small_category_id, productImages } = result;
  productName.value = name;
  contentEl.value = content;
  priceEl.value = price;
  loadCategories(small_category_id);
  productImages.forEach((image) => {
    appendImagePreview(image, true);
  });
}

// 카테고리 세팅 함수
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
  setMiddleCategories(_largeCategoryId);
  setSmallCategories(_middleCategoryId);

  largeCategoryOptionEl.value = _largeCategoryId;
  middleCategoryOptionEl.value = _middleCategoryId;
  smallCategoryOptionEl.value = _smallCategoryId;

  // 라지 카테고리 선택 이벤트 :  미들 카테고리 옵션 생성
  largeCategoryOptionEl.addEventListener('change', () => {
    const largeCategoryId = largeCategoryOptionEl.value;
    setMiddleCategories(largeCategoryId);
  });

  // 미들 카테고리 선택 이벤트 : 스몰 카테고리 옵션 생성
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

//-- 상품 수정하기 버튼
form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    let formData = new FormData();

    // 이미지 배열의 모든 파일을 formData에 추가
    for (let file of imageFiles) {
      formData.append('images', file);
    }
    const smallCategoryId = smallCategoryOptionEl.value;
    const productName = document.querySelector('#unp-product-name').value;
    const content = document.querySelector('#unp-product-description').value;
    const price = document.querySelector('#unp-standard-price').value;
    if (smallCategoryId === '0') return alert('카테고리를 선택해주세요.');

    formData.append('smallCategoryId', smallCategoryId);
    formData.append('name', productName);
    formData.append('content', content);
    formData.append('price', price);
    console.log('productId :', productId);

    // fetch 상품 수정 요청
    const response = await fetch(`/products/${productId}`, {
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to post products');
    }
    location.href = `/my-products`;
  } catch (error) {
    console.error('Error posting products:', error);
  }
});

let imageFiles = []; // 이미지 파일들을 담을 배열

// formData에 이미지 할당
imageUpload.addEventListener('change', async (e) => {
  console.log(e.target.files[0].type);
  const files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (file.size > 1 * 1024 * 1024) {
      alert('파일용량은 최대1mb입니다.');
      return;
    }

    if (!file.type.includes('jpeg') && !file.type.includes('png')) {
      alert('jpeg 또는 png 파일만 업로드 가능합니다!');
      return;
    }

    formData.append('images', file);

    // add the file to our array
    imageFiles.push(file);

    // Load new images to preview
    const reader = new FileReader();

    reader.onloadend = function () {
      const data = {
        imageUrl: reader.result,
      };
      appendImagePreview(data, false, file);
    };

    reader.readAsDataURL(file);
  }
});

// ============================ 이미지 로직 ============================ //

// 이미지 미리보기에 이미지와 삭제버튼 함께 추가
function appendImagePreview(image, isExistingImage, file) {
  const imgContainer = document.createElement('div');
  const img = document.createElement('img');
  const imageUrl = image.imageUrl;

  img.src = imageUrl;
  img.style.width = '100px';
  img.style.height = '100px';

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = `<i class="ci-close"></i>`;
  deleteBtn.setAttribute('data-image-id', '0');

  // isExistingImage => true : 기존 이미지, false(else) : 새로운 이미지
  if (isExistingImage) {
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const imageId = image.id;
      try {
        // 삭제 API 요청
        const response = await fetch(`/product-images/${imageId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete image: ${imageUrl}`);

        // 미리 보기에서 제거
        imgContainer.remove();
      } catch (error) {
        console.error(error);
      }
    });
  } else {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      imgContainer.remove();
      // 이미지 파일 배열에서 삭제
      const index = imageFiles.indexOf(file);
      if (index > -1) {
        imageFiles.splice(index, 1);
      }
    });
  }

  imgContainer.appendChild(img);
  imgContainer.appendChild(deleteBtn);

  document.getElementById('imagePreview').appendChild(imgContainer);
}
