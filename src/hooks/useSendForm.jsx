import { useState } from 'react';

export function useSendForm({ sendApi, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = async (type, extra = {}) => {
    setLoading(true);
    setError(null);
    try {
      await sendApi({ type, ...extra });
      onNext?.();
    } catch (e) {
      setError(
        type === 'email'
          ? '이메일 발송에 실패했습니다. 다시 시도해주세요.'
          : '문자 발송에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = (extra) => send('email', extra);
  const sendPhone = (extra) => send('phone', extra);

  return { loading, error, setError, sendEmail, sendPhone };
}
