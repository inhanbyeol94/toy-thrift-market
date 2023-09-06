const name = document.getElementById('name');
const email = document.getElementById('email');
const nickname = document.getElementById('nickname');
const address = document.getElementById('address');
const subAddress = document.getElementById('subAddress');
const tel = document.getElementById('tel');
const profileImage = document.getElementById('memberImage');
const profileImg = document.getElementById('profileImg');
const deletePW = document.getElementById('textPW');
const editpassWord = document.getElementById('newPW');
const confirmPW = document.getElementById('confirmPW');

// 멤버 정보 가져오기
async function memberData() {
  const res = await fetch('/members', { method: 'GET' });
  const member = await res.json();

  name.value = member.name;
  email.value = member.email;
  nickname.value = member.nickname;
  address.value = member.address;
  subAddress.value = member.subAddress;
  tel.value = member.tel;
  profileImg.setAttribute('src', member.profileImage);
  return member;
}
// 멤버정보 수정
async function updateMemberInfo() {
  // 필수값 검증
  if (!email.value.trim()) return alert('이메일을 입력해주세요.');
  if (!name.value.trim()) return alert('이름을 입력해주세요.');
  if (!nickname.value.trim()) return alert('닉네임을 입력해주세요.');
  if (!address.value.trim()) return alert('주소를 입력해주세요.');
  // if (!tel.value.trim()) return alert('연락처를 입력해주세요.');
  if (!subAddress.value.trim()) return alert('상세 주소를 입력해주세요.');

  /* 정규식 검사 */
  const emailRegexp = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const nameRegexp = /[가-힣]/;
  const nicknameRegexp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
  // const telRegexp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

  if (!emailRegexp.test(email.value)) return alert('이메일 형식이 일치하지 않습니다.');
  if (!nameRegexp.test(name.value)) return alert('이름은 한글만 입력이 가능합니다.');
  if (!nicknameRegexp.test(nickname.value)) return alert('닉네임은 한글,영문,숫자만 조합이 가능합니다.');
  // if (!telRegexp.test(tel.value)) return alert('핸드폰 번호 형식에 일치하지 않습니다. ( - ) 을 포함한 010으로 시작하는 휴대폰 번호를 입력해주세요.');

  // 문자열 길이 검사
  if (email.value.length > 50) return alert('이메일을 최대 50자 이내 입력해주세요.');
  if (name.value.length > 5 || name.length < 2) return alert('이름은 최소 2자이상 5자 이하로 입력해주세요.');
  if (nickname.value.length < 2 || nickname.length > 10) return alert('닉네임은 최소 2자이상 10자 이하로 입력해주세요.');
  // if (tel.value.length > 13) return alert('휴대폰 번호는 "-" 포함 최대 13자 미만으로 입력해주세요.');

  // S3
  let formData = new FormData();

  formData.append('name', name.value);
  formData.append('email', email.value);
  formData.append('nickname', nickname.value);
  formData.append('address', address.value);
  formData.append('subAddress', subAddress.value);
  formData.append('tel', tel.value);
  formData.append('file', profileImage.files[0]);

  try {
    const response = await fetch('/members', {
      method: 'PATCH',

      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(result.message || '회원 정보 업데이트에 실패했습니다.');
    }
  } catch (error) {
    alert('요청 처리 중 오류가 발생했습니다.');
  }
}

// 비밀번호 변경
async function editPassword() {
  if (!editpassWord.value.trim() || !confirmPW.value.trim()) {
    alert('새로운 비밀번호와 확인 비밀번호를 입력해주세요.');
    return;
  }

  if (editpassWord.value !== confirmPW.value) {
    alert('새로운 비밀번호와 확인 비밀빈호가 일치하지 않습니다.');
    return;
  }

  const pwData = {
    password: password.value,
    newPassword: editpassWord.value,
    confirmPassword: confirmPW.value,
  };
  try {
    const response = await fetch(`/members/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pwData),
    });
    const result = await response.json();
    if (response.ok) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } else {
      alert(result.message || '비밀번호 변경에 실패했습니다.');
    }
  } catch (err) {
    alert('비밀번호 변경중 오류가 발생하였습니다.');
  }
}

// 회원탈퇴
async function deleteMember() {
  const notion = prompt('[알림] 탈퇴를 원하시면 "동의합니다" 라고 적어주세요.');

  if (!notion) {
    alert('텍스트를 적어주세요.');
    return;
  }
  if (notion !== '동의합니다') {
    alert('"동의합니다" 라고 정확히 입력해주세요.');
    return;
  }
  console.log(deletePW.value);
  if (!deletePW.value.trim()) return alert('비밀번호를 입력해주세요.');
  if (deletePW.value.length < 8) return alert('비밀번호는 최소8자 이상입니다.');
  try {
    const response = await fetch('/members', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePW.value }),
    });
    if (response.ok) {
      alert('회원탈퇴가 완료되었습니다. 감사합니다.');
    } else {
      const result = await response.json();
      console.log(result);
      alert(result.message || '회원탈퇴중 오류가 발생하였습니다.');
    }
  } catch (err) {
    console.error(err);
    alert('처리중 오류가 발생하였습니다.');
  }
}
memberData();
// 변경 버튼 클릭시 이벤트생성
document.getElementById('saveButton').addEventListener('click', updateMemberInfo);
// 비밀번호 변경버튼 클릭시 이벤트 생성
document.getElementById('editButton').addEventListener('click', editPassword);
// 회원탈퇴 클릭시 이벤트생성
document.getElementById('deleteButton').addEventListener('click', deleteMember);

// 주소 등록시 daum 주소창 나오게함
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

const sidebarMenu = document.querySelector('#my-profile');
sidebarMenu.classList.add('active');
