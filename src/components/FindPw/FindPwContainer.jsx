import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FindPwInputStep from './FindPwInputStep';
import FindPwSendStep from './FindPwSendStep';
import FindPwDoneStep from './FindPwDoneStep';

const FindPwContainer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState(null);

  // 1단계에서 입력 완료 후 2단계 이동
  const handleInputComplete = (inputUserInfo) => {
    setUserInfo(inputUserInfo);
    setStep(2);
  };

  // 2단계에서 발송 완료 후 3단계 이동
  const handleNextFromSend = () => {
    setStep(3);
  };

  const handleBackToMain = () => {
    navigate('/login');
  };

  return (
    <>
      {step === 1 && (
        <FindPwInputStep
          onComplete={handleInputComplete}
          onPrev={handleBackToMain}
        />
      )}
      {step === 2 && (
        <FindPwSendStep
          userInfo={userInfo}
          onNext={handleNextFromSend}
          onPrev={() => setStep(1)}
        />
      )}
      {step === 3 && <FindPwDoneStep onPrev={handleBackToMain} />}
    </>
  );
};

export default FindPwContainer;
