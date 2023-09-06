const accountArea = document.querySelector('#accounts');
loadAccounts();
async function loadAccounts() {
  const response = await fetch(`/easy-passwords`);
  const result = await response.json();
  console.log('🚀 🔶 loadAccounts 🔶 result:', result);

  result.forEach((account) => {
    const accountEl = document.createElement('div');

    const accountNumber = account.bankAccountNumber;
    const accountHtml = `<div class="d-block d-sm-flex align-items-center py-4 border-bottom">
                 
                  <div class="text-center text-sm-start">
                  <!-- 은행 -->
                  <h3 class="h6 product-title mb-2">한별은행</h3>
                  <!-- 계좌번호 -->
                  <div class="d-inline-block text-accent">${accountNumber}</div>
                
                  </div>
              </div>`;
    accountEl.innerHTML = accountHtml; // 에러
    accountArea.appendChild(accountEl);
  });
}
