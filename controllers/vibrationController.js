const { getDistanceFromLatLonInMeters } = require('../services/mathService');
const { getLatestLocation, getDestination } = require('./deviceController');
const { getState, setLatestLocation,  resetPrevFlowFlags } = require('../services/geoState');

let vibrationPoint = null;   // FE에서 설정한 거리 (m)

// ESP32에서 진동 여부 조회
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

  const vibrationMeter = getDistanceFromLatLonInMeters(
    vibrationPoint.lat, vibrationPoint.lng,
    destination.lat, destination.lng
  );


  const vibrate = distDest <= vibrationMeter;
  res.json({
    vibrate
  });
};

module.exports = {
  getVibrationStatus,
};
