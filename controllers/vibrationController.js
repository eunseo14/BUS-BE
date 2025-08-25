const { getDistanceFromLatLonInMeters } = require('../services/mathService');
const { getLatestLocation, getDestination } = require('./deviceController');

let vibrationPoint = null;   // FE에서 설정한 거리 (m)

// FE에서 진동 포인트 설정
const setVibrationPoint = (req, res) => {
  const { vibrationDistance } = req.body;
  if (typeof vibrationDistance === 'undefined') {
    return res.status(400).json({ error: "vibrationDistance required" });
  }
  vibrationPoint = Number(vibrationDistance);
  res.json({ ok: true, message: "Vibration point set", vibrationPoint });
};

// ESP32/FE에서 진동 여부 조회
const getVibrationStatus = (req, res) => {
  const destination = getDestination();
  const latestLocation = getLatestLocation();

  if (!destination || !latestLocation || !vibrationPoint) {
    return res.json({ vibrate: false });
  }

  const distDest = getDistanceFromLatLonInMeters(
    latestLocation.lat, latestLocation.lng,
    destination.lat, destination.lng
  );

  const vibrate = distDest <= vibrationPoint;
  res.json({
    vibrate,  
    distanceToDestination: Math.round(distDest),
    vibrationPoint
  });
};

module.exports = {
  setVibrationPoint,
  getVibrationStatus,
};
