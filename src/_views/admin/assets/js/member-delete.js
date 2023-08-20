// 회원 정보 조회 - id, name, email, nickname, is_admin
const loadMembers = async () => {
  const response = await fetch('/admin-members');
  const data = await response.json();
  const tableBodyEl = document.querySelector('#member-table-body');
  const tempHtml = createTempHtml(data);
  tableBodyEl.innerHTML = tempHtml;

  // 삭제 버튼 추출
  const deleteBtn = document.querySelectorAll('.btn-danger');
  deleteBtn.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const memberId = e.target.getAttribute('data-member-id');
      const isDelete = confirm('정말 삭제하시겠습니까?');
      if (!isDelete) return;
      const response = await fetch(`/admin-members/${memberId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        location.reload();
      } else {
        alert(result.message);
      }
    });
  });
};
loadMembers();

// 테이블 row html 생성 메서드
const createTempHtml = (membersData) => {
  return membersData
    .map((member) => {
      const { id, name, email, nickname, isAdmin } = member;
      return `<tr>
                <th scope="row">${id}</th>
                <td>${name}</td>
                <td>${email}</td>
                <td>${nickname}</td>
                <td>${isAdmin}</td>
                <td>
                    <button data-member-id="${id}" class="btn btn-danger">삭제</button>
                </td>
             </tr>`;
    })
    .join('');
};
