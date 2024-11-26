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

        // 기본으로 1위 코인의 차트를 렌더링
        renderTokenChart(data[0].id, data[0].name);

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

            // 각 행 클릭 시 해당 코인의 차트 렌더링
            row.addEventListener("click", () => {
                renderTokenChart(coin.id, coin.name);
            });

            coinDataElement.appendChild(row);
        });
    } catch (error) {
        console.error("코인 데이터를 가져오는 중 오류 발생:", error);
    }
}

// 특정 코인의 가격 차트를 표시하는 함수
async function renderTokenChart(coinId, coinName) {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        const data = await response.json();

        // 날짜별 가격 데이터와 라벨 생성
        const labels = [];
        const prices = [];

        data.prices.forEach((price, index) => {
            const date = new Date(price[0]);
            // 하루 단위로 레이블 추가
            if (index % 24 === 0) { 
                labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
            } else {
                labels.push(""); // 레이블 비우기
            }
            prices.push(price[1]);
        });

        // 차트 캔버스 컨텍스트 가져오기
        const ctx = document.getElementById("btc-chart-canvas").getContext("2d");

        // 기존 차트를 삭제하고 새 차트 생성
        if (window.tokenChart) {
            window.tokenChart.destroy();
        }

        window.tokenChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `${coinName} 가격 (7일)`,
                        data: prices,
                        borderColor: "#007bff",
                        backgroundColor: "rgba(0, 123, 255, 0.1)",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: "#ffffff",
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff",
                            font: {
                                size: 12,
                            },
                            autoSkip: false, // 모든 레이블 유지
                            maxRotation: 0, // 레이블 세로로 표시 방지
                            callback: function (value, index, ticks) {
                                return labels[index] ? labels[index] : null; // 빈 레이블 제거
                            },
                        },
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: "#ffffff",
                            font: {
                                size: 12,
                            },
                            callback: function (value) {
                                return `$${value.toLocaleString()}`;
                            },
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                            lineWidth: 0.5,
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error("차트를 렌더링하는 중 오류 발생:", error);
    }
}

// 페이지가 로드되었을 때 CoinGecko API를 통해 데이터를 가져오고 차트를 초기화
document.addEventListener("DOMContentLoaded", () => {
    fetchCoinData(); // 코인 데이터 가져오기 함수 호출

    // 실시간으로 코인 데이터를 갱신 (10분마다 호출)
    setInterval(fetchCoinData, 600000); // 600,000ms = 10분
});
