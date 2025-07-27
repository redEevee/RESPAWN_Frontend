import React from 'react';
import styled from 'styled-components';

const StepProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, label: '장바구니' },
    { id: 2, label: '주문/결제' },
    { id: 3, label: '주문완료' },
  ];

  return (
    <StepsWrapper>
      {steps.map((step, index) => (
        <Step key={step.id} active={currentStep === step.id}>
          <StepNumber active={currentStep === step.id}>
            {String(step.id).padStart(2, '0')}
          </StepNumber>
          <StepLabel active={currentStep === step.id}>{step.label}</StepLabel>
          {index < steps.length - 1 && <Separator>›</Separator>}
        </Step>
      ))}
    </StepsWrapper>
  );
};

export default StepProgress;

const StepsWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  color: ${({ active }) => (active ? '#0b4da0' : '#999')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;

const StepNumber = styled.span`
  margin-right: 4px;
  color: ${({ active }) => (active ? '#0b4da0' : '#999')};
  font-weight: bold;
`;

const StepLabel = styled.span`
  margin-right: 6px;
`;

const Separator = styled.span`
  margin-right: 6px;
  color: #ccc;
`;
