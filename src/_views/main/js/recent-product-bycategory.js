const loadCategories = async () => {
  await fetch('/categories/large', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const categoryList = document.getElementById('categoryList');
      data.forEach((category) => {
        const option = document.createElement('option');
        option.textContent = category.name;
        option.setAttribute('data-id', category.id);
        categoryList.appendChild(option);
      });
    });
};

const handleCategoryChange = async () => {
  const selectedOption = document.getElementById('categoryList');
  const categoryId = selectedOption.options[selectedOption.selectedIndex].getAttribute('data-id');
  if (categoryId === null) {
    await loadRecentProducts(null);
  } else {
    await loadRecentProducts(categoryId);
  }
};

const loadRecentProducts = async (categoryId) => {
  const productsContainer = document.querySelector('.row.pt-2.mx-n2');
  let url = '/products/get/main/all/recent';
  if (categoryId) {
    url = `/products/largecategory/recent/${categoryId}`;
  }
  await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      productsContainer.innerHTML = '';
      data.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    });
};

const createProductCard = (product) => {
  const timeAgoText = timeAgo(product.createdAt)
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-md-4 col-sm-6 px-2 mb-grid-gutter';
  card.innerHTML = `
            <div class="card product-card-alt">
              <div class="product-thumb">
                <a class="product-thumb-overlay" href="/product/${product.id}"></a><img
                  src=${product.productImages[0].imageUrl} alt="Product" style="height:295px; object-fit: cover">
              </div>
              <div class="card-body">
                <h3 class="product-title fs-sm mb-2"><a href="/product/${product.id}">${product.name}</a></h3>
                <div class="bg-faded-accent text-accent rounded-1 py-1 px-2" style="font-size:14px; justify-content: space-between; display: flex">
                    <div>${product.price.toLocaleString()}원</div>
                <span style="color:#6e8192">${timeAgoText}</span>
                </div>
              </div>
            </div>
          </div>
  `;
  return card;
};

loadRecentProducts(null);

const categoryList = document.getElementById('categoryList');
categoryList.addEventListener('change', handleCategoryChange);

loadCategories();
