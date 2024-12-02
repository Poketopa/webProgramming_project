// MetaMask 지갑 연결
let account;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // MetaMask 계정 요청
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];

      // ETH 잔액 조회
      const balanceWei = await ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });

      const ethBalance = parseFloat(
        web3.utils.fromWei(balanceWei, "ether")
      ).toFixed(4);
      document.getElementById(
        "walletBalance"
      ).innerHTML = `Available: <span>${ethBalance}</span> ETH`;

      alert(`지갑 연결 성공: ${account}`);
    } catch (error) {
      if (error.code === 4001) {
        alert("사용자가 지갑 연결 요청을 취소했습니다.");
      } else {
        alert("지갑 연결에 실패했습니다. MetaMask를 확인해주세요.");
        console.error("Error connecting wallet:", error);
      }
    }
  } else {
    alert("MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.");
  }
}

// ETH 전송
async function sendEth() {
  const amount = document.getElementById("depositAmount").value.trim();
  const recipient = document.getElementById("recipient").value.trim();

  if (!amount || !recipient) {
    alert("수신 주소와 송금 금액을 입력해주세요.");
    return;
  }

  if (isNaN(amount) || parseFloat(amount) <= 0) {
    alert("유효한 금액을 입력해주세요.");
    return;
  }

  try {
    // 금액을 Wei로 변환
    const valueWei = web3.utils.toWei(amount, "ether");

    // 트랜잭션 파라미터 설정
    const transactionParameters = {
      from: account,
      to: recipient,
      value: valueWei,
    };

    // MetaMask를 통한 송금 요청
    await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    alert(`${amount} ETH가 성공적으로 전송되었습니다.`);
  } catch (error) {
    if (error.code === 4001) {
      alert("사용자가 트랜잭션 요청을 취소했습니다.");
    } else {
      alert("송금 중 오류가 발생했습니다.");
      console.error("송금 오류:", error);
    }
  }
}

// 이벤트 리스너
document
  .getElementById("connectWalletBtn")
  .addEventListener("click", connectWallet);
