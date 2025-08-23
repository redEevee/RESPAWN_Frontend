export const PHONE_REGEX = /^\d{11}$/;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;

export function validateFindId(values, mode) {
  if (!values.name?.trim()) return '이름을 입력해주세요.';

  if (mode === 'phone') {
    if (!values.phone?.trim()) return '전화번호를 입력해주세요.';
    if (!PHONE_REGEX.test(values.phone))
      return '올바른 형식의 전화번호를 입력해주세요. (숫자 11자리)';
  } else {
    if (!values.email?.trim()) return '이메일을 입력해주세요.';
    if (!EMAIL_REGEX.test(values.email))
      return '올바른 형식의 이메일을 입력해주세요.';
  }

  return '';
}

export function validateFindPw(values, mode) {
  if (!values.name?.trim()) return '이름을 입력해주세요.';
  if (!values.username?.trim()) return '아이디를 입력해주세요.';

  if (mode === 'phone') {
    if (!values.phone?.trim()) return '전화번호를 입력해주세요.';
    if (!PHONE_REGEX.test(values.phone))
      return '올바른 형식의 전화번호를 입력해주세요. (숫자 11자리)';
  } else {
    if (!values.email?.trim()) return '이메일을 입력해주세요.';
    if (!EMAIL_REGEX.test(values.email))
      return '올바른 형식의 이메일을 입력해주세요.';
  }

  return '';
}
