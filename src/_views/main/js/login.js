const loginBtnEl = document.querySelector('#login-button');

loginBtnEl.addEventListener('click', async () => {
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  try {
    const response = await fetch(`/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
    // 로그인 성공시
    if (response.ok) {
      window.location.href = '/';
    } else {
      console.error(data.message);
    }
  } catch (error) {
    alert('로그인 도중 오류가 발생했습니다.');
    console.error(error);
  }
});
