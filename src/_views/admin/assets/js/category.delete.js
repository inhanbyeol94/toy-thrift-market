// 대분류 조회태그
const largeTag = document.querySelector('#largeCategory');
// 중분류 조회태그
const middleTag = document.querySelector('#middleCategory');
// 소분류 조회태그
const smallTag = document.querySelector('#smallCategory');

const largeNotData = document.getElementById('largeNotData');
const middleNotData = document.getElementById('middleNotData');
const smallNotData = document.getElementById('smallNotData');

// fetch로 모든 카테고리를 받아와서 JSON으로 만듬
const categoryData = async () => {
  const res = await fetch(`/categories/large`);
  const categories = await res.json();

  categories.forEach((largeCategories) => {
    largeNotData.style.display = 'none';
    largeTag.innerHTML += `<ol class="breadcrumb"><li class="breadcrumb-item">${largeCategories.name} <a href="#" onclick="deleteCategory(${largeCategories.id},'large')"><i style="color:#FF6B6B" class="bi bi-trash-fill"></i></a></li></ol>`;
    largeCategories.middleCategories.forEach((middleCategories) => {
      middleNotData.style.display = 'none';
      middleTag.innerHTML += `<ol class="breadcrumb"><li class="breadcrumb-item">${largeCategories.name}</li><li class="breadcrumb-item">${middleCategories.name} <a href="#" onclick="deleteCategory(${middleCategories.id}, 'middle')"><i style="color:#FF6B6B" class="bi bi-trash-fill"></i></a></li></ol>`;
      middleCategories.smallCategories.forEach((smallCategories) => {
        smallNotData.style.display = 'none';
        smallTag.innerHTML += `<ol class="breadcrumb"><li class="breadcrumb-item">${largeCategories.name}</li><li class="breadcrumb-item">${middleCategories.name}</li><li class="breadcrumb-item">${smallCategories.name} <a href="#" onclick="deleteCategory(${smallCategories.id}, 'small')"><i style="color:#FF6B6B" class="bi bi-trash-fill"></i></a></li></ol>`;
      });
    });
  });
};

const deleteCategory = async (id, type) => {
  let check = confirm('삭제하시겠습니까?');

  if (check) {
    const api = await fetch(`/categories/${type}/${id}`, {
      method: 'DELETE',
    });

    const { status } = await api;
    const { message } = await api.json();

    alert(message);
    if (status === 200) return window.location.reload();
  }
};

categoryData();
