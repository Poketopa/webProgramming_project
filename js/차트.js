async function renderUsdKrwChart() {
  try {
    // 환율 API 호출 (USD 기준 최신 환율 정보 가져오기)
    const response = await fetch('https://v6.exchangerate-api.com/v6/f45f773c8d48900387b95e4e/latest/USD');
    const data = await response.json();

    // 환율 데이터에서 KRW 값 추출
    const usdToKrwRate = data.conversion_rates.KRW; // USD to KRW 환율

    const labelsForXAxis = []; // X축에 표시될 시간 라벨
    const exchangeRates = []; // 환율 데이터

    // 현재 시간 기준으로 6시간을 설정
    const currentDate = new Date();
    const startTime = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000); // 6시간 전 시간

    // 6시간 전부터 현재까지의 데이터 생성
    for (let i = 0; i < 360; i += 1) { // 1분 간격 데이터 생성
      const time = new Date(startTime.getTime() + i * 60 * 1000); // 1분 간격
      const formattedDateForXAxis = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`; // 시간:분 형식

      labelsForXAxis.push(formattedDateForXAxis);

      // 5분 간격 데이터만 추가
      if (i % 5 === 0) {
        exchangeRates.push(usdToKrwRate + (Math.random() * 5 - 2.5));
      }
    }

    // 차트 설정
    const ctx = document.getElementById("usd-krw-chart-canvas").getContext("2d");

    if (window.usdKrwChart) {
      window.usdKrwChart.destroy(); // 기존 차트가 있으면 삭제
    }

    window.usdKrwChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labelsForXAxis.filter((_, index) => index % 5 === 0), // 5분 간격 라벨만 추가
        datasets: [{
          label: 'USD to KRW', // 데이터셋 이름
          data: exchangeRates, // 환율 데이터
          borderColor: '#007bff', // 파란색 경계 색상
          backgroundColor: 'rgba(0, 123, 255, 0.1)', // 파란색 배경
          borderWidth: 2,
          fill: true, // 채우기
          tension: 0.3, // 선의 부드러움
          pointRadius: 0, // 포인트 숨기기
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // 범례 비활성화
          },
          title: {
            display: true,
            text: 'USD to KRW Exchange Rate', // 제목
            align: 'start',
            color: '#ffffff', // 흰색 텍스트
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
            enabled: true, // 기본 툴팁 활성화
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
              callback: function (value, index, ticks) {
                // "00분"에 해당하는 라벨만 표시, 나머지는 빈 문자열
                const label = this.getLabelForValue(value);
                return label.endsWith(":00") ? label : "";
              },
              maxRotation: 0, // 라벨 수평 유지
              minRotation: 0,
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
            },
            grid: {
              color: "#444444",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("환율 차트를 불러오는 중에 오류 발생:", error);
  }
}

// 페이지 로딩 시 차트 렌더링
document.addEventListener("DOMContentLoaded", renderUsdKrwChart);
