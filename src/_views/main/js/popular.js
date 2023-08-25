const fetchPopularProducts = async () => {
  fetch('/products/pick/popular', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const PopularProductList = document.getElementById('PopularProductList');
    });
};
fetchPopularProducts();
