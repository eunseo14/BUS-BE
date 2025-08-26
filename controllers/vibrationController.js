const { getDistanceFromLatLonInMeters } = require('../services/mathService');
const { getState, resetAll } = require('../services/geoState');

// ESP32: 진동 여부 조회 (목적지에 가까워지면 자동으로 true)
const getVibrationStatus = (req, res) => {
  const st = getState();
  const { destination, latestLocation, vibrationPoint } = st;

  if (!destination || !latestLocation || !vibrationPoint) {
    return res.json({ vibrate: false });
  }

  const distDest = getDistanceFromLatLonInMeters(
    latestLocation.lat, latestLocation.lng,
    destination.lat, destination.lng
  );
  const vibrationMeter = getDistanceFromLatLonInMeters(
    vibrationPoint.lat, vibrationPoint.lng,
    destination.lat, destination.lng
  );

  const vibrate = distDest <= vibrationMeter;
  return res.json({ vibrate });
};

// 프론트: "진동 멈춤" 요청 → 즉시 끄고 리셋 
const stopVibration = (req, res) => {
  resetAll();
  return res.status(200).json({ success: true, message: '진동 중단 및 state 리셋 완료' });
};

module.exports = {
  getVibrationStatus,
  stopVibration,
};
