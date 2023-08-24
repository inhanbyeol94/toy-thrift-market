const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// 게시물 상세조회
const loadDoc = async () => {
  fetch(`/documents/detail/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const title = document.getElementById('title');
      const content = document.getElementById('content');
      const nickname = document.getElementById('documentWriter');
      const docCreatedAt = document.getElementById('docCreatedAt');
      const docUpdatetedAt = document.getElementById('docUpdatetedAt');

      title.innerText = data.title;
      content.innerText = data.content;
      nickname.innerText = `작성자: ${data.member.nickname}`;
      docCreatedAt.innerText = `등록일: ${new Date(data.createdAt).toLocaleDateString()}`;
      docUpdatetedAt.innerText = `최근 수정일: ${new Date(data.updatedAt).toLocaleDateString()}`;
    });
};
loadDoc();

// 게시물 수정
const editDocBtn = document.getElementById('editDocBtn');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

editDocBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const editTitleInput = document.getElementById('editTitle');
  const editContentInput = document.getElementById('editContent');
  editTitleInput.value = document.getElementById('title').textContent;
  editContentInput.value = document.getElementById('content').textContent;
  editModal.show();
});

const saveChangesBtn = document.getElementById('saveChangesBtn');
saveChangesBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const editedTitle = document.getElementById('editTitle').value;
  const editedContent = document.getElementById('editContent').value;

  const data = {
    title: editedTitle,
    content: editedContent,
  };

  fetch(`/documents/edit/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      window.location.reload();
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
  editModal.hide();
});

// 게시물 삭제
const deleteDocBtn = document.getElementById('deleteDocBtn');
deleteDocBtn.addEventListener('click', (event) => {
  event.preventDefault();
  deleteDoc();
});

const deleteDoc = async () => {
  let check = confirm('삭제하시겠습니까?');
  if (check) {
    const api = await fetch(`/documents/${id}`, {
      method: 'DELETE',
    });
    const { status } = await api;
    const { message } = await api.json();

    alert(message);
    if (status === 200) return window.location.assign('/');
  }
};

// 댓글 조회
const loadComment = () => {
  fetch(`/comments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const commentContainer = document.getElementById('commentContainer');
      data.forEach((comment) => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';
        commentCard.innerHTML = `
          <div class="d-flex align-items-start py-4">
            <div class="ps-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fs-md mb-1">${comment.member.nickname}</h6>
              </div>
              <p class="fs-md text-muted mb-1">${comment.content}</p>
              <span class="fs-ms text-muted"><i class="ci-time align-middle me-2 mb-3"></i>${new Date(comment.createdAt).toLocaleDateString()}</span>
              <span class="fs-ms text-muted"><i class="ci-time align-middle me-2 mb-3"></i>${new Date(comment.updatedAt).toLocaleDateString()}</span>
              <div>
                <button class="btn btn-primary btn-sm edit-comment-btn" type="submit" id="editConmmentBtn" data-comment-id="${comment.id}">수정</button>
                <button class="btn btn-primary btn-sm delete-comment-btn" type="submit" id="deleteCommentBtn" data-comment-id="${comment.id}">삭제</button>
              </div>
              </div>
          </div>
          <hr>
        `;
        commentContainer.appendChild(commentCard);
      });

      // 댓글 수정 모달
      const editCommentModal = new bootstrap.Modal(document.getElementById('editCommentModal'));

      // 댓글 수정 버튼 클릭 시
      const editCommentButtons = document.querySelectorAll('.edit-comment-btn');
      editCommentButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const commentId = button.getAttribute('data-comment-id');
          const commentCard = button.closest('.comment-card');
          const commentContent = commentCard.querySelector('.fs-md.text-muted.mb-1').textContent;
          const editCommentContent = document.getElementById('editCommentContent');
          editCommentContent.value = commentContent;

          editCommentModal.show();

          // 저장 버튼 클릭 시
          const saveCommentChangesBtn = document.getElementById('saveCommentChangesBtn');
          saveCommentChangesBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const editedCommentContent = editCommentContent.value;

            const data = {
              content: editedCommentContent,
            };

            fetch(`/comments/${commentId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then((data) => {
                alert(data.message);
                window.location.reload();
              })
              .catch((error) => {
                alert('Error: ' + error.message);
              });

            editCommentModal.hide();
          });
        });
      });

      // 댓글 삭제
      const deleteCommentBtn = document.querySelectorAll('.delete-comment-btn');
      deleteCommentBtn.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const commentId = button.getAttribute('data-comment-id');
          deleteComment(commentId);
        });
      });

      const deleteComment = async (commentId) => {
        let check = confirm('삭제하시겠습니까?');
        if (check) {
          const api = await fetch(`/comments/${commentId}`, {
            method: 'DELETE',
          });
          const { status } = await api;
          const { message } = await api.json();

          alert(message);
          if (status === 200) return window.location.reload();
        }
      };
    });
};
loadComment();

// 댓글 작성
const commentSubmitBtn = document.getElementById('commentSubmitBtn');
commentSubmitBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const contentInput = document.getElementById('contentInput');
  const content = contentInput.value;

  if (!content) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        documentId: id,
      }),
    });

    if (response.status === 201) {
      alert('댓글이 작성되었습니다.');
      window.location.reload();
    } else {
      alert('댓글 작성에 실패했습니다.');
    }
  } catch (error) {
    console.error('댓글 작성 에러:', error);
  }
});
