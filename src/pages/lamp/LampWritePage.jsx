// LampWritePage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import {
  nicknameState,
  wishState,
  emailState
} from "../../recoil/lanternContent";
import GradientBackground from "../../components/common/organisms/Background/GradientBackground";
import Header from "../../components/common/molecules/header/header";
import DescriptionText from "../../components/lanternWrite/atom/DescriptionText";
import LanternWritebutton from "../../components/lanternWrite/atom/button";
import LanternWishPaper from "../../components/lanternWrite/organisms/lanternWishPaper";
import { API } from "../../apis/utils";

const Background = styled.div`
  background-image: ${props => `url(${props.$backgroundImageUrl})`};
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  position: relative;
  background-size: cover;
`;

const themeData = [
  {
    themeId: 1,
    title: "이번 학기가 끝났을 때의 나는 어떤 모습일까?",
    placeholder: "소원을 적어주세요"
  },
  {
    themeId: 2,
    title: "올해가 지나고 난 어떤 것을 이뤘을까?",
    placeholder: "목표를 적어주세요"
  },
  {
    themeId: 3,
    title: "내년의 오늘 난 어떤 모습일까?",
    placeholder: "상상 속 모습을 적어주세요"
  }
];

function LampWritePage() {
  const { backgroundImageUrl } = GradientBackground();
  const navigate = useNavigate();
  const [nickname, setNickname] = useRecoilState(nicknameState);
  const [wish, setWish] = useRecoilState(wishState);
  const [email, setEmail] = useRecoilState(emailState);
  const { themeId } = useParams(); // useParams를 통해 URL의 themeId 가져오기

  const theme = themeData.find(item => item.themeId === parseInt(themeId)); // themeId를 정수로 변환하여 사용

  const isSatisfied = () => {
    return nickname.trim() !== "" && wish.trim() !== "" && isValidEmail(email);
  };

  const isValidEmail = email => {
    const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const nextBtnOnClick = async () => {
    if (isSatisfied()) {
      try {
        const postData = {
          nickname: nickname,
          content: wish,
          email: email,
          theme: parseInt(themeId) // 사용자가 선택한 테마 ID 전송
        };

        const response = await API.post("/api/lamplights", postData);

        console.log("등불이 저장되었습니다", response.data);

        navigate("/lampFly");
      } catch (error) {
        if (error.response.status === 400 && error.response.data.email) {
          alert(error.response.data.email[0]);
        } else {
          console.error("POST ERROR", error);
          alert("Failed to submit data. Please try again later.");
        }
      }
    } else {
      alert("소원을 적어 주세요");
    }
  };

  return (
    <Background $backgroundImageUrl={backgroundImageUrl}>
      <Header title="등불 작성하기" />
      <DescriptionText preText={theme.title} />
      <LanternWishPaper inputType="email" placeholder={theme.placeholder} />
      <LanternWritebutton
        onClick={nextBtnOnClick}
        isSatisfied={isSatisfied()}
        text="다음"
      />
    </Background>
  );
}

export default LampWritePage;
