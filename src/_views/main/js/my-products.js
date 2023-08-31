const myProductsNumberEls = document.querySelectorAll('.my-products-number');
const productAreaEl = document.querySelector('#product-area');
const DEFAULT_PRODUCT_IMAGE = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';

loadProducts();
async function loadProducts() {
  try {
    const response = await fetch(`/products/my-products`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error('Failed to get product');
    }
    console.log(result);
    for (const _product of result) {
      const { id, name, price, productImages } = _product;
      const imageUrl = productImages.length ? productImages[0].imageUrl : DEFAULT_PRODUCT_IMAGE;

      const statusResponse = await fetch(`/trade/${id}`);
      const statusResult = await statusResponse.json();
      const statusText = statusResult === 1 ? '거래중' : statusResult === 2 ? '거래완료' : '거래없음';

      const productEl = document.createElement('div');
      const productHtml = `<div class="d-block d-sm-flex align-items-center py-4 border-bottom">
                      <!-- 링크 이미지 -->
                      <a class="d-block mb-3 mb-sm-0 me-sm-4 ms-sm-0 mx-auto" href="/product/${id}" style="width: 12.5rem"
                      ><img class="rounded-3" src=${imageUrl} alt="Product"
                      /></a>
                      <div class="text-center text-sm-start">
                      <div class="status mb-3" style="color:red;" data-product-id=${id}>${statusText}</div>
                      <!-- 제목 -->
                      <h3 class="h6 product-title mb-4"><a href="/product/${id}">${name}</a></h3>
                      <!-- 가격 -->
                      <div class="d-inline-block text-accent">${price}원</div>
                      <!-- 버튼 -->
                      <div class="d-flex justify-content-center justify-content-sm-start pt-3">
                          <button data-product-id=${id} class=" product-edit-button btn bg-faded-info btn-icon me-2" type="button" data-bs-toggle="tooltip" title="Edit"><i class="ci-edit text-info"></i></button>
                          <button data-product-id=${id} class="product-delete-button btn bg-faded-danger btn-icon me-2" type="button" data-bs-toggle="tooltip" title="Delete"><i class="ci-trash text-danger"></i></button>
                          <button data-product-id=${id} type="button" id="tradeCompleteBtn" class="btn btn-secondary" onclick=tradeComplete(${id})>거래완료</button>
                      </div>
                      </div>
                  </div>`;

      productEl.innerHTML = productHtml; // 에러
      productAreaEl.appendChild(productEl);
    }

    addEventDeleteBtn();
    addEventEditBtn();

    // 상품 개수
    const productNumber = result.length;
    myProductsNumberEls.forEach((element) => (element.innerHTML = productNumber));
  } catch (error) {
    console.error(error);
  }
}

// 상품 삭제 버튼

function addEventDeleteBtn() {
  const productDeleteButtons = document.querySelectorAll('.product-delete-button');
  productDeleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const confirmDelete = confirm('상품을 삭제하시겠습니까?');
      if (!confirmDelete) return;
      const productId = button.getAttribute('data-product-id');
      deleteProduct(productId);
    });
  });
}

// 상품 삭제 함수
async function deleteProduct(productId) {
  const response = await fetch(`/products/${productId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    location.reload();
  } else {
    const result = await response.json();
    console.error('Error deleting product:', result.error);
    alert('An error occurred while deleting the product.');
  }
}

// 상품 수정 버튼
function addEventEditBtn() {
  const productEditButtons = document.querySelectorAll('.product-edit-button');
  productEditButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // 수정 페이지로 이동
      const productId = button.getAttribute('data-product-id');
      location.href = `/product/${productId}/edit`;
      // editProduct(productId);
    });
  });
}

// 상품 수정 함수
async function editProduct(productId) {
  const response = await fetch(`/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  // const result = await response.json();

  if (response.ok) {
    location.reload();
  } else {
    const result = await response.json();
    console.error('Error deleting product:', result.error);
    alert('An error occurred while deleting the product.');
  }
}

async function tradeComplete(id) {
  const confirmed = confirm('거래를 완료하시겠습니까?');
  if (confirmed) {
    await fetch(`/trade/complete/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        location.reload();
      });
  }
}
const sidebarMenu = document.querySelector('#my-products');
sidebarMenu.classList.add('active');
