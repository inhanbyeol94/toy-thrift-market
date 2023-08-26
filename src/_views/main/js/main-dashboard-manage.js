const loadmainboardInfo = async () => {
  fetch('admin-mainboards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const mainTitle = document.getElementById('mainTitle');
      const subTitle = document.getElementById('subTitle');
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

      mainTitle.innerText = data[0].mainTitle;
      subTitle.innerText = data[0].subTitle;
      bottomTitle.innerText = data[0].bottomTitle;
      col1Title.innerText = data[0].columns[0].title;
      col2Title.innerText = data[0].columns[1].title;
      col3Title.innerText = data[0].columns[2].title;
      col4Title.innerText = data[0].columns[3].title;
      col1content.innerText = data[0].columns[0].content;
      col2content.innerText = data[0].columns[1].content;
      col3content.innerText = data[0].columns[2].content;
      col4content.innerText = data[0].columns[3].content;
      // col1Icon.innerHTML = `<img src=${data[0].columns[0].icon} width="52" alt="Quality Guarantee" id="col1Icon">`;
      // col2Icon.innerHTML = `<img src=${data[0].columns[1].icon} width="52" alt="Quality Guarantee" id="col2Icon">`;
      // col3Icon.innerHTML = `<img src=${data[0].columns[2].icon} width="52" alt="Quality Guarantee" id="col3Icon">`;
      // col4Icon.innerHTML = `<img src=${data[0].columns[3].icon} width="52" alt="Quality Guarantee" id="col4Icon">`;
    });
};
loadmainboardInfo();
