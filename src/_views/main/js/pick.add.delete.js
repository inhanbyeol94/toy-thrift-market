const currentURL = window.location.href;
const currentProductId = currentURL.split('product/').pop();

// '찜하기' 버튼 클릭 이벤트 핸들러
const pickbutton = document.getElementById('pickbutton');
const lickbutton = document.getElementById('likeColor');

async function onPickButtonClick(productId) {
  try {
    const response = await fetch(`/pick/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('찜하기 요청 실패');
    }
    const result = await response.json();
    alert(result.message);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

pickbutton.addEventListener('click', () => onPickButtonClick(currentProductId));

async function myPick() {
  try {
    const response = await fetch('/products/picks', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    const matchingItems = data.filter((item) => item.id === currentProductId);
    if (matchingItems.length > 0) {
      lickbutton.style.color = '#FFBF00';
    } else {
      lickbutton.style.color = '';
    }
  } catch (err) {
    console.error(err);
  }
}
myPick();
