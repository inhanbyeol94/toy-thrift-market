window.onload = function () {
  loadMembers();
};

function loadMembers() {
  fetch('/admin-members', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const MemberList = document.getElementById('MemberList');

      data.forEach((member) => {
        const { id, email, name, nickname, profileImage, tel, address, isAdmin } = member;
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.setAttribute('data-id', id);
        editButton.textContent = '수정';

        editButton.addEventListener('click', () => {
          // 모달을 열고 회원 정보를 채워 넣는 로직
          openEditModal(member);
        });

        const buttonCell = document.createElement('td');
        buttonCell.appendChild(editButton);

        const newRow = document.createElement('tr');
        newRow.classList.add('member-row');
        newRow.innerHTML = `
          <td>${id}</td>
          <td>${email}</td>
          <td>${name}</td>
          <td>${nickname}</td>
          <td>${profileImage}</td>
          <td>${tel}</td>
          <td>${address}</td>
          <td>${isAdmin}</td>
        `;

        newRow.appendChild(buttonCell);
        MemberList.appendChild(newRow);
        // 여기까지 추가된 코드 블록
      });
    });
}

function openEditModal(member) {
  const editModal = document.getElementById('editModal');
  editModal.style.display = 'block';

  const editForm = document.getElementById('editForm');
  const editName = document.getElementById('editName');
  const editNickname = document.getElementById('editNickname');
  const editProfileImage = document.getElementById('editProfileImage');
  const editTel = document.getElementById('editTel');
  const editAddress = document.getElementById('editAddress');
  const subAddress = document.getElementById('subAddress');

  editName.value = member.name;
  editNickname.value = member.nickname;
  editProfileImage.value = member.profileImage;
  editTel.value = member.tel;
  editAddress.value = member.address;
  subAddress.value = member.subAddress;

  editAddress.addEventListener('click', () => {
    new daum.Postcode({
      oncomplete: function (data) {
        let roadAddr = data.roadAddress;
        let jibunAddr = data.jibunAddress;

        if (roadAddr !== '') {
          editAddress.value = roadAddr;
        } else if (jibunAddr !== '') {
          editAddress.value = jibunAddr;
        }
      },
    }).open();
  });

  editForm.onsubmit = function (event) {
    event.preventDefault();

    const editIsAdminTrue = document.getElementById('editIsAdminTrue');
    const editIsAdminFalse = document.getElementById('editIsAdminFalse');
    const isAdminValue = editIsAdminTrue.checked ? true : editIsAdminFalse.checked ? false : undefined;

    if (isAdminValue === undefined) {
      // 어느 버튼도 선택되지 않았을 경우에 대한 처리
      alert('관리자 여부를 선택해주세요.');
      return;
    }

    const updatedMemberData = {
      name: editName.value,
      nickname: editNickname.value,
      password: editPassword.value,
      profileImage: editProfileImage.value,
      tel: editTel.value,
      address: editAddress.value,
      isAdmin: isAdminValue,
    };
    // 수정 API 요청
    fetch(`/admin-members/${member.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMemberData),
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (response.ok) {
          window.location.reload();
          editModal.style.display = 'none';
        } else {
          let errorMessage = '오류가 발생했습니다.';
          if (responseData && responseData.message) {
            errorMessage = responseData.message;
          } else if (response.statusText) {
            errorMessage = response.statusText;
          }
          console.error('API 요청 중 오류 발생:', errorMessage);
          alert(errorMessage);
        }
      })
      .catch((error) => {
        console.error('API 요청 중 오류 발생:', error);
        alert('API 요청 중 오류가 발생했습니다.');
      });
  };

  const closeButton = document.querySelector('.close');
  closeButton.onclick = function () {
    editModal.style.display = 'none';
  };
}

function autoHyphen2(target) {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
}
