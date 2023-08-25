const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');

const submitDocBtn = document.getElementById('submitDocBtn');
submitDocBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const isSecret = document.getElementById('isSecret').checked;
  if (!title) {
    alert('글 제목을 입력해주세요.');
    return;
  }
  if (!content) {
    alert('글 내용을 입력해주세요.');
    return;
  }
  if (!isSecret) {
    alert('비밀글 여부를 선택해주세요.');
    return;
  }

  const newDoc = {
    title,
    content,
    isSecret,
    boardId,
  };

  const res = await fetch('/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newDoc),
  });
  const { status } = await res;
  const respond = await res.json();

  if (status === 201) {
    alert(respond.message);
    window.location.assign(`/board?id=${boardId}`);
  } else {
    alert(respond.message);
  }
});
