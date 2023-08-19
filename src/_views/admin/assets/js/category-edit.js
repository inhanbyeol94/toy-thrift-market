loadCategory();
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

      // 카테고리 이름 수정 모달을 보여주는 함수
      function showModal(element, categoryName, categoryType) {
        const editModal = document.getElementById('editModal');
        const editName = document.getElementById('editName');
        editName.value = categoryName;

        // 이름 수정 이벤트 리스너
        document.getElementById('saveButton').onclick = () => {
          updateCategoryName(element, editName, categoryType);
          editModal.style.display = 'none';
        };

        // 취소 이벤트 리스너
        document.getElementById('cancelButton').onclick = () => {
          editModal.style.display = 'none';
        };

        editModal.style.display = 'block';
      }

      function createCategoryElement(category, categoryType) {
        const categoryElement = document.createElement('div');
        categoryElement.textContent = category.name;
        categoryElement.style.cursor = 'pointer';
        categoryElement.style.padding = '5px';
        categoryElement.setAttribute('data-category-id', category.id);
        categoryElement.setAttribute('data-category-type', categoryType);
        return categoryElement;
      }

      // 대 카테고리 처리
      data.forEach((largeCategory) => {
        const largeCategoryItem = createCategoryElement(largeCategory, 'large');
        largeCategoryItem.addEventListener('click', () => {
          showModal(largeCategoryItem, largeCategory.name, 'large');
        });
        largeCategoryList.appendChild(largeCategoryItem);
      });

      // 중 카테고리
      data.forEach((largeCategory) => {
        largeCategory.middleCategories.forEach((middleCategory) => {
          const middleCategoryItem = createCategoryElement(middleCategory, 'middle');
          const largeCategoryName = largeCategory.name;
          const middleCategoryName = middleCategory.name;
          const combinedCategoryName = `${largeCategoryName} > ${middleCategoryName}`;

          middleCategoryItem.textContent = combinedCategoryName;
          middleCategoryItem.addEventListener('click', () => {
            showModal(middleCategoryItem, middleCategoryName, 'middle');
          });
          middleCategoryList.appendChild(middleCategoryItem);
        });
      });

      // 소 카테고리
      data.forEach((largeCategory) => {
        largeCategory.middleCategories.forEach((middleCategory) => {
          middleCategory.smallCategories.forEach((smallCategory) => {
            const smallCategoryItem = createCategoryElement(smallCategory, 'small');
            const largeCategoryName = largeCategory.name;
            const middleCategoryName = middleCategory.name;
            const smallCategoryName = smallCategory.name;
            const combinedCategoryName = `${largeCategoryName} > ${middleCategoryName} > ${smallCategoryName}`;

            smallCategoryItem.textContent = combinedCategoryName;
            smallCategoryItem.addEventListener('click', () => {
              showModal(smallCategoryItem, smallCategoryName, 'small');
            });
            smallCategoryList.appendChild(smallCategoryItem);
          });
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// 카테고리 수정
async function updateCategoryName(categoryElement, editNameEl, categoryType) {
  const newCategoryName = editNameEl.value;
  const data = {
    name: newCategoryName,
  };
  const categoryId = categoryElement.getAttribute('data-category-id');
  // 카테고리 수정 요청
  const response = await fetch(`/categories/` + categoryType + `/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  // const result = await response.json();
  if (response.ok) {
    location.href = '/admins/category/edit';
  } else {
    alert(result.message);
  }
}
