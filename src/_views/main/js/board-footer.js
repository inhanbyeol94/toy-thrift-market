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
        const liElement = document.createElement('li');
        liElement.classList.add('widget-list-item', 'ms-4');

        const aElement = document.createElement('a');
        aElement.classList.add('widget-list-link', 'fs-ms');
        aElement.href = `/board?id=${board.id}`;
        aElement.textContent = board.name;

        liElement.appendChild(aElement);
        boardList.appendChild(liElement);
      });
    });
};

loadBoards();
