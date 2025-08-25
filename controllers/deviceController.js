const { getDistanceFromLatLonInMeters } = require('../services/mathService');
const { getState, setLatestLocation,  resetPrevFlowFlags } = require('../services/geoState');

// ===== 설정값 =====
const PREV_RADIUS_M = 30;   // 전 정류장 판정용 반경
const EXIT_HOLD_MS  = 3000; // 탈출 지속 시간 3초

// ========= 유틸: 거리 계산 =========
function distToPrevStationMeters(lat, lng) {
  const state = getState();
  if (!state.prevStation) return Infinity;
  return getDistanceFromLatLonInMeters(lat, lng, prevStation.lat, prevStation.lng);
}
function distToDestinationMeters(lat, lng) {
  const state = getState();
  if (!state.destination) return Infinity;
  return getDistanceFromLatLonInMeters(lat, lng, destination.lat, destination.lng);
}

// ========= 상태머신 업데이트 =========
function updateprevStationState(nowMs, lat, lng) {
  const state = getState();

  if (!state.prevStation) return;

  const d = distToPrevStationMeters(lat, lng);
  const isInside = d <= PREV_RADIUS_M;

// 진입이벤트
  if (!state.geofenceInside && isInside) {
    state.geofenceInside = true;
    state.enteredOnce = true;
    state.lastExitTimeMs = null; //진입 시 탈출 타이머 초기화
  }
  // 탈출이벤트
  if (state.geofenceInside && !isInside) {
    state.geofenceInside = false;
    state.lastExitTimeMs = nowMs;
  }
  // 탈출 유지 3초 이상 => 전 정류장 통과 확정!!!!
  if (!isInside && state.enteredOnce && !state.prevPassed && state.lastExitTimeMs) {
    if (nowMs - state.lastExitTimeMs >= EXIT_HOLD_MS) {
      state.prevPassed = true;
    }
  }
}

// ========= 위치 수신 =========
const postLocation = (req, res) => {
  const { lat, lng } = req.body;

  if (typeof lat === 'undefined' || typeof lng === 'undefined') {
    return res.status(400).json({ error: "lat/lng required" });
  }

  const loc = { lat: Number(lat), lng: Number(lng) };
  setLatestLocation(loc);

  const nowMs = Date.now();
  updateprevStationState(nowMs, loc.lat, loc.lng);
  console.log(loc);
  res.json({ message: "Location received!" });
};

// ========= LED(목적지 50m) =========
const getLedStatus = (req, res) => {
  const { latestLocation, destination } = getState();
  
  if (!latestLocation || !destination) {
    return res.json({ led: false, distance: null });
  }

  const distance = distToDestinationMeters(latestLocation.lat, latestLocation.lng);
  const isNear = distance <= 50;
  res.json({ led: isNear, distance: Math.round(distance) });
};

// ========= 전 정류장 통과 상태 조회 + 도착지 50m =========
const getprevStationStatus = (req, res) => {
  const state = getState();
  
  // inside 여부 (30m 반경 안에 있는지)
  let inside = false;
  if (state.latestLocation) {
    inside = distToPrevStationMeters(state.latestLocation.lat, state.latestLocation.lng) <= PREV_RADIUS_M;
  }

  // 도착지 거리 (50m 이내인지)
  let destinationNear = false;
  if (state.latestLocation) {
    const distDest = distToDestinationMeters(state.latestLocation.lat, state.latestLocation.lng);
    destinationNear = distDest <= 50;
  }

  // ✅ 이중 검증: 전정류장 통과 + 도착지 50m 이내
  const led = state.prevPassed && destinationNear;

  res.json({
    led    // 최종 LED 신호
  });
};


// ========= 필요 시 초기화 =========
const resetprevStationState = (req, res) => {
  resetPrevFlowFlags();
  res.json({ ok: true, message: "prevStation state reset" });
};

module.exports = {
  postLocation,
  getLedStatus,
  getprevStationStatus,
  resetprevStationState,
};
