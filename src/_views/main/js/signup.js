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
  // if (!email.value.trim()) return alert('이메일을 입력해주세요.');
  // if (!name.value.trim()) return alert('이름을 입력해주세요.');
  // if (!nickname.value.trim()) return alert('닉네임을 입력해주세요.');
  // if (!password.value.trim()) return alert('패스워드를 입력해 주세요.');
  // if (!confirmPassword.value.trim()) return alert('확인 패스워드를 입력해 주세요.');
  // if (!address.value.trim()) return alert('주소를 입력해 주세요.');
  // if (!subAddress.value.trim()) return alert('상세 주소를 입력해주세요.');
  // if (!tel.value.trim()) return alert('연락처를 입력해주세요.');

  /* 정규식 검사 */
  const emailRegexp = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordRegexp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/;
  const nameRegexp = /[가-힣]/;
  const nicknameRegexp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

  if (!emailRegexp.test(email.value)) return alert('이메일 형식이 일치하지 않습니다.');
  if (!passwordRegexp.test(password.value)) return alert('패스워드는 영문, 숫자, 특수문자를 최소 1가지 이상 조합해야 합니다.');
  if (!nameRegexp.test(name.value)) return alert('이름은 한글만 입력이 가능합니다.');
  if (!nicknameRegexp.test(nickname.value)) return alert('닉네임은 한글, 영문, 숫자만 조합이 가능합니다.');

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

  if (status === 201) {
    alert('가입이 완료되었습니다.');
    window.location.href = '/login';
  } else {
    alert('가입에 실패하였습니다.\n입력 정보를 확인해주세요.');
  }
});

address.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
      // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var roadAddr = data.roadAddress; // 도로명 주소 변수
      var jibunAddr = data.jibunAddress; // 지번 주소 변수
      // 우편번호와 주소 정보를 해당 필드에 넣는다.

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
    this.address = address.value + subAddress.value;
    this.tel = tel.value;
  }
}
