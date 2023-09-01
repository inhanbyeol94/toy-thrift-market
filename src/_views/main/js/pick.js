const loadPicks = async () => {
  fetch('products/picks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const pickList = document.getElementById('pickList');
      pickList.innerHTML = '';
      data.forEach((pick) => {
        const product = document.createElement('div');
        product.className = 'd-block d-sm-flex align-items-center py-4 border-bottom';
        const firstImageUrl =
          pick.productImages.length > 0
            ? pick.productImages[0].imageUrl
            : 'https://media.istockphoto.com/id/1216251206/ko/%EB%B2%A1%ED%84%B0/%EC%82%AC%EC%9A%A9%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8A%94-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%86%EC%9D%8C-%EC%95%84%EC%9D%B4%EC%BD%98.jpg?s=170667a&w=0&k=20&c=4oSjH5ISBPZbUQ0JFdkkag7FL4Hy60JnAxOugt5g29g=';
        product.innerHTML = `
            <a class="d-block position-relative mb-3 mb-sm-0 me-sm-4 ms-sm-0 mx-auto" href="/product/${pick.id}" style="width: 12.5rem;">
              <img class="rounded-3" src="${firstImageUrl}" alt="Product">
<!--              <span class="btn btn-icon btn-danger position-absolute top-0 end-0 py-0 px-1 m-2" data-bs-toggle="tooltip" aria-label="Remove from Favorites" data-bs-original-title="Remove from Favorites">-->
<!--                <i class="ci-trash"></i>-->
<!--              </span>-->
            </a>
            <div class="text-center text-sm-start">
                <button id="trashButton" onclick= deletePick(${pick.id}) class="btn btn-outline-danger btn-icon mb-2 me-2" type="button"><i class="ci-trash"></i></button>
              <h3 class="h6 product-title mb-2"><a href="${pick.link}">${pick.name}</a></h3>
              <div class="d-inline-block text-accent">${pick.price} ₩</div>
            </div>
          `;
        pickList.appendChild(product);
      });
    });
};
loadPicks();

const sidebarMenu = document.querySelector('#pick-list');
sidebarMenu.classList.add('active');

const deletePick = async (productId) => {
  if (confirm('찜목록에서 삭제하시겠습니까?')) {
    try {
      const response = await fetch(`/pick/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('오류가 발생하였습니다.');
      alert('삭제되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  } else {
    alert('취소하였습니다.');
  }
};
