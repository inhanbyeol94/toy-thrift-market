const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');

const submitDocBtn = document.getElementById('submitDocBtn');
submitDocBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const memberIdInput = document.getElementById('memberId').value;
  const memberId = parseInt(memberIdInput, 10);
  const isSecret = document.getElementById('isSecret').checked;
  const newDoc = {
    title,
    content,
    isSecret,
    memberId,
    boardId,
  };
  console.log(title, content, isSecret, memberId, boardId);
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
