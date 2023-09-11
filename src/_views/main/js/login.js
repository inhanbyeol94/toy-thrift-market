const loginBtnEl = document.querySelector('#login-button');

loginBtnEl.addEventListener('click', async () => {
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;
  // 필수값 검증
  if (!email.trim()) return alert('이메일을 입력해주세요.');
  if (!password.trim()) return alert('비밀번호를 입력해주세요.');
  // 정규식 검사
  const emailRegexp = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordRegexp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/;
  if (!emailRegexp.test(email)) return alert('이메일 주소와 비밀번호를 확인해주세요.');
  if (!passwordRegexp.test(password)) return alert('이메일 주소와 비밀번호를 확인해주세요.');
  // 문자열 길이 검사
  if (email.length < 8 || email.length > 50) return alert('이메일 주소와 비밀번호를 확인해주세요.');
  if (password.length < 8 || password.length > 20) return alert('이메일 주소와 비밀번호를 확인해주세요.');

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

const loginGoogle = () => {
  location.href = '/auth/google/login';
};
