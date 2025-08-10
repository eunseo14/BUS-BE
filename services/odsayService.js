require("dotenv").config();
const axios = require("axios");

const ODSAY_API_KEY = process.env.ODSAY_API_KEY;
const ODSAY_API_BASE_URL = "https://api.odsay.com/v1/api";

/**
 * 버스 번호로 Odsay API에서 노선 ID를 찾고, 상세 노선 정보를 반환
 * @param {number} lang 언어 (예: 0 = 국문)
 * @param {string} busNo 버스 번호 (예: '진월07')
 * @param {number} cityCode 도시 코드 (예: 5000 = 광주)
 */

async function getBusLaneByNumber(lang, busNo, cityCode) {
  try {
    // 1. 버스 번호로 노선 ID 검색
    const searchUrl = `${ODSAY_API_BASE_URL}/searchBusLane`;
    const searchRes = await axios.get(searchUrl, {
      params: {
        apiKey: ODSAY_API_KEY,
        busNo: busNo,
        CID: cityCode, // 도시 코드
      },
    });

    if (searchRes.data.result.lane[0]?.busNo !== busNo) {
      return {
        status: 400,
        body: {
          success: false,
          message: `버스 번호를 정확히 입력해주세요! (예: ${searchRes.data.result.lane[0].busNo})`,
        },
      };
    }

    const busID = searchRes.data.result.lane[0].busID; // 노선 ID

    // 2. 노선 상세정보 가져오기
    const detailUrl = `${ODSAY_API_BASE_URL}/busLaneDetail`;
    const detailRes = await axios.get(detailUrl, {
      params: {
        apiKey: ODSAY_API_KEY,
        busID: busID,
        lang: lang,
      },
    });

    return detailRes.data;
  } catch (error) {
    console.error("Odsay API 호출 오류:", error.message);
    return {
        status: 400,
        body: {
          success: false,
          message: '버스 번호를 정확히 입력해주세요!',
        },
      };
  }
}

module.exports = { getBusLaneByNumber };
