// web3.js 초기화
const Web3 = window.Web3;
let web3;
let userAccount;

// 지갑 연결 함수
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // web3 객체 초기화
      web3 = new Web3(window.ethereum);

      // MetaMask 연결 요청
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      userAccount = accounts[0];

      // 지갑 주소와 잔액 표시
      const balance = await web3.eth.getBalance(userAccount);
      const ethBalance = web3.utils.fromWei(balance, "ether");

      document.getElementById(
        "walletBalance"
      ).innerHTML = `Available: <span>${parseFloat(ethBalance).toFixed(
        4
      )}</span> ETH`;

      alert(`지갑이 연결되었습니다: ${userAccount}`);
    } catch (error) {
      console.error("지갑 연결 실패:", error);
      alert("지갑 연결에 실패했습니다. MetaMask를 확인해주세요.");
    }
  } else {
    alert("MetaMask가 설치되어 있지 않습니다. 설치 후 다시 시도해주세요.");
  }
}

// ETH 송금 함수
async function sendEth() {
  const recipient = document.getElementById("recipient").value.trim();
  const amount = document.getElementById("depositAmount").value.trim();

  if (!recipient || !amount || isNaN(amount)) {
    alert("수신 주소와 금액을 올바르게 입력해주세요.");
    return;
  }

  try {
    // ETH 값을 Wei로 변환하고 16진수로 표현
    const valueInHex = "0x" + (amount * 1e18).toString(16);

    // 트랜잭션 생성
    const transactionParameters = {
      to: recipient, // 수신 주소
      from: userAccount, // 송신 주소
      value: valueInHex, // 전송 금액 (Hexadecimal 형식의 Wei)
    };

    // MetaMask를 통한 트랜잭션 요청
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    alert(`트랜잭션이 성공적으로 전송되었습니다. 트랜잭션 해시: ${txHash}`);
  } catch (error) {
    console.error("송금 실패:", error);
    alert("ETH 송금에 실패했습니다. 다시 시도해주세요.");
  }
}

// 버튼 이벤트 바인딩
document
  .getElementById("connectWalletBtn")
  .addEventListener("click", connectWallet);
document.getElementById("sendEthBtn").addEventListener("click", sendEth);
