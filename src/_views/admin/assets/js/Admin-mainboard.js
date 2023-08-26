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

    const [dashBoard] = await res.json();
    console.log(dashBoard);
    imageTag.setAttribute('src', dashBoard.image);
    maintitleTag.value = dashBoard.mainTitle;
    subtitleTag.value = dashBoard.subTitle;
    bottomtaptitleTag.value = dashBoard.bottomTitle;
    bottomtapcolorTag.value = dashBoard.bottomtapColor;

    bottomcliconOne.value = dashBoard.columns[0].icon;
    cltitleOne.value = dashBoard.columns[0].title;
    clcontentOne.value = dashBoard.columns[0].content;

    bottomcliconTwo.value = dashBoard.columns[1].icon;
    cltitleTwo.value = dashBoard.columns[1].title;
    clcontentTwo.value = dashBoard.columns[1].title;

    bottomcliconThree.value = dashBoard.columns[2].icon;
    cltitleThree.value = dashBoard.columns[2].title;
    clcontentThree.value = dashBoard.columns[2].content;

    bottomcliconFour.value = dashBoard.columns[3].icon;
    cltitleFour.value = dashBoard.columns[3].title;
    clcontentFour.value = dashBoard.columns[3].content;

    let formData = new FormData();
    formData.append('imageTag', dashBoard.image);
    formData.append('maintitleTag', maintitleTag.value);
    formData.append('subtitleTag', subtitleTag.value);
    formData.append('bottomtaptitleTag', bottomtaptitleTag.value);
    formData.append('bottomtapcolorTag', bottomtapcolorTag.value);
    formData.append('bottomcliconOne', bottomcliconOne.value);
    formData.append('cltitleOne', cltitleOne.value);
    formData.append('clcontentOne', clcontentOne.value);
    formData.append('bottomcliconTwo', bottomcliconTwo.value);
    formData.append('cltitleTwo', cltitleTwo.value);
    formData.append('clcontentTwo', clcontentTwo.value);
    formData.append('bottomcliconThree', bottomcliconThree.value);
    formData.append('bottomcliconTwo', bottomcliconTwo.value);
    formData.append('cltitleThree', cltitleThree.value);
    formData.append('clcontentThree', clcontentThree.value);
    formData.append('bottomcliconFour', bottomcliconFour.value);
    formData.append('cltitleFour', cltitleFour.value);
    formData.append('clcontentFour', clcontentFour.value);
  } catch (error) {
    console.error(error);
  }
}
maindashBoard();
// document.getElementById('dashboardEdit').addEventListener('click');
