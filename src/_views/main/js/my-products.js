// const myProductsNumberEl = document.querySelector('#my-products-number');
const productAreaEl = document.querySelector('#product-area');
const DEFAULT_PRODUCT_IMAGE = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
loadProducts();
async function loadProducts() {
  const response = await fetch(`/products/my-products`);
  const result = await response.json();
  result.forEach((_product) => {
    const { id, name, productStatus, price, productImages } = _product;
    const imageUrl = productImages.length ? productImages[0].imageUrl : DEFAULT_PRODUCT_IMAGE;
    const productEl = document.createElement('div');
    const productHtml = `<div class="d-block d-sm-flex align-items-center py-4 border-bottom">
                    <!-- 링크 이미지 -->
                    <a class="d-block mb-3 mb-sm-0 me-sm-4 ms-sm-0 mx-auto" href="marketplace-single.html" style="width: 12.5rem"
                    ><img class="rounded-3" src=${imageUrl} alt="Product"
                    /></a>
                    <div class="text-center text-sm-start">
                    <!-- 제목 -->
                    <h3 class="h6 product-title mb-2"><a href="marketplace-single.html">${name}</a></h3>
                    <!-- 가격 -->
                    <div class="d-inline-block text-accent">${price}원</div>
                    <!-- 버튼 -->
                    <div class="d-flex justify-content-center justify-content-sm-start pt-3">
                        <button class="btn bg-faded-info btn-icon me-2" type="button" data-bs-toggle="tooltip" title="Edit"><i class="ci-edit text-info"></i></button>
                        <button class="btn bg-faded-danger btn-icon" type="button" data-bs-toggle="tooltip" title="Delete"><i class="ci-trash text-danger"></i></button>
                    </div>
                    </div>
                </div>`;

    productEl.innerHTML = productHtml; // 에러
    productAreaEl.appendChild(productEl);
  });
}
