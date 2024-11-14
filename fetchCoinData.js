// CoinGecko API를 사용하여 특정 코인의 가격 데이터를 가져오는 함수
async function fetchCoinData() {
  try {
    // CoinGecko API에서 여러 코인의 가격 데이터를 가져오기
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,tether,dogecoin&vs_currencies=usd&include_24hr_change=true"
    );
    const data = await response.json();

    // Coin 데이터를 표에 표시
    const coinDataElement = document.getElementById("coin-data");
    const coins = [
      { id: "bitcoin", name: "BTC" },
      { id: "ethereum", name: "ETH" },
      { id: "solana", name: "SOL" },
      { id: "binancecoin", name: "BNB" },
      { id: "tether", name: "USDT" },
      { id: "dogecoin", name: "DOGE" },
    ];

    coins.forEach((coin) => {
      const coinInfo = data[coin.id];
      const price = coinInfo.usd.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      const change24h = coinInfo.usd_24h_change.toFixed(2);

      // 테이블 행 생성
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${coin.name}</td>
                <td>${price}</td>
                <td>${change24h} %</td>
            `;
      coinDataElement.appendChild(row);
    });
  } catch (error) {
    console.error("코인 데이터를 가져오는 중 오류 발생:", error);
  }
}

// TradingView 차트를 초기화하는 함수
function initializeTradingViewCharts() {
  // BTC/KRW 차트 위젯
  new TradingView.widget({
    container_id: "btc-chart",
    autosize: true,
    symbol: "UPBIT:BTCKRW", // BTC/KRW 심볼
    interval: "D",
    timezone: "Asia/Seoul",
    theme: "light",
    style: "1",
    locale: "ko",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    withdateranges: true,
    hideideas: true,
  });

  // USD/KRW 차트 위젯
  new TradingView.widget({
    container_id: "usd-chart",
    autosize: true,
    symbol: "FX_IDC:USDKRW", // USD/KRW 심볼
    interval: "D",
    timezone: "Asia/Seoul",
    theme: "light",
    style: "1",
    locale: "ko",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    withdateranges: true,
    hideideas: true,
  });
}

// 페이지 로드 시 CoinGecko API를 통해 데이터를 가져오고 TradingView 차트를 초기화
document.addEventListener("DOMContentLoaded", () => {
  fetchCoinData();
  initializeTradingViewCharts();
});
