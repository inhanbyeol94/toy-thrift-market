const params = new URLSearchParams(window.location.search);
const id = params.get('id');

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

      title.innerText = data.title;
      content.innerText = data.content;
    });
};
loadDoc();

const editDocBtn = document.getElementById('editDocBtn');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

editDocBtn.addEventListener('click', () => {
  const editTitleInput = document.getElementById('editTitle');
  const editContentInput = document.getElementById('editContent');
  editTitleInput.value = document.getElementById('title').textContent;
  editContentInput.value = document.getElementById('content').textContent;
  editModal.show();
});

const saveChangesBtn = document.getElementById('saveChangesBtn');
saveChangesBtn.addEventListener('click', () => {
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

const deleteDocBtn = document.getElementById('deleteDocBtn');
deleteDocBtn.addEventListener('click', () => {
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
