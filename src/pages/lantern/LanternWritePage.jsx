import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  nicknameState,
  wishState,
  passwordState
} from "../../recoil/lanternContent";
import { clickedState } from "../../recoil/lanternColor";

// 모달 컴포넌트 import
import ConfirmModal from "../../components/lanternWrite/organisms/confirmModal";

// API 함수 import
import { postLanternData } from "../../apis/api/lanternPost";
//import 컴포넌트
import GradientBackground from "../../components/common/organisms/Background/GradientBackground";
import Header from "../../components/common/molecules/header/header";
import DescriptionText from "../../components/lanternWrite/atom/DescriptionText";
import LanternWritebutton from "../../components/lanternWrite/atom/button";
import LanternWishPaper from "../../components/lanternWrite/organisms/lanternWishPaper";

const Background = styled.div`
  background-image: ${props => `url(${props.$backgroundImageUrl})`};
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  position: relative;
  background-size: cover;
`;

function LanternWritePage() {
  const { backgroundImageUrl } = GradientBackground();
  const nickname = useRecoilValue(nicknameState);
  const wish = useRecoilValue(wishState);
  const password = useRecoilValue(passwordState);
  const clicked = useRecoilValue(clickedState);
  const setNickname = useSetRecoilState(nicknameState);
  const setWish = useSetRecoilState(wishState);
  const setPassword = useSetRecoilState(passwordState);
  const setClicked = useSetRecoilState(clickedState);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // 모든 입력란이 채워졌는지 확인하는 함수
  const isSatisfied = () => {
    return (
      nickname.trim() !== "" &&
      wish.trim() !== "" &&
      password.length === 4 &&
      Object.values(clicked).some(value => value === true)
    );
  };

  const nextBtnOnClick = () => {
    if (isSatisfied()) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmModal = async () => {
    console.log("모달 확인 버튼 클릭");
    setShowModal(false);
    try {
      // 포스트 요청 보내기
      const response = await postLanternData({
        nickname: nickname,
        content: wish,
        password: password,
        lanternColor: Object.keys(clicked).find(color => clicked[color])
      });

      const detailId = response.id;

      // 포스트 성공 후 Recoil 상태 초기화
      setNickname("");
      setWish("");
      setPassword("");
      setClicked({});
      console.log(response.id);
      // fortuneIntro 페이지로 이동
      navigate(`/fortuneIntro/${detailId}`);
    } catch (error) {
      console.error("Failed to post lantern data:", error);
    }
  };

  return (
    <Background $backgroundImageUrl={backgroundImageUrl}>
      <Header title="연등 작성하기" />
      <DescriptionText
        preText="이루고 싶은 "
        Yellowtext="소원을 "
        nextText="작성해주세요"
      />
      <LanternWishPaper inputType="password" />
      <LanternWritebutton
        onClick={nextBtnOnClick}
        isSatisfied={isSatisfied()}
        text="다음"
      />
      {showModal && (
        <ConfirmModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
        />
      )}
    </Background>
  );
}

export default LanternWritePage;
