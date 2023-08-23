const loadBoards = async () => {
  fetch('/admin-boards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const boardList = document.getElementById('boardList');
      data.forEach((board) => {
        const { id, name, documentAuthority, commentAuthority } = board;
        const docAuth = documentAuthority ? '있음' : '없음';
        const comAuth = commentAuthority ? '있음' : '없음';
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-outline-primary');
        editButton.setAttribute('data-id', id);
        editButton.textContent = '수정';
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-outline-danger');
        deleteButton.setAttribute('data-id', id);
        deleteButton.textContent = '삭제';

        editButton.addEventListener('click', () => {
          openEditModal(board);
        });

        deleteButton.addEventListener('click', () => {
          deleteBoard(id);
        });

        const editButtonCell = document.createElement('td');
        const deleteButtonCell = document.createElement('td');
        editButtonCell.appendChild(editButton);
        deleteButtonCell.appendChild(deleteButton);

        const newRow = document.createElement('tr');
        newRow.classList.add('board-row');
        newRow.innerHTML = `
          <td>${name}</td>
          <td>${docAuth}</td>
          <td>${comAuth}</td>
        `;

        newRow.appendChild(editButtonCell);
        newRow.appendChild(deleteButtonCell);
        boardList.appendChild(newRow);
      });
    });
};
loadBoards();

const boardAddBtn = document.querySelector('.boardAddBtn a');
const boardNameInput = document.querySelector('.post-item-large input');
const documentAuthorityCheckbox = document.getElementById('documentAuthority');
const commentAuthorityCheckbox = document.getElementById('commentAuthority');

boardAddBtn.addEventListener('click', () => {
  const boardName = boardNameInput.value;
  const documentAuthority = documentAuthorityCheckbox.checked;
  const commentAuthority = commentAuthorityCheckbox.checked;

  if (boardName) {
    addBoard(boardName, documentAuthority, commentAuthority);
    boardNameInput.value = '';
  }
});

const addBoard = (boardName, documentAuthority, commentAuthority) => {
  fetch('/admin-boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: boardName,
      documentAuthority: documentAuthority,
      commentAuthority: commentAuthority,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('게시판 추가 완료:', data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('게시판 추가 오류:', error);
    });
};

const openEditModal = (board) => {
  const editModal = document.getElementById('editModal');
  editModal.style.display = 'block';

  const editForm = document.getElementById('editForm');
  const editName = document.getElementById('editName');
  const documentAuthIsChecked = document.getElementById('documentAuth');
  const commentAuthIsChecked = document.getElementById('commentAuth');

  editName.value = board.name;
  documentAuthIsChecked.checked = board.documentAuthority;
  commentAuthIsChecked.checked = board.commentAuthority;

  editForm.onsubmit = function (event) {
    event.preventDefault();
    const documentAuth = document.getElementById('documentAuth').checked;
    const commentAuth = document.getElementById('commentAuth').checked;
    const updatedBoardData = {
      name: editName.value,
      documentAuthority: documentAuth,
      commentAuthority: commentAuth,
    };
    fetch(`/admin-boards/${board.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBoardData),
    })
      .then(async (response) => {
        console.log(documentAuth, commentAuth);
        const responseData = await response.json();
        if (response.ok) {
          window.location.reload();
          editModal.style.display = 'none';
        } else {
          let errorMessage = '오류가 발생했습니다.';
          if (responseData && responseData.message) {
            errorMessage = responseData.message;
          } else if (response.statusText) {
            errorMessage = response.statusText;
          }
          console.error('API 요청 중 오류 발생:', errorMessage);
          alert(errorMessage);
        }
      })
      .catch((error) => {
        console.error('API 요청 중 오류 발생:', error);
        alert('API 요청 중 오류가 발생했습니다.');
      });
  };

  const closeButton = document.querySelector('.close');
  closeButton.onclick = function () {
    editModal.style.display = 'none';
  };
};

const deleteBoard = async (id) => {
  let check = confirm('삭제하시겠습니까?');
  if (check) {
    const api = await fetch(`/admin-boards/${id}`, {
      method: 'DELETE',
    });
    const { status } = await api;
    const { message } = await api.json();

    alert(message);
    if (status === 200) return window.location.reload();
  }
};
