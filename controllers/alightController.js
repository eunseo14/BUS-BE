const { resetAll, forceLedOn } = require('../services/geoState');

// 프론트: 즉시하차 버튼 → LED 한 번 켜고, 전체 리셋
exports.alightNow = (req, res) => {
  resetAll();     // 목적지/전정류장/진동포인트/플래그 초기화
  forceLedOn();   // 다음 /led-status 1회에 대해 true 반환
  return res.status(200).json({ success: true, message: "즉시하차: LED ON & state reset" });
};
