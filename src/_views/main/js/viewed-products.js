window.onload = function() {
    // 로딩 시 viewedProducts 키가 없으면 빈 배열
    if (!localStorage.getItem('viewedProducts')) {
        localStorage.setItem('viewedProducts', JSON.stringify([]));
    }

    // 로컬스토리지에 저장된 상품 정보 가져오기
    const getViewedProduct = () => {
        /** 최근 본 상품 선택자 **/
        const viewedProductList = document.getElementById('viewedProductList');
        /** 최근 본 상품이 없을 때 선택자 **/
        const noViewedProducts = document.getElementById('noViewedProducts');

        const viewedProductsData = localStorage.getItem('viewedProducts');
        const viewedProducts = viewedProductsData ? JSON.parse(viewedProductsData) : [];

        let productListHTML = '';
        viewedProducts.forEach((product) => {
            productListHTML += `
            <li>
                <a href="/product/${product.id}">
                    <img src="${product.product_image}" alt="${product.product_name}">
                </a>
            </li>`;
        });

        viewedProductList.innerHTML = productListHTML;

        // 목록이 0 일때, 상품목록이 없을때의 메세지를 보여주고, 그게 아니면 none 처리
        if (viewedProductList.children.length === 0) {
            noViewedProducts.style.display = 'block';
        } else {
            noViewedProducts.style.display = 'none';
        }
    }

    // 페이지가 로드되었을 때 최근 본 상품 목록 업데이트
    getViewedProduct();

    const toggleViewedProductsDisplay = () => {
        const viewedProductList = document.querySelector('#viewedProductList');

        // 표시(block) / 숨김(none)
        viewedProductList.style.display =
            (viewedProductList.style.display === 'none') ? 'block' : 'none';
    }

    // 버튼 클릭 이벤트리스너
    document.querySelector('.btn-viewed-products').addEventListener('click', function() {
        toggleViewedProductsDisplay();
    });
}
