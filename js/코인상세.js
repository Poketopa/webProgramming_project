// URL에서 코인 ID와 이름 가져오기
const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get("coinId");
const coinName = urlParams.get("coinName");

// 코인 ID나 이름이 없을 경우 메인 페이지로 이동
if (!coinId || !coinName) {
  alert("코인 정보를 찾을 수 없습니다. 메인 페이지로 이동합니다.");
  window.location.href = "home.html";
}

// 차트 렌더링 함수
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
      const formattedDateForTooltip = `${
        date.getMonth() + 1
      }/${date.getDate()} ${date.getHours()}:00`; // 날짜와 시간
      labelsForXAxis.push(formattedDateForXAxis);
      labelsForTooltip.push(formattedDateForTooltip);
      prices.push(price[1]);
    });

    const ctx = document.getElementById("coin-chart-canvas").getContext("2d");

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
                // 라벨 값이 00시인 경우만 표시
                const labelDate = new Date(data.prices[index][0]);
                if (labelDate.getHours() === 0) {
                  return this.getLabelForValue(value);
                }
                return ""; // 00시가 아닌 경우 빈 문자열 반환
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

            const currentPriceText = `현재가: $${lastPrice.toLocaleString(
              "en-US"
            )}`;
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

// 상세 정보 렌더링
async function fetchCoinDetails(coinId) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const data = await response.json();

    const detailsContainer = document.getElementById("coin-details");
    detailsContainer.innerHTML = `
      <p><strong>이름:</strong> ${data.name} (${data.symbol.toUpperCase()})</p>
      <p><strong>현재가:</strong> ${data.market_data.current_price.usd.toLocaleString()} USD</p>
      <p><strong>시가총액:</strong> ${data.market_data.market_cap.usd.toLocaleString()} USD</p>
      <p><strong>24시간 거래량:</strong> ${data.market_data.total_volume.usd.toLocaleString()} USD</p>
      <p><strong>24시간 변동률:</strong> ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
      <p><strong>설명:</strong> ${data.description.en || "설명이 없습니다."}</p>
    `;
  } catch (error) {
    console.error("코인 상세 정보를 가져오는 중 오류 발생:", error);
  }
}

// 환율 가져오기 및 업데이트
async function fetchExchangeRate() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();
    const usdToKrwRate = data.rates.KRW; // 1 USD당 원화 값

    // 환율 섹션 업데이트
    document.querySelector(".exchange p").textContent = `${usdToKrwRate.toFixed(2)}₩`;
    return usdToKrwRate; // 환율 반환
  } catch (error) {
    console.error("환율 정보를 가져오는 중 오류 발생:", error);
  }
}

// 현재가 가져오기 및 업데이트
async function fetchCurrentPrices(usdToKrwRate) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const data = await response.json();
    const usdPrice = data.market_data.current_price.usd; // 현재 USD 가격
    const krwPrice = (usdPrice * usdToKrwRate).toFixed(2); // USD 가격을 KRW로 변환

    // 현재 가격 섹션 업데이트
    document.querySelector(".price p:nth-child(2)").textContent = `달러: $${usdPrice.toLocaleString()}`;
    document.querySelector(".price p:nth-child(3)").textContent = `원화: ₩${krwPrice.toLocaleString()}`;
  } catch (error) {
    console.error("현재가 정보를 가져오는 중 오류 발생:", error);
  }
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", async () => {
  await renderTokenChart(coinId, coinName); // 차트 렌더링
  await fetchCoinDetails(coinId); // 상세 정보 렌더링
  // 환율 및 현재가 업데이트
  const usdToKrwRate = await fetchExchangeRate(); // 환율 가져오기
  if (usdToKrwRate) {
    await fetchCurrentPrices(usdToKrwRate); // 현재가 가져오기
  }
});
