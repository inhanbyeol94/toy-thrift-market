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
      console.log(data);
      const documentList = document.getElementById('documentList');
      data.forEach((doc) => {
        const liElement = document.createElement('li');
        liElement.classList.add('mb-0');

        const aElement = document.createElement('a');
        aElement.classList.add('nav-link-style', 'd-flex', 'align-items-center', 'border-bottom', 'pb-3', 'mb-3');
        aElement.href = `/document?id=${doc.id}`;

        const iElement = document.createElement('i');
        iElement.classList.add('ci-book', 'opacity-60', 'me-2');
        aElement.appendChild(iElement);

        const spanElement = document.createElement('span');
        spanElement.textContent = doc.title;
        aElement.appendChild(spanElement);

        liElement.appendChild(aElement);
        documentList.appendChild(liElement);
      });
    });
};
loadDocuments();

const writeDocBtn = document.getElementById('writeDocBtn');
writeDocBtn.addEventListener('click', async () => {
  window.location.href = `/document-write?id=${boardId}`;
});
