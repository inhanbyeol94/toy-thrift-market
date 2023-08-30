const form = document.querySelector('form');
const accountVerificationBtn = document.querySelector('#account-verification-button');
const imageUpload = document.querySelector('#imageUpload');
const largeCategoryOptionEl = document.querySelector('#unp-category-large');
const middleCategoryOptionEl = document.querySelector('#unp-category-middle');
const smallCategoryOptionEl = document.querySelector('#unp-category-small');
const NO_CATEGORY_OPTION = '<option value="0">카테고리 선택</option>';
const productNameEl = document.querySelector('#unp-product-name');
const contentEl = document.querySelector('#unp-product-description');
const priceEl = document.querySelector('#unp-standard-price');
const phoneNumberEl = document.querySelector('#phone-number');
const accountHolderEl = document.querySelector('#account-holder');
const bankAccountNumberEl = document.querySelector('#bank-account-number');
const residentRegistrationNumberEl = document.querySelector('#resident-registration-number');
const phoneNumberRegExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
const bankAccountNumRegExp = /^\d{6}-\d{2}-\d{6}$/;

let formData = new FormData();
let hasNoImage = true;

// --- 계좌 유효성 검사 ---
accountVerificationBtn.addEventListener('click', async () => {
  const data = {
    accountHolder: accountHolderEl.value,
    phoneNumber: phoneNumberEl.value,
    residentRegistrationNumber: residentRegistrationNumberEl.value,
  };

  const response = await fetch(`/hanbyeol-banks/identity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);

  // 인증번호 인풋 보여주기
});

// 인증번호 확인 버튼 -> 검증 api 호출

// 응답이 성공이면 바로 3번째 호출

//-- 상품 추가하기
form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const smallCategoryId = smallCategoryOptionEl.value;
    const productName = productNameEl.value;
    const content = contentEl.value;
    const price = priceEl.value;
    const phoneNumber = phoneNumberEl.value;
    const accountHolder = accountHolderEl.value;
    const bankAccountNumber = bankAccountNumberEl.value;
    const residentRegistrationNumber = residentRegistrationNumberEl.value;

    if (smallCategoryId === '0') return alert('카테고리를 선택해주세요.');
    if (hasNoImage) return alert('최소 1장의 이미지를 업로드하세요');
    if (!phoneNumberRegExp.test(phoneNumber)) return alert('핸드폰 번호 형식에 일치하지 않습니다.\n하이픈을 포함한 휴대폰 번호를 입력해주세요.');
    if (!bankAccountNumRegExp.test(bankAccountNumber)) return alert('한별은행 계좌번호 형식에 일치하지 않습니다.');

    formData.append('smallCategoryId', smallCategoryId);
    formData.append('name', productName);
    formData.append('content', content);
    formData.append('price', price);
    formData.append('phoneNumber', phoneNumber);
    formData.append('accountHolder', accountHolder);
    formData.append('bankAccountNumber', bankAccountNumber);
    formData.append('residentRegistrationNumber', residentRegistrationNumber);

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
    hasNoImage = false;
    formData.append('images', file);
  }
});

// 이미지 미리보기 메서드
function previewImages() {
  let input = document.getElementById('imageUpload');
  let preview = document.getElementById('imagePreview');
  preview.innerHTML = '';

  for (let file of input.files) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.margin = '10px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

loadCategories();

async function loadCategories() {
  const response = await fetch('/categories/large');
  const largeCategories = await response.json();

  // 라지 카테고리 옵션 생성
  generateCategories(largeCategories, largeCategoryOptionEl);

  // 라지 카테고리 선택 시, 하위 미들 카테고리 옵션 생성
  largeCategoryOptionEl.addEventListener('change', () => {
    const largeCategoryId = largeCategoryOptionEl.value;
    emptyMiddleOptions();
    emptySmallOptions();
    if (largeCategoryId === '0') return;

    const selectedLarge = largeCategories.find((e) => e.id === largeCategoryId);
    generateCategories(selectedLarge.middleCategories, middleCategoryOptionEl);
  });

  const middleCategories = [];
  largeCategories.forEach((large) => {
    middleCategories.push(...large.middleCategories);
  });

  // 미들 카테고리 선택 시, 하위 스몰 카테고리 옵션 생성
  middleCategoryOptionEl.addEventListener('change', () => {
    const middleCategoryId = middleCategoryOptionEl.value;
    emptySmallOptions();
    if (middleCategoryId === '0') return;

    const selectedMiddle = middleCategories.find((e) => e.id === middleCategoryId);
    generateCategories(selectedMiddle.smallCategories, smallCategoryOptionEl);
  });
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
