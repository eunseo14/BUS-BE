const { getDistanceFromLatLonInMeters } = require('../services/mathService');

//강남역 근처 좌표
const destination = { lat: 37.4979, lon: 127.0276 };

let latestLocation = null;

const postLocation = (req, res) => {
  const { lat, lon } = req.body;
  if (!lat || !lon) return res.status(400).json({ error: "lat/lon required" });

  latestLocation = { lat, lon };
  res.json({ message: "Location received!" });
};

const getLedStatus = (req, res) => {
  if (!latestLocation) return res.json({ led: false });

  const distance = getDistanceFromLatLonInMeters(
    latestLocation.lat, latestLocation.lon,
    destination.lat, destination.lon
  );
  console.log(distance);
  const isNear = distance <= 100;
  res.json({ led: isNear });
};

module.exports = { postLocation, getLedStatus };