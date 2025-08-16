const { getDistanceFromLatLonInMeters } = require('../services/mathService');

//강남역 근처 좌표
const destination = { lat: 37.4979, lng: 127.0276 };

let latestLocation = { lat: 37.4977, lng: 127.0275 };

const postLocation = (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: "lat/lng required" });

  latestLocation = { lat, lng };
  res.json({ message: "Location received!" });
  console.log(latestLocation);
};

const getLedStatus = (req, res) => {
  if (!latestLocation) return res.json({ led: false });

  const distance = getDistanceFromLatLonInMeters(
    latestLocation.lat, latestLocation.lng,
    destination.lat, destination.lng
  );
  console.log(distance);
  const isNear = distance <= 100;
  console.log(isNear);
  res.json({ led: isNear });
};

module.exports = { postLocation, getLedStatus };