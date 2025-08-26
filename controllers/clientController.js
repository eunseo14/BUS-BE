const { getBusLaneByNumber } = require("../services/odsayService");
const { setAll, resetPrevFlowFlags } = require('../services/geoState');

exports.getBusLane = async (req, res) => {
  const { lang, busNo, cityCode } = req.query;

  if (!busNo) {
    return res.status(200).json({
      status: 400,
      body: { success: false, message: "버스 번호를 입력해주세요!" },
    });
  }

  try {
    const result = await getBusLaneByNumber(
      parseInt(lang),
      busNo.trim(),
      parseInt(cityCode)
    );
    if (result?.status === 400) return res.status(200).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setDestination = (req, res) => {
  const { destination, prevStation, vibrationPoint } = req.body || {};

  if (!destination || !prevStation || !vibrationPoint) {
    return res.status(400).json({
      error: "destination / prevStation / vibrationPoint 모두 필요합니다.",
    });
  }

  setAll({ destination, prevStation, vibrationPoint });
  resetPrevFlowFlags();

  return res.status(200).json({
    status: 200,
    body: { success: true, message: "목적지 등록 완료" },
  });
};
