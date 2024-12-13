// common.js
document.addEventListener("DOMContentLoaded", () => {
  const kakaoNickname = localStorage.getItem("kakaoNickname");

  const userName = document.getElementById("userName");
  const kakaoLoginImage = document.getElementById("kakaoLoginImage");

  if (kakaoNickname) {
    // 로그인 상태
    if (userName) {
      userName.textContent = `${kakaoNickname} 님`;
      userName.style.display = "block"; // 사용자 이름 표시
    }
    if (kakaoLoginImage) {
      kakaoLoginImage.src = "../img/kakaoLogin.png"; // 이미지를 kakaoLogin.png로 변경
    }
  } else {
    // 비로그인 상태
    if (userName) {
      userName.style.display = "none"; // 사용자 이름 숨기기
    }
    if (kakaoLoginImage) {
      kakaoLoginImage.src = "../img/kakao.png"; // 기본 로그인 이미지로 설정
    }
  }
});
