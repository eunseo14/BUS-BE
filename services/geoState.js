const state = {
  destination: null,     // { lat, lng }
  prevStation: null,     // { lat, lng }
  vibrationPoint: null,  // { lat, lng }

  latestLocation: null, // { lat, lng }

  // 상태머신 플래그
  geofenceInside: false,
  enteredOnce:    false,
  lastExitTimeMs: null,
  prevPassed:     false,
};

function setAll({ destination, prevStation, vibrationPoint }) {
  if (destination)   state.destination   = destination;
  if (prevStation)   state.prevStation   = prevStation;
  if (vibrationPoint) state.vibrationPoint = vibrationPoint;
}

function setLatestLocation({ lat, lng }) { state.latestLocation = { lat, lng}; }

function resetPrevFlowFlags() {
  state.geofenceInside = false;
  state.enteredOnce    = false;
  state.lastExitTimeMs = null;
  state.prevPassed     = false;
}

function getState() { return state; }
function getDestination() { return state.destination; }
function getPrevStation() { return state.prevStation; }
function getVibrationPoint() { return state.vibrationPoint; }

module.exports = {
  setAll,
  resetPrevFlowFlags,
  getState,
  getDestination,
  getPrevStation,
  getVibrationPoint,
  setLatestLocation
};
