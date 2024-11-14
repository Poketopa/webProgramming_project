// MetaMask 지갑과 연결하는 함수
async function connectWallet() {
  // MetaMask가 설치되어 있는지 확인
  if (typeof window.ethereum !== "undefined") {
    try {
      // MetaMask 연결 요청 (계정 접근 요청)
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // 연결된 계정 정보를 표시
      document.getElementById("status").innerText =
        "지갑 상태: 연결됨 (" + accounts[0] + ")";
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      // 사용자가 연결을 거부하거나 오류가 발생한 경우
      console.error("지갑 연결 오류:", error);
      document.getElementById("status").innerText = "지갑 상태: 연결 실패";
    }
  } else {
    // MetaMask가 설치되어 있지 않은 경우
    alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
  }
}

// "지갑 연결" 버튼 클릭 이벤트 리스너 추가
document
  .getElementById("connectButton")
  .addEventListener("click", connectWallet);
