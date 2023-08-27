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
const imgView = document.getElementById('imgView');

const access_token = localStorage.getItem('access_token');

// 메인대시보드 정보 가져오기
async function maindashBoard() {
  try {
    const res = await fetch('/admin-mainboards', { method: 'GET', headers: { Authorization: `Bearer ${access_token}` } });
    if (!res.ok) {
      console.error('Response status:', res.status);
      throw new Error('정보를 가져오는데 실패하였습니다.');
    }

    const dashBoard = await res.json();
    console.log(dashBoard);
    imgView.setAttribute('src', dashBoard[0].mainImage);
    maintitleTag.value = dashBoard[0].mainTitle;
    subtitleTag.value = dashBoard[0].subTitle;
    bottomtapcolorTag.value = dashBoard[0].bottomColor;
    bottomtaptitleTag.value = dashBoard[0].bottomTitle;

    bottomcliconOne.value = dashBoard[0].icon1;
    cltitleOne.value = dashBoard[0].title1;
    clcontentOne.value = dashBoard[0].content1;

    bottomcliconTwo.value = dashBoard[0].icon2;
    cltitleTwo.value = dashBoard[0].title2;
    clcontentTwo.value = dashBoard[0].content2;

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

async function updateMaindashBoard() {
  const data = new FormData();

  data.append('images', imageTag.files[0]); // 메인 이미지

  data.append('mainTitle', maintitleTag.value); // 메인 제목
  data.append('subTitle', subtitleTag.value); // 서브 제목

  data.append('bottomTitle', bottomtaptitleTag.value); //하단 제목
  data.append('bottomColor', bottomtapcolorTag.value); //하단 색상

  data.append('icon1', bottomcliconOne.value);
  data.append('icon2', bottomcliconTwo.value);
  data.append('icon3', bottomcliconThree.value);
  data.append('icon4', bottomcliconFour.value);

  data.append('title1', cltitleOne.value);
  data.append('title2', cltitleTwo.value);
  data.append('title3', cltitleThree.value);
  data.append('title4', cltitleFour.value);

  data.append('content1', clcontentOne.value);
  data.append('content2', clcontentTwo.value);
  data.append('content3', clcontentThree.value);
  data.append('content4', clcontentFour.value);

  const api = await fetch('/admin-mainboards', {
    method: 'PATCH',
    body: data,
  });

  const { status } = await api;
  const result = await api.json();
  alert(result.message);
  if (status === 200) window.location.reload();
}
async function eqwe() {
  // S3
  let formData = new FormData();

  formData.append('images', imageTag.files[0]);
  console.log(imageTag.files[0]);
  formData.append('mainTitle', maintitleTag.value);
  formData.append('subTitle', subtitleTag.value);
  formData.append('bottomTabColor', bottomtapcolorTag.value);
  formData.append('bottomTitle', bottomtaptitleTag.value);
  const columns = [
    {
      icon: bottomcliconOne.value,
      title: cltitleOne.value,
      content: clcontentOne.value,
    },
    {
      icon: bottomcliconTwo.value,
      title: cltitleTwo.value,
      content: clcontentTwo.value,
    },
    {
      icon: bottomcliconThree.value,
      title: cltitleThree.value,
      content: clcontentThree.value,
    },
    {
      icon: bottomcliconFour.value,
      title: cltitleFour.value,
      content: clcontentFour.value,
    },
  ];
  formData.append('columns', JSON.stringify(columns));

  try {
    const id = '64e9bae4516f0e147346eb13';
    const response = await fetch(`/admin-mainboards/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${access_token}` },
      body: formData,
    });
    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(result.message || '메인대시보드 수정에 실패하였습니다.');
    }
  } catch (error) {
    console.error(error);
    alert('요청 처리중 오류가 발생하였습니다.');
  }
}
document.getElementById('dashboardEdit').addEventListener('click', updateMaindashBoard);
