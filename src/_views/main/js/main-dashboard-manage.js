const loadmainboardInfo = async () => {
  fetch('admin-mainboards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const mainSection = document.querySelector('.bg-accent');
      const mainTitle = document.getElementById('mainTitle');
      const subTitle = document.getElementById('subTitle');
      const bottomTapColor = document.getElementById('bottomTapColor');
      const bottomTitle = document.getElementById('bottomTitle');
      const col1Icon = document.getElementById('col1Icon');
      const col1Title = document.getElementById('col1Title');
      const col1content = document.getElementById('col1content');
      const col2Icon = document.getElementById('col2Icon');
      const col2Title = document.getElementById('col2Title');
      const col2content = document.getElementById('col2content');
      const col3Icon = document.getElementById('col3Icon');
      const col3Title = document.getElementById('col3Title');
      const col3content = document.getElementById('col3content');
      const col4Icon = document.getElementById('col4Icon');
      const col4Title = document.getElementById('col4Title');
      const col4content = document.getElementById('col4content');

      mainSection.style.backgroundImage = `url(${data[0].mainImage})`;
      mainTitle.innerText = data[0].mainTitle;
      subTitle.innerText = data[0].subTitle;
      bottomTitle.innerText = data[0].bottomTitle;
      bottomTapColor.style.backgroundColor = data[0].bottomColor;
      col1Title.innerText = data[0].title1;
      col2Title.innerText = data[0].title2;
      col3Title.innerText = data[0].title3;
      col4Title.innerText = data[0].title4;
      col1content.innerText = data[0].content1;
      col2content.innerText = data[0].content2;
      col3content.innerText = data[0].content3;
      col4content.innerText = data[0].content4;
      col1Icon.setAttribute('class', `h2 text-body bottomIcon ${data[0].icon1}`);
      col2Icon.setAttribute('class', `h2 text-body bottomIcon ${data[0].icon2}`);
      col3Icon.setAttribute('class', `h2 text-body bottomIcon ${data[0].icon3}`);
      col4Icon.setAttribute('class', `h2 text-body bottomIcon ${data[0].icon4}`);
    });
};
loadmainboardInfo();
