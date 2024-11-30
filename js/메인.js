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

async function renderTokenChart(coinId, coinName) {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        const data = await response.json();

        const labelsForXAxis = []; // X축에 보이는 라벨
        const labelsForTooltip = []; // 툴팁에 보이는 라벨
        const prices = [];

        data.prices.forEach((price) => {
            const date = new Date(price[0]);
            const formattedDateForXAxis = `${date.getMonth() + 1}/${date.getDate()}`; // 날짜만
            const formattedDateForTooltip = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`; // 날짜와 시간
            labelsForXAxis.push(formattedDateForXAxis);
            labelsForTooltip.push(formattedDateForTooltip);
            prices.push(price[1]);
        });

        const ctx = document.getElementById("btc-chart-canvas").getContext("2d");

        if (window.tokenChart) {
            window.tokenChart.destroy();
        }

        const lastPrice = prices[prices.length - 1]; // 가장 최신 가격

        window.tokenChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labelsForXAxis, // X축에 날짜만 표시
                datasets: [
                    {
                        label: "", // 범례 제거
                        data: prices,
                        borderColor: "#8a2be2", // 보라빛 경계 색상
                        backgroundColor: "rgba(138, 43, 226, 0.2)", // 보라빛 투명 배경색
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
                        display: false, // 범례 비활성화
                    },
                    title: {
                        display: true, // 제목 표시
                        text: coinName, // 코인 이름만 표시
                        align: "start", // 좌측 정렬
                        color: "#ffffff", // 텍스트 색상
                        font: {
                            size: 28, // 폰트 크기
                            weight: "bold",
                        },
                        padding: {
                            top: 10,
                            bottom: 10,
                        },
                    },
                    tooltip: {
                        enabled: false, // 기본 툴팁 비활성화
                        external: function (context) {
                            const tooltipEl = document.getElementById("custom-tooltip");
                            if (!tooltipEl) {
                                const div = document.createElement("div");
                                div.id = "custom-tooltip";
                                div.style.position = "absolute";
                                div.style.background = "#333";
                                div.style.color = "#fff";
                                div.style.padding = "8px";
                                div.style.borderRadius = "4px";
                                div.style.pointerEvents = "none";
                                div.style.fontSize = "12px";
                                div.style.fontWeight = "bold";
                                div.style.textAlign = "center";
                                document.body.appendChild(div);
                            }
                            const tooltip = context.tooltip;
                            const tooltipBox = document.getElementById("custom-tooltip");

                            if (tooltip.opacity === 0) {
                                tooltipBox.style.opacity = 0;
                                return;
                            }

                            const mouseEvent = context.chart._lastEvent;
                            const mouseX = mouseEvent.x;
                            const mouseY = mouseEvent.y;

                            const dataIndex = tooltip.dataPoints[0].dataIndex;
                            const price = prices[dataIndex].toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            });
                            const dateTime = labelsForTooltip[dataIndex]; // 툴팁 용 라벨 사용

                            tooltipBox.innerHTML = `<div style="font-size: 16px; font-weight: bold;">${price}</div><div>${dateTime}</div>`;
                            tooltipBox.style.opacity = 1;

                            tooltipBox.style.left = mouseX + 40 + "px";
                            tooltipBox.style.top = mouseY + 100 + "px";
                        },
                    },
                },
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff",
                            font: {
                                size: 12,
                            },
                            autoSkip: false, // 자동 생략 비활성화
                            maxRotation: 0, // 라벨 수평 유지
                            minRotation: 0,
                            callback: function (value, index, values) {
                                // 표시할 라벨 수를 10개로 제한
                                const totalLabels = values.length;
                                const maxLabels = 7; // 최대 10개의 라벨만 표시
                                const interval = Math.ceil(totalLabels / maxLabels);
                                if (index % interval === 0) {
                                    return this.getLabelForValue(value);
                                }
                                return ""; // 나머지는 빈 문자열
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
            plugins: [
                {
                    id: "verticalLine",
                    afterDraw: function (chart) {
                        if (chart.tooltip._active && chart.tooltip._active.length) {
                            const activePoint = chart.tooltip._active[0];
                            const ctx = chart.ctx;
                            const x = activePoint.element.x;
                            const y = activePoint.element.y; // 곡선과 만나는 Y좌표
                            const topY = chart.scales.y.top;
                            const bottomY = chart.scales.y.bottom;

                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(x, topY);
                            ctx.lineTo(x, bottomY);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = "#ff0000"; // 세로선 색상
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.arc(x, y, 5, 0, 2 * Math.PI); // 중심 좌표(x, y), 반지름 5
                            ctx.fillStyle = "#8a2be2"; // 보라빛 원 내부 색상
                            ctx.fill();
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = "#ffffff"; // 원 테두리 색상
                            ctx.stroke();

                            ctx.restore();
                        }
                    },
                },
                {
                    id: "currentPriceLabel", // 우측 상단에 현재가 표시
                    afterDraw: function (chart) {
                        const ctx = chart.ctx;
                        ctx.save();
                        ctx.font = "bold 16px Arial";
                        ctx.fillStyle = "#ffffff";
                        ctx.textAlign = "right";

                        const currentPriceText = `현재가: $${lastPrice.toLocaleString("en-US")}`;
                        ctx.fillText(
                            currentPriceText,
                            chart.width - 10, // 차트 오른쪽 끝에서 약간 왼쪽으로 이동
                            20 // 차트 위쪽에서 약간 아래로 이동
                        );
                        ctx.restore();
                    },
                },
            ],
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