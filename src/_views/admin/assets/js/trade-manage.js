const loadTrades = async () => {
  const api = await fetch('/trades', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await api.json();
  console.log(result);
  const tradeList = document.getElementById('tradeList');
  result.forEach((trade) => {
    const { id, status } = trade;
    const productname = trade.product.name;
    const buyer = trade.member.name;

    const cancleButton = document.createElement('button');
    cancleButton.classList.add('btn', 'btn-link');
    cancleButton.setAttribute('data-id', id);
    cancleButton.textContent = '취소';

    cancleButton.addEventListener('click', (event) => {
      event.preventDefault();
      cancleTrade(id);
    });

    const buttonCell = document.createElement('td');
    buttonCell.appendChild(cancleButton);

    const newRow = document.createElement('tr');
    newRow.classList.add('member-row');
    newRow.innerHTML = `
          <td>${id}</td>
          <td>${status}</td>
          <td>${productname}</td>
          <td>${buyer}</td>
        `;
    newRow.appendChild(buttonCell);
    tradeList.appendChild(newRow);
  });
};
loadTrades();

const cancleTrade = async (tradeId) => {
  let check = confirm('취소처리 하시겠습니까?');
  if (check) {
    const api = await fetch(`/paymembercheck/cancle/${tradeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // const result = await api.json();
    location.reload();
  }
};
