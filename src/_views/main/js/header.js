const headerSearchInput = document.getElementById('headerSearchInput');

headerSearchInput.addEventListener('keydown', (e) => {
  if (e.keyCode == 13) {
    if (!headerSearchInput.value) return alert('상품명을 입력해주세요.');
    window.location.href = '/search?product=' + headerSearchInput.value;
  }
});

const headerLoadCategories = async () => {
  const response = await fetch('/categories/large');
  const data = await response.json();

  data.forEach((largeCategory) => {
    const li = document.createElement('li');
    li.classList.add('dropdown');

    const a = document.createElement('a');
    a.classList.add('dropdown-item', 'dropdown-toggle');
    a.setAttribute('data-bs-toggle', 'dropdown');
    a.textContent = largeCategory.name;

    const ulMiddle = document.createElement('ul');
    ulMiddle.classList.add('dropdown-menu');
    ulMiddle.id = 'headerMiddleCategory';

    const liMiddleAll = document.createElement('li');
    liMiddleAll.classList.add('dropdown-item', 'product-title', 'fw-medium');
    const aMiddleAll = document.createElement('a');
    aMiddleAll.href = `/search?largeCategory=${largeCategory.id}`;
    aMiddleAll.textContent = '전체 >';
    liMiddleAll.appendChild(aMiddleAll);
    ulMiddle.appendChild(liMiddleAll);

    largeCategory.middleCategories.forEach((middleCategory) => {
      const liMiddle = document.createElement('li');
      liMiddle.classList.add('dropdown');

      const aMiddle = document.createElement('a');
      aMiddle.classList.add('dropdown-item', 'dropdown-toggle');
      aMiddle.setAttribute('data-bs-toggle', 'dropdown');
      aMiddle.textContent = middleCategory.name;

      const ulSmall = document.createElement('ul');
      ulSmall.classList.add('dropdown-menu');
      ulSmall.id = 'headerSmallCategory';

      const liSmallAll = document.createElement('li');
      liSmallAll.classList.add('dropdown-item', 'product-title', 'fw-medium');
      const aSmallAll = document.createElement('a');
      aSmallAll.href = `/search?largeCategory=${largeCategory.id}&middleCategory=${middleCategory.id}`;
      aSmallAll.textContent = '전체 >';
      liSmallAll.appendChild(aSmallAll);
      ulSmall.appendChild(liSmallAll);

      middleCategory.smallCategories.forEach((smallCategory) => {
        const liSmall = document.createElement('li');
        const aSmall = document.createElement('a');
        aSmall.classList.add('dropdown-item');
        aSmall.href = `/search?largeCategory=${largeCategory.id}&middleCategory=${middleCategory.id}&smallCategory=${smallCategory.id}`;
        aSmall.textContent = smallCategory.name;

        liSmall.appendChild(aSmall);
        ulSmall.appendChild(liSmall);
      });

      liMiddle.appendChild(aMiddle);
      liMiddle.appendChild(ulSmall);
      ulMiddle.appendChild(liMiddle);
    });

    li.appendChild(a);
    li.appendChild(ulMiddle);
    headerLargeCategory.appendChild(li);
  });
};

headerLoadCategories();

async function logout() {
  // 최근 본 상품목록 초기화 하려고 로컬스토리지에 저장된거 삭제
  localStorage.removeItem('viewedProducts')
  const api = await fetch('/auth', {
    method: 'DELETE',
  });

  const { status } = await api;

  if (status == 200) return (window.location.href = '/');
}
