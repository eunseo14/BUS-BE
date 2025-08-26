const { getDistanceFromLatLonInMeters } = require('../services/mathService');
const {
  getState, setLatestLocation, resetPrevFlowFlags, resetAll, consumeForceLed
} = require('../services/geoState');

// 설정값
const PREV_RADIUS_M = 30;   // 전정류장 판정 반경
const EXIT_HOLD_MS  = 3000; // 탈출 유지 시간
const DEST_NEAR_M   = 50;   // 목적지 근접(LED) 기준

// 유틸
function distToPrevStationMeters(lat, lng) {
  const { prevStation } = getState();
  if (!prevStation) return Infinity;
  return getDistanceFromLatLonInMeters(lat, lng, prevStation.lat, prevStation.lng);
}
function distToDestinationMeters(lat, lng) {
  const { destination } = getState();
  if (!destination) return Infinity;
  return getDistanceFromLatLonInMeters(lat, lng, destination.lat, destination.lng);
}

// 전정류장 상태 업데이트
function updatePrevStationState(nowMs, lat, lng) {
  const state = getState();
  if (!state.prevStation) return;

  const d = distToPrevStationMeters(lat, lng);
  const isInside = d <= PREV_RADIUS_M;

  if (!state.geofenceInside && isInside) {
    state.geofenceInside = true;
    state.enteredOnce = true;
    state.lastExitTimeMs = null;
  }
  if (state.geofenceInside && !isInside) {
    state.geofenceInside = false;
    state.lastExitTimeMs = nowMs;
  }
  if (!isInside && state.enteredOnce && !state.prevPassed && state.lastExitTimeMs) {
    if (nowMs - state.lastExitTimeMs >= EXIT_HOLD_MS) {
      state.prevPassed = true;
    }
  }
}

// 위치 수신 (ESP32 → 서버)
const postLocation = (req, res) => {
  const { lat, lng } = req.body || {};
  if (typeof lat === 'undefined' || typeof lng === 'undefined') {
    return res.status(400).json({ error: 'lat/lng required' });
  }

  setLatestLocation({ lat, lng });

  const state = getState();
  updatePrevStationState(Date.now(), state.latestLocation.lat, state.latestLocation.lng);

  return res.json({ message: 'Location received!' });
};

// LED 상태 (ESP32 ← 서버)
const getLedStatus = (req, res) => {
  // ✅ 즉시하차/자동하차에서 한 번만 true 주는 원-샷
  if (consumeForceLed()) {
    return res.json({ led: true, reason: 'oneshot' });
  }

  const state = getState();
  if (!state.latestLocation || !state.destination) {
    return res.json({ led: false, distance: null });
  }

  const distance = distToDestinationMeters(state.latestLocation.lat, state.latestLocation.lng);
  const isNear = distance <= DEST_NEAR_M;

  // ✅ 자동 하차벨: 전정류장 통과 + 목적지 근접 → LED ON 한번 & 리셋
  if (state.prevPassed && isNear) {
    resetAll();            // 상태 초기화
    return res.json({ led: true, reason: 'auto' });
  }

  return res.json({ led: false, distance: Math.round(distance) });
};

module.exports = {
  postLocation,
  getLedStatus,
};
