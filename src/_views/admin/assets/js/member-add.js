// 회원목록 조회
const memberTag = document.querySelector('#memberList');
const memberData = async () => {
  const res = await fetch('/admin-members', { method: 'GET' });

  const members = await res.json();

  // 회원 목록 렌더링
  members.forEach((member) => {
    memberTag.innerHTML += `
    <tr>
              <td >${member.email}</td>
              <td >${member.name}</td>
              <td> ${member.nickname}</td>
              <td>${member.tel}</td>
              <td>${member.address}</td>
              <td>${member.subAddress}</td>
              <td> ${member.isAdmin}</td>
              
            </tr>
  `;
  });
};
memberData();

// 회원 추가
const addMemberButton = document.querySelector('#all-submit');
addMemberButton.addEventListener('click', async () => {
  const email = document.querySelector('#email').value;
  const name = document.querySelector('#name').value;
  const nickname = document.querySelector('#nickname').value;
  const password = document.querySelector('#password').value;
  const tel = document.querySelector('#tel').value;
  const address = document.querySelector('#address').value;
  const subAddress = document.getElementById('subAddress').value;
  const isAdmin = document.querySelector('#isAdmin').checked;
  const newMember = {
    email,
    name,
    nickname,
    password,
    tel,
    address,
    subAddress,
    isAdmin,
  };
  // 필수값 검증
  if (!email.trim()) return alert('이메일을 입력해주세요.');
  if (!name.trim()) return alert('이름을 입력해주세요.');
  if (!nickname.trim()) return alert('닉네임을 입력해주세요.');
  if (!address.trim()) return alert('주소를 입력해주세요.');
  if (!tel.trim()) return alert('연락처를 입력해주세요.');
  if (!subAddress.trim()) return alert('상세 주소를 입력해주세요.');

  /* 정규식 검사 */
  const emailRegexp = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const nameRegexp = /[가-힣]/;
  const nicknameRegexp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
  const telRegexp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

  if (!emailRegexp.test(email)) return alert('이메일 형식이 일치하지 않습니다.');
  if (!nameRegexp.test(name)) return alert('이름은 한글만 입력이 가능합니다.');
  if (!nicknameRegexp.test(nickname)) return alert('닉네임은 한글,영문,숫자만 조합이 가능합니다.');
  if (!telRegexp.test(tel)) return alert('핸드폰 번호 형식에 일치하지 않습니다. ( - ) 을 포함한 010으로 시작하는 휴대폰 번호를 입력해주세요.');

  // 문자열 길이 검사
  if (email.length > 50) return alert('이메일을 최대 50자 이내 입력해주세요.');
  if (name.length > 5 || name.length < 2) return alert('이름은 최소 2자이상 5자 이하로 입력해주세요.');
  if (nickname.length < 2 || nickname.length > 10) return alert('닉네임은 최소 2자이상 10자 이하로 입력해주세요.');
  if (tel.length > 13) return alert('휴대폰 번호는 "-" 포함 최대 13자 미만으로 입력해주세요.');

  const res = await fetch('/admin-members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMember),
  });
  const { status } = await res;
  const newMembers = await res.json();

  if (status === 201) {
    alert(newMembers.message);
    window.location.reload();
  } else {
    alert('오류가 발생하였습니다.');
  }
});
document.getElementById('address').addEventListener('click', () => {
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
