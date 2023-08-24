const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
  const api = await fetch('/auth', {
    method: 'DELETE',
  });

  const { status } = await api;

  if (status == 200) return (window.location.href = '/');
});
