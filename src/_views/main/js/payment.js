const productId = window.location.pathname.split('/payment/')[1];
const productImg = document.getElementById('productImg');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const nameIpt = document.getElementById('nameIpt');
const telIpt = document.getElementById('telIpt');
const resistNumber = document.getElementById('resistNumber');
const identifyBtn = document.getElementById('identifyBtn');
const identityVerifyBtn = document.getElementById('identityVerifyBtn');
const codeIpt = document.getElementById('codeIpt');
const accountNumItp = document.getElementById('accountNumItp');
const accuntPasswordIpt = document.getElementById('accuntPasswordIpt');
const paySubmitBtn = document.getElementById('paySubmitBtn');
let sequence;

const loadProductInfo = async () => {
  await fetch(`/products/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      productImg.setAttribute('src', data.productImages[0].imageUrl);
      productName.innerText = data.name;
      productPrice.innerText = data.price + ' ₩';
      productImg.parentNode.setAttribute('href', `/product/${data.id}`);
    });
};
loadProductInfo();

telIpt.addEventListener('input', () => {
  autoHyphen2(telIpt);
});

identifyBtn.addEventListener('click', async () => {
  if (!nameIpt.value) return alert('이름을 입력해주세요');
  if (!telIpt.value) return alert('휴대폰번호를 입력해주세요');
  if (!resistNumber.value) return alert('주민등록번호를 입력해주세요');

  try {
    await fetch('/paymembercheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameIpt.value,
        tel: telIpt.value,
        resistNumber: resistNumber.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(data.message);
        document.getElementById('codeBox').style.display = 'block';

        sequence = data.sequence;
      });
  } catch (err) {
    console.error(err);
  }
});

identityVerifyBtn.addEventListener('click', async () => {
  if (!codeIpt.value) return alert('인증번호를 입력해주세요');

  const api = await fetch('/paymembercheck/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: telIpt.value,
      code: codeIpt.value,
      sequence,
    }),
  });

  const { status } = await api;
  const result = await api.json();

  alert(result.message);

  if (status === 201) {
    sequence = result.sequence;
  }
});

paySubmitBtn.addEventListener('click', async () => {
  if (!accountNumItp.value) return alert('계좌번호를 입력해주세요');
  if (!accuntPasswordIpt.value) return alert('계좌 비밀번호를 입력해주세요');

  const api = await await fetch('/paymembercheck/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: nameIpt.value,
      phone: telIpt.value,
      residentRegistrationNumber: resistNumber.value,
      accountNumber: accountNumItp.value,
      password: accuntPasswordIpt.value.toString(),
      sequence,
      productId: productId,
    }),
  });

  const { status } = await api;
  const result = await api.json();

  alert(result.message);
  if (status == 201) return (location.href = '/trade-history');
});

function autoHyphen2(target) {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
}
