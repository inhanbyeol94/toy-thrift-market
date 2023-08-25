const productList = document.getElementById('productList');

const test = async () => {
  const api = await fetch(`/searches${window.location.search}`);
  const result = await api.json();
  console.log(result);

  result.data.forEach((info) => {
    productList.innerHTML += `          <!-- Product-->
          <div class="col-lg-3 col-md-4 col-sm-6 px-2 mb-grid-gutter">
            <div class="card product-card-alt">
              <div class="product-thumb">
                <button class="btn-wishlist btn-sm" type="button"><i class="ci-heart"></i></button>
                <a class="product-thumb-overlay" href="#"></a><img src="${info.productImages[0].imageUrl}" style="width: 300px; height:300px; object-fit: cover ">
              </div>
              <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-start pb-2">
                  <div class="text-muted fs-xs me-1">${info.member.nickname}</div>
                  
                </div>
                <h3 class="product-title fs-sm mb-2"><a href="marketplace-single.html">${info.name}</a></h3>
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                  <div class="bg-faded-accent text-accent rounded-1 py-1 px-2" style="font-size: 14px">${info.price.toLocaleString()}원</small></div>
                </div>
              </div>
            </div>
          </div>`;
  });
};

test();
