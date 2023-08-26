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

const editMainBoardBtn = document.getElementById('dashboardEdit');
editMainBoardBtn.addEventListener('click', () => {
  const imageTag = imageTag.value;
  const maintitleTag = maintitleTag.value;
  const subtitleTag = subtitleTag.value;
  const bottomtapcolorTag = bottomtapcolorTag.value;
  const bottomtaptitleTag = bottomtaptitleTag.value;
  const bottomcliconOne = bottomcliconOne.value;
  const cltitleOne = cltitleOne.value;
  const clcontentOne = clcontentOne.value;
  const bottomcliconTwo = bottomcliconTwo.value;
  const cltitleTwo = cltitleTwo.value;
  const clcontentTwo = clcontentTwo.value;
  const bottomcliconThree = bottomcliconThree.value;
  const cltitleThree = cltitleThree.value;
  const clcontentThree = clcontentThree.value;
  const bottomcliconFour = bottomcliconFour.value;
  const cltitleFour = cltitleFour.value;
  const clcontentFour = clcontentFour.value;
  const editMainBoardData = {
    mainTitle: maintitleTag,
    subTitle: subtitleTag,
    bottomTap: bottomtapcolorTag,
    mainImage: imageTag,
    bottomTitle: bottomtaptitleTag,
    columns: [
      {
        icon: bottomcliconOne,
        title: cltitleOne,
        content: clcontentOne,
        bottomcliconTwo: cl2Icon,
        cltitleTwo: cl2Title,
        clcontentTwo: clcontentOne,
        bottomcliconThree: cl3Icon,
        cltitleThree: cl3Title,
        clcontentThree: clcontentOne,
        bottomcliconFour: cl4Icon,
        cltitleFour: cl4Title,
        content4: clcontentFour,
      },
    ],
  };

  fetch('admin-mainboards', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editMainBoardData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('수정이 완료되었습니다.', data);
    })
    .catch((error) => {
      console.error('수정 중 오류가 발생했습니다.', error);
    });
});
