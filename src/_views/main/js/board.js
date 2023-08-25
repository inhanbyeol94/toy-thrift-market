const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');

const loadDocuments = async () => {
  fetch(`/documents/${boardId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const documentList = document.getElementById('documentList');
      data.forEach((doc) => {
        const liElement = document.createElement('li');
        liElement.classList.add('mb-0');

        const aElement = document.createElement('a');
        aElement.classList.add('nav-link-style', 'd-flex', 'align-items-center', 'border-bottom', 'pb-3', 'mb-3');
        aElement.href = '#';

        const iElement = document.createElement('i');
        iElement.classList.add('ci-book', 'opacity-60', 'me-2');
        aElement.appendChild(iElement);

        const spanElement = document.createElement('span');
        spanElement.textContent = doc.title;
        aElement.appendChild(spanElement);

        if (doc.isSecret) {
          const imgElement = document.createElement('img');
          imgElement.src = '/main/img/secretImg.png';
          imgElement.classList.add('ml-4');
          imgElement.style.maxHeight = '1em';
          imgElement.style.verticalAlign = 'middle';
          aElement.appendChild(imgElement);
        }

        liElement.appendChild(aElement);
        documentList.appendChild(liElement);

        aElement.addEventListener('click', (event) => {
          event.preventDefault();
          documentDetail(doc.id);
        });
      });
    });
};
loadDocuments();

const writeDocBtn = document.getElementById('writeDocBtn');
writeDocBtn.addEventListener('click', async () => {
  const response = await fetch('/members/current-user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const userData = await response.json();

  const boardResponse = await fetch(`/admin-boards/${boardId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const boardData = await boardResponse.json();

  if (userData.isAdmin) {
    window.location.href = `/document-write?id=${boardId}`;
  } else if (boardData.documentAuthority) {
    window.location.href = `/document-write?id=${boardId}`;
  } else {
    alert('작성 권한이 없습니다.');
  }
});

// 게시글 상세페이지로 이동 (비밀글 열람 권한 포함)
const documentDetail = async (documentId) => {
  const response = await fetch(`/documents/detail/${documentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const documentData = await response.json();

  const userResponse = await fetch('/members/current-user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const userData = await userResponse.json();

  if (userData.isAdmin || userData.id === documentData.member.id) {
    window.location.href = `/document?id=${documentId}`;
  } else if (documentData.isSecret) {
    alert('비밀글입니다. 열람 권한이 없습니다.');
  } else {
    window.location.href = `/document?id=${documentId}`;
  }
};
