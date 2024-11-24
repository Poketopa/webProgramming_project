// CoinGecko API를 사용하여 30개의 코인 데이터를 가져오는 함수
async function fetchCoinData() {
    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1"
        );
        const data = await response.json();

        // CoinGecko API에서 USD/KRW 환율 데이터 가져오기
        const rateResponse = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=krw"
        );
        const rateData = await rateResponse.json();
        const usdToKrwRate = rateData.usd.krw;

        const coinDataElement = document.getElementById("coin-data");
        coinDataElement.innerHTML = "";

        data.forEach((coin, index) => {
            const usdPrice = coin.current_price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            const krwPrice = (coin.current_price * usdToKrwRate).toLocaleString("ko-KR", {
                style: "currency",
                currency: "KRW"
            });

            // 변동률에 따라 색상 및 아이콘 설정
            const change24h = coin.price_change_percentage_24h.toFixed(2);
            const change24hClass = change24h > 0 ? "change-positive" : "change-negative";
            const change24hIcon = change24h > 0 ? "▲" : "▼";

            // FDV, 거래량, 시가총액에 대해 소수점 이하 값이 있는 경우만 소수점 표시
            const fdv = coin.fully_diluted_valuation
                ? coin.fully_diluted_valuation.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })
                : "N/A";
            const volume24h = coin.total_volume.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            const marketCap = coin.market_cap.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${coin.image}" alt="${coin.name} logo" width="20" height="20"> ${coin.name} (${coin.symbol.toUpperCase()})</td>
                <td><span class="coin-price-usd">${usdPrice}</span> / <span class="coin-price-krw">${krwPrice}</span></td>
                <td class="${change24hClass}">${change24hIcon} ${Math.abs(change24h)}%</td>
                <td>${fdv}</td>
                <td>${volume24h}</td>
                <td>${marketCap}</td>
            `;
            coinDataElement.appendChild(row);
        });
    } catch (error) {
        console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    }
}

// TradingView 차트를 초기화하는 함수
function initializeTradingViewCharts() {
    // ETH/USD 차트 위젯 생성
    new TradingView.widget({
      container_id: "eth-chart", // 차트를 렌더링할 HTML 요소 ID
      autosize: true, // 자동 크기 조정
      symbol: "BINANCE:ETHUSD", // ETH/USD 심볼 (BINANCE 거래소)
      interval: "D", // 기본 차트 간격 (일 단위)
      timezone: "Asia/Seoul", // 시간대 설정
      theme: "dark", // 차트 테마 (다크 테마)
      style: "1", // 차트 스타일 설정
      locale: "ko", // 언어 설정 (한국어)
      toolbar_bg: "#f1f3f6", // 도구 모음 배경색
      enable_publishing: false, // 퍼블리싱 기능 비활성화
      hide_side_toolbar: false, // 사이드 도구 모음 표시
      allow_symbol_change: true, // 심볼 변경 허용
      withdateranges: true, // 날짜 범위 표시 허용
      hideideas: true, // 사용자 아이디어 숨기기
    });

    // USD/KRW 차트 위젯 생성
    new TradingView.widget({
      container_id: "usd-chart", // 차트를 렌더링할 HTML 요소 ID
      autosize: true, // 자동 크기 조정
      symbol: "FX_IDC:USDKRW", // USD/KRW 심볼 (FX_IDC)
      interval: "D", // 기본 차트 간격 (일 단위)
      timezone: "Asia/Seoul", // 시간대 설정
      theme: "dark", // 차트 테마 (다크 테마)
      style: "1", // 차트 스타일 설정
      locale: "ko", // 언어 설정 (한국어)
      toolbar_bg: "#f1f3f6", // 도구 모음 배경색
      enable_publishing: false, // 퍼블리싱 기능 비활성화
      hide_side_toolbar: false, // 사이드 도구 모음 표시
      allow_symbol_change: true, // 심볼 변경 허용
      withdateranges: true, // 날짜 범위 표시 허용
      hideideas: true, // 사용자 아이디어 숨기기
    });
}

// 페이지가 로드되었을 때 CoinGecko API를 통해 데이터를 가져오고 TradingView 차트를 초기화
document.addEventListener("DOMContentLoaded", () => {
    fetchCoinData(); // 코인 데이터 가져오기 함수 호출
    initializeTradingViewCharts(); // TradingView 차트 초기화 함수 호출

    // 실시간으로 코인 데이터를 갱신 (10분마다 호출)
    setInterval(fetchCoinData, 600000); // 600,000ms = 10분
});
