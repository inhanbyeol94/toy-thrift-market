const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
  const api = await fetch('/auth', {
    method: 'DELETE',
  });

  const { status } = await api;

  if (status == 200) return (window.location.href = '/');
});

const loadCategories = async () => {
  fetch('/categories/large', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};
loadCategories();
