const productId = window.location.pathname.split('/product/')[1];
const productImageEl = document.querySelector('#product-image');

loadProduct();
async function loadProduct() {
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();
  productImageEl.setAttribute('src', result.productImages[0].imageUrl);
}
