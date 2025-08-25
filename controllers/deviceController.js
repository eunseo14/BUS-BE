const { getDistanceFromLatLonInMeters } = require('../services/mathService');

// ===== 설정값 =====
const PREV_RADIUS_M = 30;   // 전 정류장 판정용 반경
const EXIT_HOLD_MS  = 3000; // 탈출 지속 시간 3초

// ===== 목적지 / 전정류장 좌표 =====
let destination = null;   // 목적지 { lat, lng }
let prevStop = null;      // 전정류장 { lat, lng }

// ===== 위치 및 상태 =====
let latestLocation = null;

// 상태머신용 메모리
let geofenceInside = false;  //지금 반경 30m안임?
let enteredOnce    = false; //한번이라도 30m안에 진입한적잇음?
let lastExitTimeMs = null; //마지막으로 30m 밖으로 나간시간이언제임?
let prevPassed     = false; // ✅ 전 정류장 통과 확정 여부

// ========= 유틸: 거리 계산 =========
function distToPrevStopMeters(lat, lng) {
  if (!prevStop) return Infinity;
  return getDistanceFromLatLonInMeters(lat, lng, prevStop.lat, prevStop.lng);
}
function distToDestinationMeters(lat, lng) {
  if (!destination) return Infinity;
  return getDistanceFromLatLonInMeters(lat, lng, destination.lat, destination.lng);
}

// ========= 상태머신 업데이트 =========
function updatePrevStopState(nowMs, lat, lng) {
  if (!prevStop) return;

  const d = distToPrevStopMeters(lat, lng);
  const isInside = d <= PREV_RADIUS_M;
// 진입이벤트
  if (!geofenceInside && isInside) {
    geofenceInside = true;
    enteredOnce = true;
    lastExitTimeMs = null; //진입 시 탈출 타이머 초기화
  }
  // 탈출이벤트
  if (geofenceInside && !isInside) {
    geofenceInside = false;
    lastExitTimeMs = nowMs;
  }
  // 탈출 유지 3초 이상 => 전 정류장 통과 확정!!!!
  if (!isInside && enteredOnce && !prevPassed && lastExitTimeMs) {
    if (nowMs - lastExitTimeMs >= EXIT_HOLD_MS) {
      prevPassed = true;
    }
  }
}

// ========= 위치 수신 =========
const postLocation = (req, res) => {
  const { lat, lng } = req.body;

  if (typeof lat === 'undefined' || typeof lng === 'undefined') {
    return res.status(400).json({ error: "lat/lng required" });
  }

  latestLocation = { lat: Number(lat), lng: Number(lng) };
  const nowMs = Date.now();
  updatePrevStopState(nowMs, latestLocation.lat, latestLocation.lng);

  res.json({ message: "Location received!" });
};

// ========= LED(목적지 100m) =========
const getLedStatus = (req, res) => {
  if (!latestLocation || !destination) {
    return res.json({ led: false, distance: null });
  }

  const distance = distToDestinationMeters(latestLocation.lat, latestLocation.lng);
  const isNear = distance <= 100;
  res.json({ led: isNear, distance: Math.round(distance) });
};

// ========= 목적지 좌표 세팅 =========
const setDestination = (req, res) => {
  const { destinationLat, destinationLng } = req.body;

  if (typeof destinationLat === 'undefined' || typeof destinationLng === 'undefined') {
    return res.status(400).json({ error: "destinationLat/destinationLng required" });
  }

  destination = { lat: Number(destinationLat), lng: Number(destinationLng) };
  res.json({ ok: true, message: "destination set", destination });
};

// ========= 전 정류장 좌표 세팅 =========
const setPrevStop = (req, res) => {
  const { prevStopLat, prevStopLng } = req.body;

  if (typeof prevStopLat === 'undefined' || typeof prevStopLng === 'undefined') {
    return res.status(400).json({ error: "prevStopLat/prevStopLng required" });
  }

  prevStop = { lat: Number(prevStopLat), lng: Number(prevStopLng) };
  geofenceInside = false;
  enteredOnce    = false;
  lastExitTimeMs = null;
  prevPassed     = false;

  res.json({ ok: true, message: "prevStop set", prevStop });
};






// ========= 전 정류장 통과 상태 조회 + 도착지 50m =========
const getPrevStopStatus = (req, res) => {
  if (!prevStop || !destination) {
    return res.json({
      hasPrevStop: !!prevStop,
      hasDestination: !!destination,
      prevPassed: false,
      led: false
    });
  }

  // inside 여부 (30m 반경 안에 있는지)
  let inside = false;
  if (latestLocation) {
    inside = distToPrevStopMeters(latestLocation.lat, latestLocation.lng) <= PREV_RADIUS_M;
  }

  // 도착지 거리 (50m 이내인지)
  let destinationNear = false;
  if (latestLocation) {
    const distDest = distToDestinationMeters(latestLocation.lat, latestLocation.lng);
    destinationNear = distDest <= 50;
  }

  // ✅ 이중 검증: 전정류장 통과 + 도착지 50m 이내
  const led = prevPassed && destinationNear;

  res.json({
    hasPrevStop: true,
    hasDestination: true,
    prevPassed,
    destinationNear,
    inside,
    enteredOnce,
    holdMs: (lastExitTimeMs && !geofenceInside) ? (Date.now() - lastExitTimeMs) : 0,
    led    // 최종 LED 신호
  });
};




// ========= 필요 시 초기화 =========
const resetPrevStopState = (req, res) => {
  geofenceInside = false;
  enteredOnce    = false;
  lastExitTimeMs = null;
  prevPassed     = false;
  res.json({ ok: true, message: "prevStop state reset" });
};

module.exports = {
  postLocation,
  getLedStatus,
  setDestination,
  setPrevStop,
  getPrevStopStatus,
  resetPrevStopState,
};
