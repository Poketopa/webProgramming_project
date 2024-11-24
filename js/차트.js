document.addEventListener("DOMContentLoaded", () => {
    // 환율 데이터를 가져와 차트를 그리기 위한 함수
    async function fetchAndRenderExchangeRateChart() {
        try {
            // CoinGecko API에서 환율 데이터 가져오기 (최근 데이터 모음)
            const rateResponse = await fetch(
                "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=krw&days=365"
            );
            const rateData = await rateResponse.json();

            // 날짜별 환율 데이터와 라벨 생성
            const labels = rateData.prices.map((price) => {
                const date = new Date(price[0]);
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            });

            const rates = rateData.prices.map((price) => price[1]);

            // Chart.js를 사용해 차트 그리기
            const ctx = document.getElementById("usd-krw-chart-canvas").getContext("2d");
            new Chart(ctx, {
                type: "line", // 라인 차트 유형
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "USD/KRW 환율 (지난 1년)",
                            data: rates,
                            borderColor: "#007bff", // 부드러운 파란색 라인 색상
                            backgroundColor: "rgba(0, 123, 255, 0.1)", // 투명한 파란색 배경색
                            borderWidth: 2,
                            fill: true, // 아래 영역 채우기
                            tension: 0.3, // 곡선 부드럽게 설정
                            pointRadius: 0, // 데이터 포인트 마커 제거
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                            labels: {
                                color: "#333333", // 범례 라벨 색상
                                font: {
                                    size: 16, // 폰트 크기 조정
                                    weight: "bold",
                                },
                            },
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.raw.toLocaleString("ko-KR")} KRW`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#666666", // x축 라벨 색상
                                font: {
                                    size: 12, // 폰트 크기 조정
                                },
                            },
                            grid: {
                                display: false, // x축 그리드 비활성화
                            },
                        },
                        y: {
                            ticks: {
                                color: "#666666", // y축 라벨 색상
                                font: {
                                    size: 12, // 폰트 크기 조정
                                },
                                callback: function (value) {
                                    return value.toLocaleString("ko-KR"); // y축 값 포맷
                                },
                            },
                            grid: {
                                color: "rgba(200, 200, 200, 0.1)", // y축 그리드 색상 (연한 회색)
                                lineWidth: 0.5, // 그리드 라인 두께 조정
                            },
                        },
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    layout: {
                        padding: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    },
                    elements: {
                        line: {
                            borderJoinStyle: "round",
                        }
                    }
                },
            });
        } catch (error) {
            console.error("환율 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 환율 차트 그리기 함수 호출
    fetchAndRenderExchangeRateChart();
});
document.addEventListener("DOMContentLoaded", () => {
    // 환율 데이터를 가져와 차트를 그리기 위한 함수
    async function fetchAndRenderExchangeRateChart() {
        try {
            // CoinGecko API에서 환율 데이터 가져오기 (최근 데이터 모음)
            const rateResponse = await fetch(
                "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=krw&days=365"
            );
            const rateData = await rateResponse.json();

            // 날짜별 환율 데이터와 라벨 생성
            const labels = rateData.prices.map((price) => {
                const date = new Date(price[0]);
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            });

            const rates = rateData.prices.map((price) => price[1]);

            // Chart.js를 사용해 차트 그리기
            const ctx = document.getElementById("usd-krw-chart-canvas").getContext("2d");
            new Chart(ctx, {
                type: "line", // 라인 차트 유형
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "USD/KRW 환율 (지난 1년)",
                            data: rates,
                            borderColor: "#007bff", // 부드러운 파란색 라인 색상
                            backgroundColor: "rgba(0, 123, 255, 0.1)", // 투명한 파란색 배경색
                            borderWidth: 2,
                            fill: true, // 아래 영역 채우기
                            tension: 0.3, // 곡선 부드럽게 설정
                            pointRadius: 0, // 데이터 포인트 마커 제거
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                            labels: {
                                color: "#333333", // 범례 라벨 색상
                                font: {
                                    size: 16, // 폰트 크기 조정
                                    weight: "bold",
                                },
                            },
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.raw.toLocaleString("ko-KR")} KRW`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#666666", // x축 라벨 색상
                                font: {
                                    size: 12, // 폰트 크기 조정
                                },
                            },
                            grid: {
                                display: false, // x축 그리드 비활성화
                            },
                        },
                        y: {
                            ticks: {
                                color: "#666666", // y축 라벨 색상
                                font: {
                                    size: 12, // 폰트 크기 조정
                                },
                                callback: function (value) {
                                    return value.toLocaleString("ko-KR"); // y축 값 포맷
                                },
                            },
                            grid: {
                                color: "rgba(200, 200, 200, 0.1)", // y축 그리드 색상 (연한 회색)
                                lineWidth: 0.5, // 그리드 라인 두께 조정
                            },
                        },
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    layout: {
                        padding: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        },
                    },
                    elements: {
                        line: {
                            borderJoinStyle: "round",
                        }
                    }
                },
            });
        } catch (error) {
            console.error("환율 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 환율 차트 그리기 함수 호출
    fetchAndRenderExchangeRateChart();
});
