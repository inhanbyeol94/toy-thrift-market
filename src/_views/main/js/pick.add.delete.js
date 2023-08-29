const currentURL = window.location.href;
const currentProductId = currentURL.split('product/').pop();
console.log(currentURL, currentProductId);
// '찜하기' 버튼 클릭 이벤트 핸들러
const pickbutton = document.getElementById('pickbutton');

function setPickButtonColor(piced) {
  const lickbutton = document.getElementById('likeColor');
  if (piced) {
    lickbutton.style.color = '#FFBF00';
  } else {
    lickbutton.style.color = '';
  }
}
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

    const piced = result.message === '찜목록에 추가되었습니다.' ? true : false;
    setPickButtonColor(piced);
    alert(result.message);
  } catch (error) {
    console.error(error);
  }
}
pickbutton.addEventListener('click', () => onPickButtonClick(currentProductId));
async function myPick(productId) {
  try {
    const res = await fetch('/products/picks', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    // console.log(res);
    if (!res.ok) {
      throw new Error('찜목록 조회실패');
    }
    const picks = await res.json();
    const pickProducts = picks.map((pick) => pick.productId);
    // console.log(pickProducts);
    const isPicked = pickProducts.includes(productId);
    setPickButtonColor(isPicked);
  } catch (err) {
    console.error(err);
  }
}
window.onload = () => myPick(currentProductId);
