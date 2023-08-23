const email = document.getElementById('email');
const name = document.getElementById('name');
const nickname = document.getElementById('nickname');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const address = document.getElementById('address');
const subAddress = document.getElementById('subAddress');
const tel = document.getElementById('tel');
const signupBtn = document.getElementById('signupBtn');

signupBtn.addEventListener('click', async () => {
  /* 필수 값 검증 */
  if (!email.value.trim()) return alert('이메일을 입력해주세요.');
  if (!name.value.trim()) return alert('이름을 입력해주세요.');
  if (!nickname.value.trim()) return alert('닉네임을 입력해주세요.');
  if (!password.value.trim()) return alert('패스워드를 입력해 주세요.');
  if (!confirmPassword.value.trim()) return alert('확인 패스워드를 입력해 주세요.');
  if (!address.value.trim()) return alert('주소를 입력해 주세요.');
  if (!subAddress.value.trim()) return alert('상세 주소를 입력해주세요.');
  if (!tel.value.trim()) return alert('연락처를 입력해주세요.');

  /* 정규식 검사 */
  const emailRegexp = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordRegexp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/;
  const nameRegexp = /[가-힣]/;
  const nicknameRegexp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
  const telRegexp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

  if (!emailRegexp.test(email.value)) return alert('이메일 형식이 일치하지 않습니다.');
  if (!passwordRegexp.test(password.value)) return alert('패스워드는 영문, 숫자, 특수문자를 최소 1가지 이상 조합해야 합니다.');
  if (!nameRegexp.test(name.value)) return alert('이름은 한글만 입력이 가능합니다.');
  if (!nicknameRegexp.test(nickname.value)) return alert('닉네임은 한글, 영문, 숫자만 조합이 가능합니다.');
  if (!telRegexp.test(tel.value)) return alert('핸드폰 번호 형식에 일치하지 않습니다. 하이픈을 포함한 010으로 시작하는 휴대폰 번호를 입력해주세요.');

  /* 패스워드, 확인 패스워드 일치여부 검사 */
  if (password.value !== confirmPassword.value) return alert('패스워드와 확인 패스워드가 일치하지 않습니다.');

  /* 문자열 길이 검사 */
  if (email.value.length > 50) return alert('이메일은 최대 50자 이내 입력해주세요.');
  if (name.value.length < 2 || name.value.length > 5) return alert('이름은 최소 2자이상 5자 이하로 입력해주세요.');
  if (nickname.value.length < 2 || nickname.value.length > 10) return alert('닉네임은 최소 2자이상 10자 이하로 입력해주세요.');
  if (password.value.length < 8 || confirmPassword.value.length > 20) return alert('패스워드는 최소 8자이상 20자 이하로 입력해주세요.');
  if (tel.value.length > 13) return alert('휴대폰 번호는 하이픈 포함 최대 13자 미만으로 입력해 주세요.');

  const api = await fetch('/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new createUser()),
  });

  const { status } = await api;
  const { message } = await api.json();

  alert(message);
  if (status === 201) return (window.location.href = '/login');
});

address.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      let roadAddr = data.roadAddress;
      let jibunAddr = data.jibunAddress;

      if (roadAddr !== '') {
        document.getElementById('address').value = roadAddr;
      } else if (jibunAddr !== '') {
        document.getElementById('address').value = jibunAddr;
      }
    },
  }).open();
});

function autoHyphen2(target) {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
}

class createUser {
  constructor() {
    this.email = email.value;
    this.name = name.value;
    this.nickname = nickname.value;
    this.password = password.value;
    this.address = (address.value + subAddress.value).trim();
    this.tel = tel.value;
  }
}
