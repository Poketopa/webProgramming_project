async function renderUsdKrwChart() {
    try {
        // 환율 API 호출 (USD 기준 최신 환율 정보 가져오기)
        const response = await fetch('https://v6.exchangerate-api.com/v6/f45f773c8d48900387b95e4e/latest/USD');
        const data = await response.json();

        // 환율 데이터에서 KRW 값 추출
        const usdToKrwRate = data.conversion_rates.KRW;

        const labelsForXAxis = [];
        const exchangeRates = [];

        // 현재 시간 기준으로 7일(1주일)을 설정
        const currentDate = new Date();
        const startTime = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7일 전

        // 7일 전부터 현재까지의 데이터 생성 (2시간 간격)
        for (let i = 0; i < 84; i++) { // 2시간 단위 데이터 (7일 * 12 = 84개)
            const time = new Date(startTime.getTime() + i * 2 * 60 * 60 * 1000); // 2시간 간격
            const randomFluctuation = Math.random() * 5 - 2.5;
            const newRate = usdToKrwRate + randomFluctuation;

            exchangeRates.push(newRate);

            // 00시인 경우에만 날짜 표시
            if (time.getHours() === 0) {
                const formattedDate = `${time.getMonth() + 1}/${time.getDate()}`; // 월/일 형식
                labelsForXAxis.push(formattedDate);
            } else {
                labelsForXAxis.push(""); // 나머지는 빈 라벨
            }
        }

        // 데이터의 최저값 계산
        const minValue = Math.min(...exchangeRates) - 3;

        const ctx = document.getElementById("usd-krw-chart-canvas").getContext("2d");

        if (window.usdKrwChart) {
            window.usdKrwChart.destroy(); // 기존 차트 삭제
        }

        window.usdKrwChart = new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
                labels: labelsForXAxis, // X축 라벨
                datasets: [{
                    label: "USD to KRW",
                    data: exchangeRates,
                    backgroundColor: 'rgba(0, 123, 255, 0.3)', // 기본 막대 배경색
                    borderColor: '#007bff', // 막대 경계색
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(0, 123, 255, 1)', // 선택된 막대 색상: 매우 진한 파란색
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'USD to KRW Exchange Rate',
                        align: 'start',
                        color: '#ffffff',
                        font: {
                            size: 20,
                            weight: 'bold',
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

                            if (tooltip.opacity === 0 || !tooltip.dataPoints || !tooltip.dataPoints.length) {
                                tooltipBox.style.opacity = 0;
                                return;
                            }

                            const mouseEvent = context.chart._lastEvent;
                            const rect = context.chart.canvas.getBoundingClientRect();

                            const dataIndex = tooltip.dataPoints[0].dataIndex;
                            const price = exchangeRates[dataIndex].toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            });
                            const dateTime = new Date(startTime.getTime() + dataIndex * 2 * 60 * 60 * 1000); // 2시간 간격
                            const formattedDateTime = `${String(dateTime.getMonth() + 1).padStart(2, '0')}/${String(dateTime.getDate()).padStart(2, '0')} ${String(dateTime.getHours()).padStart(2, '0')}:00`; // mm/dd HH:mm

                            tooltipBox.innerHTML = `<div style="font-size: 16px; font-weight: bold;">${price}</div><div>${formattedDateTime}</div>`;
                            tooltipBox.style.opacity = 1;
                            tooltipBox.style.left = rect.left + mouseEvent.x + 20 + "px";
                            tooltipBox.style.top = rect.top + mouseEvent.y + 20 + "px";
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
                            color: "#ffffff", // X축 라벨 색상
                            font: {
                                size: 12, // X축 라벨 크기
                            },
                            autoSkip: false, // 모든 날짜 표시
                            maxRotation: 0, // X축 레이블 수평 유지
                            minRotation: 0,
                        },
                        grid: {
                            display: false, // X축 그리드 숨김
                        },
                    },
                    y: {
                        min: minValue,
                        ticks: {
                            stepSize: 2,
                            color: "#ffffff", // Y축 라벨 색상
                            font: {
                                size: 12,
                            },
                        },
                        grid: {
                            color: "#444444", // Y축 그리드 색상
                        },
                    },
                },
            },
            plugins: [
                {
                    id: 'currentRateDisplay',
                    beforeDraw: function (chart) {
                        const ctx = chart.ctx;
                        const chartArea = chart.chartArea;
                        const text = `현재 환율: ${usdToKrwRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;

                        ctx.save();
                        ctx.font = 'bold 16px Arial';
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'top'; // 텍스트 기준선을 위쪽으로 설정
                        ctx.fillText(text, chartArea.right - 10, chartArea.top - 30); // 텍스트 위치 수정
                        ctx.restore();
                    }
                }
            ],
        });
    } catch (error) {
        console.error("환율 차트를 렌더링하는 중 오류 발생:", error);
    }
}

// 페이지 로딩 시 차트 렌더링
document.addEventListener("DOMContentLoaded", renderUsdKrwChart);