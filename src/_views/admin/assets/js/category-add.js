window.onload = function () {
  loadCategory();

  // 대 카테고리 추가 이벤트
  const addLargeCategoryBtn = document.querySelector('.largeCategoryAddBtn a');
  const largecategoryNameInput = document.querySelector('.post-item-large input');

  addLargeCategoryBtn.addEventListener('click', () => {
    const categoryName = largecategoryNameInput.value;
    if (categoryName) {
      addLargeCategory(categoryName);
      largecategoryNameInput.value = '';
    }
  });

  // 중 카테고리 추가 이벤트
  const middleCategoryAddBtn = document.querySelector('.middleCategoryAddBtn a');
  const middleCategoryNameInput = document.querySelector('.post-item-middle input');
  const selectLargeCategory = document.getElementById('inputGroupSelect01');

  middleCategoryAddBtn.addEventListener('click', () => {
    const selectedLargeCategoryId = selectLargeCategory.value;
    const newMiddleCategoryName = middleCategoryNameInput.value;

    if (selectedLargeCategoryId && newMiddleCategoryName) {
      addMiddleCategory(selectedLargeCategoryId, newMiddleCategoryName);
      middleCategoryNameInput.value = '';
    }
  });

  // 소 카테고리 추가 이벤트
  const smallCategoryAddBtn = document.querySelector('.smallCategoryAddBtn a');
  const smallCategoryNameInput = document.querySelector('.post-item-small input');
  const selectMiddleCategory = document.getElementById('inputGroupSelect02');

  smallCategoryAddBtn.addEventListener('click', () => {
    const selectedMiddleCategoryId = selectMiddleCategory.value;
    const newSmallCategoryName = smallCategoryNameInput.value;

    if (selectedMiddleCategoryId && newSmallCategoryName) {
      addSmallCategory(selectedMiddleCategoryId, newSmallCategoryName);
      middleCategoryNameInput.value = '';
    }
  });
};

// 카테고리 조회 api 요청, 카테고리 목록, 드롭다운에 삽입
function loadCategory() {
  fetch('/categories/large', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const largeCategoryList = document.getElementById('largeCategoryList');
      const middleCategoryList = document.getElementById('middleCategoryList');
      const smallCategoryList = document.getElementById('smallCategoryList');
      const selectInput = document.getElementById('inputGroupSelect01');
      const selectInputMiddle = document.getElementById('inputGroupSelect02');

      // 대 카테고리 처리
      data.forEach((largeCategory) => {
        const largeCategoryName = largeCategory.name;
        const largeCategoryId = largeCategory.id;

        const largeCategoryItem = document.createElement('li');
        largeCategoryItem.textContent = largeCategoryName;
        largeCategoryItem.dataset.largeCategoryId = largeCategoryId;

        largeCategoryList.appendChild(largeCategoryItem);

        // 옵션으로 추가
        const optionElement = document.createElement('option');
        optionElement.value = largeCategoryId;
        optionElement.textContent = largeCategoryName;
        selectInput.appendChild(optionElement);
      });

      // 중 카테고리
      data.forEach((largeCategory) => {
        largeCategory.middleCategories.forEach((middleCategory) => {
          const largeCategoryName = largeCategory.name;
          const middleCategoryName = middleCategory.name;
          const middleCategoryId = middleCategory.id;

          const combinedCategoryName = `${largeCategoryName} > ${middleCategoryName}`;

          const middleCategoryItem = document.createElement('li');
          middleCategoryItem.textContent = combinedCategoryName;
          middleCategoryItem.dataset.middleCategoryId = middleCategoryId;

          middleCategoryList.appendChild(middleCategoryItem);

          // 옵션으로 추가
          const optionElement2 = document.createElement('option');
          optionElement2.value = middleCategoryId;
          optionElement2.textContent = middleCategoryName;
          selectInputMiddle.appendChild(optionElement2);
        });
      });

      // 소 카테고리
      data.forEach((largeCategory) => {
        largeCategory.middleCategories.forEach((middleCategory) => {
          middleCategory.smallCategories.forEach((smallCategory) => {
            const largeCategoryName = largeCategory.name;
            const middleCategoryName = middleCategory.name;
            const smallCategoryName = smallCategory.name;
            const smallCategoryId = smallCategory.id;

            const combinedCategoryName = `${largeCategoryName} > ${middleCategoryName} > ${smallCategoryName}`;

            const smallCategoryItem = document.createElement('li');
            smallCategoryItem.textContent = combinedCategoryName;
            smallCategoryItem.dataset.smallCategoryId = smallCategoryId;

            smallCategoryList.appendChild(smallCategoryItem);
          });
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// 카테고리(대) 추가 함수
function addLargeCategory(categoryName) {
  fetch('/categories/large', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: categoryName,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('새로운 카테고리 추가 완료:', data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('카테고리 추가 오류:', error);
    });
}

// 카테고리(중) 추가 함수
function addMiddleCategory(selectedLargeCategoryId, newMiddleCategoryName) {
  fetch('/categories/middle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      largeCategoryId: selectedLargeCategoryId,
      name: newMiddleCategoryName,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('새로운 중 카테고리 추가 완료:', data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('중 카테고리 추가 오류:', error);
    });
}

// 카테고리(소) 추가 함수
function addSmallCategory(selectedMiddleCategoryId, newSmallCategoryName) {
  fetch('/categories/small', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      middleCategoryId: selectedMiddleCategoryId,
      name: newSmallCategoryName,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('새로운 소 카테고리 추가 완료:', data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('소 카테고리 추가 오류:', error);
    });
}
