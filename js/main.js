const apikey = ``; // 지진
const matterkey = ``; // 미세먼지
const socket = io();

/* 
==================================================================
  API 실시간으로 가져오기 위해서 현재 시간을 실시간으로 설정하는 Code
==================================================================
*/
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatEqkTime(tmFc) {
  const tmFcStr = String(tmFc);
  const year = tmFcStr.substring(0, 4);
  const month = tmFcStr.substring(4, 6);
  const day = tmFcStr.substring(6, 8);
  const hour = tmFcStr.substring(8, 10);
  const minute = tmFcStr.substring(10, 12);
  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
}

/* 
==================================================================
  지도 Code
==================================================================
*/
function initMap() {
  var mapContainer = document.getElementById("map"),
    mapOption = {
      center: new kakao.maps.LatLng(37.12094, 127.18196),
      level: 14,
    };

  window.map = new kakao.maps.Map(mapContainer, mapOption);
}

function addMarker(lat, lon, location, time, magnitude) {
  var markerPosition = new kakao.maps.LatLng(lat, lon);

  var marker = new kakao.maps.Marker({
    position: markerPosition,
  });

  marker.setMap(window.map);

  var infowindow = new kakao.maps.InfoWindow({
    content: `<div style="padding:5px;">위치: ${location}<br>시간: ${time}<br>규모: ${magnitude}</div>`,
  });

  kakao.maps.event.addListener(marker, "mouseover", function () {
    infowindow.open(window.map, marker);
  });

  kakao.maps.event.addListener(marker, "mouseout", function () {
    infowindow.close();
  });
}

// 현위치 이미지 마커 생성
var imageSrc = "https://youip.net/images/marker_kakao.png", // 마커이미지의 주소입니다
  imageSize = new kakao.maps.Size(50, 65), // 마커이미지의 크기입니다
  imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

// 현 위치 마커 표시
if (navigator.geolocation) {
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude, // 위도
      lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    displayMarker(locPosition, message);
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  var locPosition = new kakao.maps.LatLng(37.12094, 127.18196),
    message = "geolocation을 사용할수 없어요..";

  displayMarker(locPosition, message);
}

function displayMarker(locPosition, message) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: locPosition,
    image: markerImage,
  });

  var iwContent = message, // 인포윈도우에 표시할 내용
    iwRemoveable = true;

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  // 인포윈도우를 마커위에 표시합니다
  infowindow.open(map, marker);

  // 지도 중심좌표를 접속위치로 변경합니다
  map.setCenter(locPosition);
}

/* 
==================================================================
  미세먼지 Code
==================================================================
*/
function getClassForAirQuality(pm10) {
  if (pm10 <= 30) return "matter-good";
  if (pm10 <= 80) return "matter-moderate";
  if (pm10 <= 150) return "matter-unhealthy";
  if (pm10 <= 200) return "matter-very-unhealthy";
  return "matter-hazardous";
}

