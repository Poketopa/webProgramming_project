// Kakao SDK 초기화
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Kakao !== "undefined" && !Kakao.isInitialized()) {
    Kakao.init("3235f2eed2c06c5061b7c819a400b901"); // 본인의 JavaScript 키로 교체
    console.log("Kakao SDK 초기화됨:", Kakao.isInitialized());
  }
  checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인
});

// 로그인 상태 확인
function checkLoginStatus() {
  const kakaoNickname = localStorage.getItem("kakaoNickname");

  const kakaoLoginImage = document.getElementById("kakaoLoginImage");
  const loggedInImage = document.getElementById("loggedInImage");
  const userName = document.getElementById("userName");

  if (kakaoNickname) {
    // 로그인 상태일 때: 이미지 및 사용자 이름 표시
    if (kakaoLoginImage) kakaoLoginImage.style.display = "none";
    if (loggedInImage) loggedInImage.style.display = "block";
    if (userName) {
      userName.textContent = `${kakaoNickname} 님`;
      userName.style.display = "block";
    }
  } else {
    // 로그아웃 상태일 때: 초기 이미지 표시
    if (kakaoLoginImage) kakaoLoginImage.style.display = "block";
    if (loggedInImage) loggedInImage.style.display = "none";
    if (userName) userName.style.display = "none";
  }
}

// Kakao 로그인 함수
function kakaoLogin() {
  if (!Kakao.isInitialized()) {
    console.error("Kakao SDK가 초기화되지 않았습니다.");
    return;
  }

  Kakao.Auth.login({
    success: function (authObj) {
      console.log("로그인 성공", authObj);
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (res) {
          const nickname = res.properties.nickname;

          // 로그인 상태 업데이트
          localStorage.setItem("kakaoNickname", nickname);
          checkLoginStatus(); // 상태 갱신
        },
        fail: function (error) {
          console.error("사용자 정보 요청 실패:", error);
        },
      });
    },
    fail: function (error) {
      console.error("로그인 실패:", error);
    },
  });
}

// 로그아웃 함수
function kakaoLogout() {
  if (Kakao.Auth.getAccessToken()) {
    Kakao.Auth.logout(() => {
      console.log("로그아웃 성공");
      localStorage.removeItem("kakaoNickname");
      checkLoginStatus(); // 상태 갱신
    });
  }
}
