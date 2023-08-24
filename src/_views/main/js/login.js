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
      if (data.message === '비밀번호가 틀렸습니다.') {
        alert('비밀번호가 틀렸습니다. 다시 시도해주세요.');
      } else {
        alert('이메일 주소와 비밀번호를 확인해주세요.');
      }
    }
  } catch (error) {
    alert('로그인 도중 오류가 발생했습니다.');
    console.error(error);
  }
});
