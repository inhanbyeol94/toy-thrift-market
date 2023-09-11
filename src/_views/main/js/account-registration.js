const nameIpt = document.getElementById('nameIpt');
const telIpt = document.getElementById('telIpt');
const resistNumber = document.getElementById('resistNumber');
const identifyBtn = document.getElementById('identifyBtn');
const identityVerifyBtn = document.getElementById('identityVerifyBtn');
const codeIpt = document.getElementById('codeIpt');
const accountNumItp = document.getElementById('accountNumItp');
const accountPasswordIpt = document.getElementById('accountPasswordIpt');
const paySubmitBtn = document.getElementById('paySubmitBtn');
let sequence;
const easyPasswordEl = document.querySelector('#easy-password');
const alertEl = document.querySelector('#alert');
const phoneNumberRegExp = /^01[016789]-\d{3,4}-\d{4}$/;
const rrnRegex = /^\d{6}-\d{7}$/;
const bankAccountNumberRegex = /^\d{6}-\d{2}-\d{6}$/;
const passwordRegex = /^\d{4,}$/;
const easyPasswordRegex = /^\d{6,}$/;

telIpt.addEventListener('input', () => {
  autoHyphen2(telIpt);
});

identifyBtn.addEventListener('click', async () => {
  if (!validateForIdentify()) return;
  // if (!nameIpt.value) alert('이름을 입력해주세요');
  // if (!telIpt.value) alert('휴대폰번호를 입력해주세요');
  // if (!resistNumber.value) alert('주민등록번호를 입력해주세요');

  try {
    const response = await fetch('/paymembercheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameIpt.value,
        tel: telIpt.value,
        resistNumber: resistNumber.value,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      console.log(data);
      return;
    }
    // alert(data.message);
    document.getElementById('codeBox').style.display = 'block';

    sequence = data.sequence;
  } catch (err) {
    console.error(err);
  }
});

identityVerifyBtn.addEventListener('click', async () => {
  if (!validateForIdentityVerification()) return;

  // if (!codeIpt.value) alert('인증번호를 입력해주세요');

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
  if (!validateForAccountRegistration()) return;

  try {
    if (!accountNumItp.value) alert('계좌번호를 입력해주세요');
    if (!accountPasswordIpt.value) alert('계좌 비밀번호를 입력해주세요');

    const response = await fetch('/paymembercheck/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameIpt.value,
        phone: telIpt.value,
        residentRegistrationNumber: resistNumber.value,
        accountNumber: accountNumItp.value,
        password: accountPasswordIpt.value.toString(),
        sequence,
        productId: productId,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.message);
      throw new Error(`HTTP error! ${result.message}`);
    }

    // 계좌를 등록
    // 계좌번호, 간편비밀번호
    const data = {
      bankAccountNumber: accountNumItp.value,
      easyPassword: easyPasswordEl.value,
    };
    const _response = await fetch(`/easy-passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const _result = await _response.json();
    console.log('🚀 🔶 paySubmitBtn.addEventListener 🔶 _result:', _result);
    if (!_response.ok) {
      alert(_result.message);
      throw new Error(`HTTP error! ${_result.message}`);
    }

    location.href = '/account/management';
  } catch (error) {
    console.log(error);
  }
});

function autoHyphen2(target) {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
}

// 유효성 검사 함수
function validateForIdentify() {
  const accountHolder = nameIpt.value;
  const phoneNumber = telIpt.value;
  const residentRegistrationNumber = resistNumber.value;

  const isValidInput =
    showAlertAndReturnFalse(!accountHolder, '이름을 입력해주세요') &&
    showAlertAndReturnFalse(!phoneNumber, '휴대폰번호를 입력해주세요') &&
    showAlertAndReturnFalse(!phoneNumberRegExp.test(phoneNumber), '휴대폰 번호 형식이 올바르지 않습니다.') &&
    showAlertAndReturnFalse(!residentRegistrationNumber, '주민등록번호를 입력해주세요') &&
    showAlertAndReturnFalse(!rrnRegex.test(residentRegistrationNumber), '-을 포함한 주민 번호 13자리를 입력해주세요.');

  if (isValidInput) return true;

  return false; // 모든 필드가 유효하다면 true 반환
}

function validateForIdentityVerification() {
  const verificationCode = codeIpt.value;
  const verificationCodeRegExp = /^d{6}$/;
  const isValidInput =
    showAlertAndReturnFalse(!verificationCode, '인증번호를 입력해주세요') &&
    showAlertAndReturnFalse(!verificationCodeRegExp.test(verificationCode), '인증번호는 6자리 숫자입니다.');

  if (isValidInput) return true;

  return false; // 모든 필드가 유효하다면 true 반환
}

function validateForAccountRegistration() {
  const accountHolder = nameIpt.value;
  const phoneNumber = telIpt.value;
  const residentRegistrationNumber = resistNumber.value;
  const bankAccountNumber = accountNumItp.value;
  const password = accountPasswordIpt.value;
  const easyPassword = easyPasswordEl.value;

  const isValidInput =
    showAlertAndReturnFalse(!accountHolder, '예금주를 입력해주세요') &&
    showAlertAndReturnFalse(!phoneNumber) &&
    showAlertAndReturnFalse(!phoneNumberRegExp.test(phoneNumber), '휴대폰 번호 형식이 올바르지 않습니다.') &&
    showAlertAndReturnFalse(!residentRegistrationNumber, '주민등록번호를 입력해주세요') &&
    showAlertAndReturnFalse(!bankAccountNumber, '계좌번호를 입력해주세요') &&
    showAlertAndReturnFalse(!bankAccountNumberRegex.test(bankAccountNumber), '한별은행 계좌번호 형식에 일치하지 않습니다.') &&
    showAlertAndReturnFalse(!password, '계좌 비밀번호를 입력해주세요') &&
    showAlertAndReturnFalse(!passwordRegex.test(password), '비밀번호 형식이 틀렸습니다.') &&
    showAlertAndReturnFalse(!easyPassword, '간편 비밀번호를 입력해주세요') &&
    showAlertAndReturnFalse(!easyPasswordRegex.test(easyPassword), '비밀번호 형식이 틀렸습니다.');

  if (isValidInput) return true;

  return false; // 모든 필드가 유효하다면 true 반환
}

function showAlertAndReturnFalse(condition, message) {
  if (condition) {
    showAlertWithMessage(message);
    return false;
  }
  return true;
}

function showAlertWithMessage(message) {
  alertEl.innerHTML = message;
  alertEl.classList.replace('d-none', 'd-block');
}
