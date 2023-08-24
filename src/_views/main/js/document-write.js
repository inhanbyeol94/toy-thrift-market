const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');

// const token = 'xoxb-5780611130694-5793352678868-mUhGbgFqpOpdqRibvkdQ9fbh';
// const slackAPIUrl = 'https://slack.com/api/chat.postMessage';

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

  // // 슬랙 API 호출
  // const slackRes = await fetch(slackAPIUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({
  //     channel: '#najunge',
  //     text: '새로운 게시글이 등록되었습니다.',
  //   }),
  // });

  // const { status: slackStatus } = await slackRes;

  // if (slackStatus === 200) {
  //   alert('메시지가 전송되었습니다.');
  // } else {
  //   alert('메시지 전송에 실패하였습니다.');
  // }

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
