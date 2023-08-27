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
  img.setAttribute('data-image-id', image.id);

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = `<i class="ci-close"></i>`;

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

// ============================ 순서 로직 ============================ //\

const previewEl = document.querySelector('#imagePreview');

// 변수 초기화
let picked = null;
let pickedIndex = null;

// 드래그 스타트
previewEl.addEventListener('dragstart', (e) => {
  const target = e.target;
  console.log('드래그 스타트');
  // 드래그 시작한 요소와 그 요소의 인덱스 저장
  picked = target;

  // previewEl의 자식 div 배열중 target의 부모 div의 index 구하기, 미리보기에서 이미지의 인덱스 구하기
  pickedIndex = [...target.parentNode.parentNode.children].indexOf(target.parentNode);
});

// 드래그 오버
previewEl.addEventListener('dragover', (e) => {
  console.log('드래그 오버');
  // dragover 이벤트의 기본 동작 방지(드롭을 허용하도록 설정)
  e.preventDefault();
  if (e.target.parentNode !== e.currentTarget) return;
});
// 드롭
previewEl.addEventListener('drop', async (e) => {
  console.log('드랍');

  const target = e.target;
  // 드랍 위치에 있는 요소의 인덱스 구하기
  const index = [...target.parentNode.children].indexOf(target);
  // 원래 위치(pickedIndex)와 비교하여 뒤로 옮겼다면 after() 메서드를, 앞으로 옮겼다면 before() 메서드를 사용하여 실제 DOM에서 위치 변경
  index > pickedIndex ? target.parentNode.after(picked) : target.parentNode.before(picked);

  const imageId = picked.getAttribute('data-image-id');
  console.log('🚀 --------------------------------------------------🚀');
  console.log('🚀 🔶 previewEl.addEventListener 🔶 picked:', picked);
  console.log('🚀 --------------------------------------------------🚀');
  // 바로 전 또는 다음 컬럼 id 가져오기. 만약 없다면 '0'으로 설정.
  const prev = picked.previousSibling?.getAttribute('data-image-id') || 0;
  console.log('🚀 ----------------------------------------------------------------------------------🚀');
  console.log('🚀 🔶 previewEl.addEventListener 🔶 picked.previousSibling:', picked.previousSibling);
  console.log('🚀 ----------------------------------------------------------------------------------🚀');
  // const next = picked.nextSibling?.getAttribute('data-image-id') || 0;
  return;
  const response = await fetch(`/product-images/position`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prev,
      next,
      id: imageId,
    }),
  });
  const { status } = response;
  const { message } = await response.json();

  if (status) {
    alert(message);
    return window.location.reload();
  }
});
