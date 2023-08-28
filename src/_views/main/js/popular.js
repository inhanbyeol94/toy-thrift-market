const loadPopularProducts = async () => {
  fetch('/products/pick/popular', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const productContainer = document.querySelector('.hotlist');
      data.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.innerHTML = `
            <div class="card product-card-alt">
              <div class="product-thumb">
                <a class="product-thumb-overlay" href="/product/${product.id}"></a><img
                  src=${product.product_image} alt="Product">
              </div>
              <div class="card-body">
                <h3 class="product-title fs-sm mb-2"><a href="marketplace-single.html">${product.name}</a></h3>
                <div class="bg-faded-accent text-accent rounded-1 py-1 px-2">₩ ${product.price.toLocaleString()}원</div>
              </div>
            </div>
        `;
        productContainer.appendChild(productCard);
      });
    });
};

loadPopularProducts();
