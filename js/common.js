// common.js
document.addEventListener("DOMContentLoaded", () => {
  const kakaoNickname = localStorage.getItem("kakaoNickname");

  const userNameContainer = document.getElementById("userNameContainer");
  const loginButton = document.getElementById("loginButton");

  if (kakaoNickname) {
    // 로그인 상태
    if (userNameContainer) {
      userNameContainer.textContent = `${kakaoNickname} 님`;
      userNameContainer.style.display = "inline-block"; // 사용자 이름 표시
    }

    if (loginButton) {
      loginButton.style.display = "none"; // 로그인 버튼 숨기기
    }

    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
      welcomeMessage.textContent = `${kakaoNickname}님, 환영합니다!`;
    }
  } else {
    // 비로그인 상태
    if (userNameContainer) {
      userNameContainer.style.display = "none"; // 사용자 이름 숨기기
    }

    if (loginButton) {
      loginButton.style.display = "block"; // 로그인 버튼 표시
    }

    const welcomeMessage = document.getElementById("welcomeMessage");
    if (welcomeMessage) {
      welcomeMessage.textContent = "로그인이 필요합니다.";
    }
  }
});