async function getMatterData() {
  const sidoName = document.getElementById("sidoSelect").value;
  const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=${encodeURIComponent(
    sidoName
  )}&pageNo=1&numOfRows=100&returnType=json&serviceKey=${matterkey}&ver=1.0`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const matterDiv = document.getElementById("matter");

    if (data.response.body.items.length > 0) {
      const matter = data.response.body.items[0];
      const pm10 = matter.pm10Value;
      const pm25 = matter.pm25Value;

      const airQualityClass = getClassForAirQuality(pm10);
      matterDiv.className = airQualityClass;
      matterDiv.innerHTML = `<p>PM10: ${pm10} ㎍/㎥</p><p>PM2.5: ${pm25} ㎍/㎥</p>`;
    } else {
      matterDiv.innerHTML = "<p>현재 미세먼지 정보가 없습니다.</p>";
    }
  } catch (error) {
    console.error("Error fetching matter data:", error);
    document.getElementById("matter").innerHTML =
      "<p>미세먼지 데이터를 불러오는 중 오류가 발생했습니다.</p>";
  }
}

async function drawAirQualityChart() {
  const response = await fetch("/airQuality/recent");
  const data = await response.json();

  const ctx = document.getElementById("airQualityChart").getContext("2d");
  const chartData = {
    labels: data.map((record) => new Date(record.timestamp)),
    datasets: [
      {
        label: "PM10",
        data: data.map((record) => record.pm10),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: "PM2.5",
        data: data.map((record) => record.pm25),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
    ],
  };

  window.airQualityChart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "minute",
          },
        },
      },
    },
  });
}

async function updateAirQualityChart() {
  const response = await fetch("/airQuality/recent");
  const data = await response.json();

  const newLabels = data.map((record) => new Date(record.timestamp));
  const pm10Data = data.map((record) => record.pm10);
  const pm25Data = data.map((record) => record.pm25);

  window.airQualityChart.data.labels = newLabels;
  window.airQualityChart.data.datasets[0].data = pm10Data;
  window.airQualityChart.data.datasets[1].data = pm25Data;
  window.airQualityChart.update();
}

document
  .getElementById("searchButton")
  .addEventListener("click", async function () {
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;

    if (!startDate || !startTime || !endDate || !endTime) {
      alert("날짜와 시간을 모두 선택하세요.");
      return;
    }

    try {
      const response = await fetch(
        `/airQuality/search?startDate=${startDate}&startTime=${startTime}&endDate=${endDate}&endTime=${endTime}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = "";

      if (data.length > 0) {
        data.forEach((record) => {
          const p = document.createElement("p");
          p.textContent = `날짜: ${new Date(
            record.timestamp
          ).toLocaleString()}, PM10: ${record.pm10}, PM2.5: ${record.pm25}`;
          resultsDiv.appendChild(p);
        });
      } else {
        resultsDiv.innerHTML = "<p>해당 기간의 미세먼지 기록이 없습니다.</p>";
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      document.getElementById("searchResults").innerHTML =
        "<p>기록을 불러오는 중 오류가 발생했습니다.</p>";
    }
  });

/* 
==================================================================
  지진 Code
==================================================================
*/
async function getData() {
  initMap();
  getMatterData();

  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() - 3);

  const toTmFc = formatDate(today);
  const fromTmFc = formatDate(threeDaysLater);

  const url = `http://apis.data.go.kr/1360000/EqkInfoService/getEqkMsg?ServiceKey=${apikey}&pageNo=1&numOfRows=10&dataType=JSON&fromTmFc=${fromTmFc}&toTmFc=${toTmFc}`;
  const response = await fetch(url);
  const data = await response.json();
  const eqkInfoDiv = document.getElementById("earthquake-info");
  eqkInfoDiv.innerHTML = "";

  if (data.response.body.items.item.length > 0) {
    data.response.body.items.item.forEach((eq) => {
      const timeSpan = document.createElement("span");
      timeSpan.textContent = `지진 발생 시간: ${formatEqkTime(eq.tmFc)} `;
      const locSpan = document.createElement("span");
      locSpan.textContent = `위치: ${eq.loc} `;
      const mtSpan = document.createElement("span");
      mtSpan.textContent = `규모: ${eq.mt}`;

      const p = document.createElement("p");
      p.appendChild(timeSpan);
      p.appendChild(locSpan);
      p.appendChild(mtSpan);

      eqkInfoDiv.appendChild(p);

      addMarker(eq.lat, eq.lon, eq.loc, formatEqkTime(eq.tmFc), eq.mt);
    });
  } else {
    eqkInfoDiv.innerHTML = "<p>현재 지진 정보가 없습니다.</p>";
  }
}

/* 
==================================================================
  로그인 Code
==================================================================
*/
document.addEventListener("DOMContentLoaded", function () {
  // 로그인 상태 확인 및 UI 업데이트
  const authItem = document.getElementById("auth-item");

  fetch("/auth/status")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        authItem.innerHTML = `
          <span>${data.username}</span>
          <button id="logout-button">로그아웃</button>
        `;

        document
          .getElementById("logout-button")
          .addEventListener("click", function () {
            fetch("/logout", { method: "POST" }).then(() => {
              location.reload();
            });
          });
      } else {
        authItem.innerHTML = `<a href="/login">Login</a>`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  getData();
  document
    .getElementById("sidoSelect")
    .addEventListener("change", getMatterData);
  drawAirQualityChart();

  socket.on("updateAirQuality", () => {
    updateAirQualityChart();
    getMatterData();
  });
});
