// 선택자
const imageTag = document.getElementById('mainImage');
const maintitleTag = document.getElementById('main_title');
const subtitleTag = document.getElementById('sub_title');
const bottomtapcolorTag = document.getElementById('bottom_tab_color');
const bottomtaptitleTag = document.getElementById('bottom_title');
const bottomcliconOne = document.getElementById('cl1Icon');
const cltitleOne = document.getElementById('cl1Title');
const clcontentOne = document.getElementById('cl1content');
const bottomcliconTwo = document.getElementById('cl2Icon');
const cltitleTwo = document.getElementById('cl2Title');
const clcontentTwo = document.getElementById('cl2content');
const bottomcliconThree = document.getElementById('cl3Icon');
const cltitleThree = document.getElementById('cl3Title');
const clcontentThree = document.getElementById('cl3content');
const bottomcliconFour = document.getElementById('cl4Icon');
const cltitleFour = document.getElementById('cl4Title');
const clcontentFour = document.getElementById('cl4content');
// 메인대시보드 정보 가져오기
async function maindashBoard() {
  try {
    const res = await fetch('/admin-mainboards', { method: 'GET' });
    if (!res.ok) {
      console.error('Response status:', res.status);
      throw new Error('정보를 가져오는데 실패하였습니다.');
    }

    const dashBoard = await res.json();
    console.log(dashBoard);
    imageTag.setAttribute('src', dashBoard[0].image);
    maintitleTag.value = dashBoard[0].mainTitle;
    subtitleTag.value = dashBoard[0].subtitle;

    bottomtaptitleTag.innerHTML = dashBoard[0].bottomTitle;

    bottomcliconOne.value = dashBoard[0].columns[0].icon;
    cltitleOne.value = dashBoard[0].title;
    clcontentOne.value = dashBoard[0].content;

    bottomcliconTwo.value = dashBoard[0].icon2;
    cltitleTwo.value = dashBoard[0].title2;
    clcontentTwo.value = dashBoard[0].title2;

    bottomcliconThree.value = dashBoard[0].icon3;
    cltitleThree.value = dashBoard[0].title3;
    clcontentThree.value = dashBoard[0].content3;

    bottomcliconFour.value = dashBoard[0].icon4;
    cltitleFour.value = dashBoard[0].title4;
    clcontentFour.value = dashBoard[0].content4;
  } catch (error) {
    console.error(error);
  }
}
maindashBoard();
