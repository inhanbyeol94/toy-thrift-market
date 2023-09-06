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
          const timeAgoText = timeAgo(product.created_at);
        const productCard = document.createElement('div');
        productCard.innerHTML = `
            <div class="card product-card-alt">
              <div class="product-thumb">
                <a class="product-thumb-overlay" href="/product/${product.id}"></a><img
                  src=${product.product_image} alt="Product">
              </div>
             <div class="card-body">
                <h3 class="product-title fs-sm mb-2"><a href="marketplace-single.html">${product.name}</a></h3>
             <div class="bg-faded-accent text-accent rounded-1 py-1 px-2" style="display: flex; justify-content: space-between;">
                <div>₩ ${product.price.toLocaleString()}원</div>
                  <span style="color: #6e8192">${timeAgoText}</span>
                    </div>
                  </div>
            </div>
        `;
        productContainer.appendChild(productCard);
      });
    });
};

loadPopularProducts();
