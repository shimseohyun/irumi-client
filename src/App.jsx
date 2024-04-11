import { styled, ThemeProvider } from "styled-components";
import { GlobalStyle } from "./style/globalStyle";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { Outlet } from "react-router-dom";

import { theme } from "./recoil/theme.jsx";
import { emSize } from "./recoil/emSize.jsx";

import { day, sunset, night } from "./style/theme.js";
import "./style/fontStyle.css";
import { useEffect } from "react";
import { getEmSize } from "./utils/getEmSize.jsx";

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  max-width: 500px;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.font1};

  font-family: "Pretendard";
`;

const Layout = () => {
  return (
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </>
  );
};

function App() {
  // 시간에 따라 현재 테마 받아오기
  const themeValue = useRecoilValue(theme);

  // window의 너비가 바뀔때마다 emSize를 재정의함
  const setEmSize = useSetRecoilState(emSize);

  // main app 내에 resizeListenr 이벤트 핸들러 생성
  useEffect(() => {
    const resizeListener = () => {
      setEmSize(getEmSize(window.innerWidth));
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <>
      <ThemeProvider
        theme={
          themeValue == "DAY" ? day : themeValue == "SUNSET" ? sunset : night
        }
      >
        <GlobalStyle />
        <Layout />
      </ThemeProvider>
    </>
  );
}

export default App;