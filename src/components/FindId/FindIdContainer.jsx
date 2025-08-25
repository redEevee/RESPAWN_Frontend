import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FindIdInputStep from './FindIdInputStep';
import FindIdResultStep from './FindIdResultStep';
import FindIdSendStep from './FindIdSendStep';
import FindIdDoneStep from './FindIdDoneStep';

const FindIdContainer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [idList, setIdList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // 1단계에서 입력 완료 후 idList와 userInfo 세팅 + 2단계 이동
  const handleInputComplete = (inputUserInfo, foundIds) => {
    setUserInfo(inputUserInfo);
    setIdList(foundIds);
    setStep(2);
  };

  // 2단계에서 아이디 선택 후 3단계 이동
  const handleNextFromResult = ({ id }) => {
    setSelectedId(id);
    setStep(3);
  };

  // 3단계에서 발송 완료 후 4단계 이동
  const handleNextFromSend = () => {
    setStep(4);
  };

  const handleBackToMain = () => {
    navigate('/login');
  };

  return (
    <>
      {step === 1 && (
        <FindIdInputStep
          onComplete={handleInputComplete}
          onPrev={handleBackToMain}
        />
      )}
      {step === 2 && (
        <FindIdResultStep
          idList={idList}
          onNext={handleNextFromResult}
          onPrev={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <FindIdSendStep
          userInfo={userInfo}
          id={selectedId}
          onNext={handleNextFromSend}
          onPrev={() => setStep(2)}
        />
      )}
      {step === 4 && <FindIdDoneStep onPrev={handleBackToMain} />}
    </>
  );
};

export default FindIdContainer;
