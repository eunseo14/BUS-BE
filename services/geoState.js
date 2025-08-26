const state = {
  destination: null,     // { lat, lng }
  prevStation: null,     // { lat, lng }
  vibrationPoint: null,  // { lat, lng }
  latestLocation: null,  // { lat, lng }

  // 전 정류장 판정 상태머신
  geofenceInside: false,
  enteredOnce:    false,
  lastExitTimeMs: null,
  prevPassed:     false,

  // ✅ 즉시하차/자동하차에서 LED 한 번만 켜주기 위한 원-샷 래치
  forceLed: false,
};

function setAll({ destination, prevStation, vibrationPoint }) {
  if (destination)     state.destination     = { lat: Number(destination.lat),     lng: Number(destination.lng) };
  if (prevStation)     state.prevStation     = { lat: Number(prevStation.lat),     lng: Number(prevStation.lng) };
  if (vibrationPoint)  state.vibrationPoint  = { lat: Number(vibrationPoint.lat),  lng: Number(vibrationPoint.lng) };
}

function setLatestLocation({ lat, lng }) {
  state.latestLocation = { lat: Number(lat), lng: Number(lng) };
}

function resetPrevFlowFlags() {
  state.geofenceInside = false;
  state.enteredOnce    = false;
  state.lastExitTimeMs = null;
  state.prevPassed     = false;
}

function resetAll() {
  state.destination    = null;
  state.prevStation    = null;
  state.vibrationPoint = null;
  state.latestLocation = null;
  resetPrevFlowFlags();
  state.forceLed = false;
}

function forceLedOn() { state.forceLed = true; }
function consumeForceLed() {
  if (state.forceLed) {
    state.forceLed = false;   // 1회만 true 반환
    return true;
  }
  return false;
}

function getState()           { return state; }
function getDestination()     { return state.destination; }
function getPrevStation()     { return state.prevStation; }
function getVibrationPoint()  { return state.vibrationPoint; }

module.exports = {
  setAll,
  setLatestLocation,
  resetPrevFlowFlags,
  resetAll,
  forceLedOn,
  consumeForceLed,
  getState,
  getDestination,
  getPrevStation,
  getVibrationPoint,
};
