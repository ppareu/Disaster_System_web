const fetch = require("node-fetch");
const { AirQuality } = require("../models");
const matterkey = "미세먼지 API KEY";

async function getMatterDataAndSave() {
  const sidoName = "부산"; // 예시로 '부산'을 사용, 실제로는 위치 기반으로 변경
  const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=${encodeURIComponent(
    sidoName
  )}&pageNo=1&numOfRows=100&returnType=json&serviceKey=${matterkey}&ver=1.0`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.response.body.items.length > 0) {
      const matter = data.response.body.items[0];
      const pm10 = matter.pm10Value;
      const pm25 = matter.pm25Value;

      await AirQuality.create({
        sidoName,
        pm10,
        pm25,
      });
      console.log("미세먼지 데이터 저장 성공");
    } else {
      console.log("현재 미세먼지 정보가 없습니다.");
    }
  } catch (error) {
    console.error("미세먼지 데이터를 불러오는 중 오류가 발생했습니다:", error);
  }
}

module.exports = { getMatterDataAndSave };
