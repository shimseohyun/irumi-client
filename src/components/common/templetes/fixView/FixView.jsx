import React from "react";

import ButtonSetting from "../../organisms/buttonSetting/ButtonSetting";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { heightSize } from "../../../../recoil/heightSize";

const FixViewWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: 0px 16px;
  min-height: ${props => props.$heightSize}px;
`;

function FixView({ children }) {
  const heightSizeValue = useRecoilValue(heightSize);

  return (
    <FixViewWrapper $heightSize={heightSizeValue}>{children}</FixViewWrapper>
  );
}

export default FixView;
