const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const alightController = require('../controllers/alightController');
const vibrationController = require('../controllers/vibrationController');

router.get('/bus-lane', clientController.getBusLane);
router.post('/set-destination', clientController.setDestination);

// ✅ 즉시하차: LED ON 1회 + 전체 리셋
router.post('/alight-now', alightController.alightNow);

// ✅ 프론트에서 진동 멈춤
router.post('/vibration/stop', vibrationController.stopVibration);

module.exports = router;
