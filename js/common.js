// Kakao SDK 초기화
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Kakao !== "undefined" && !Kakao.isInitialized()) {
    Kakao.init("3235f2eed2c06c5061b7c819a400b901"); // 여기에 본인의 앱 키를 입력하세요
    console.log("Kakao SDK 초기화 상태:", Kakao.isInitialized());
  }
});

function kakaoLogin() {
  if (!Kakao.isInitialized()) {
    console.error("Kakao SDK가 초기화되지 않았습니다.");
    return;
  }

  Kakao.Auth.login({
    success: function (authObj) {
      console.log("로그인 성공:", authObj);
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (res) {
          const nickname = res.properties.nickname;

          // 이미지와 사용자 이름 표시
          document.getElementById("kakaoLoginImage").style.display = "none";
          document.getElementById("loggedInImage").style.display = "block";
          document.getElementById("userName").textContent = nickname;
          document.getElementById("userName").style.display = "block";

          // localStorage 저장
          localStorage.setItem("kakaoNickname", nickname);
        },
        fail: function (error) {
          console.error("사용자 정보 요청 실패:", error);
        },
      });
    },
    fail: function (err) {
      console.error("로그인 실패:", err);
    },
  });
}
