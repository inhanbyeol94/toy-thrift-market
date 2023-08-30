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
    });
};
loadProductInfo();

telIpt.addEventListener('input', () => {
  autoHyphen2(telIpt);
});

const memberIdentify = async () => {
  if (!nameIpt.value) alert('이름을 입력해주세요');
  if (!telIpt.value) alert('휴대폰번호를 입력해주세요');
  if (!resistNumber.value) alert('주민등록번호를 입력해주세요');
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

        identityVerifyBtn.addEventListener('click', (event) => {
          event.preventDefault();
          memberIdentifyVerify(data.sequence);
        });
      });
  } catch (err) {
    console.error(err);
  }
};

const memberIdentifyVerify = async (sequence) => {
  if (!codeIpt.value) alert('인증번호를 입력해주세요');
  try {
    await fetch('/paymembercheck/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: telIpt.value,
        code: codeIpt.value,
        sequence,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert(data.message);

        paySubmitBtn.addEventListener('click', (event) => {
          event.preventDefault();
          accountIdentify(data.sequence);
        });
      });
  } catch (err) {
    console.error(err);
  }
};

const accountIdentify = async (sequence) => {
  if (!accountNumItp.value) alert('계좌번호를 입력해주세요');
  if (!accuntPasswordIpt.value) alert('계좌 비밀번호를 입력해주세요');
  try {
    await fetch('/paymembercheck/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameIpt.value,
        phone: telIpt.value,
        resistNumber: resistNumber.value,
        accountNumber: accountNumItp.value,
        password: accuntPasswordIpt.value.toString(),
        sequence,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  } catch (err) {
    console.error(err);
  }
};

identifyBtn.addEventListener('click', (event) => {
  event.preventDefault();
  memberIdentify();
});

function autoHyphen2(target) {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
}
