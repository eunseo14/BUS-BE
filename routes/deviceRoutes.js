// routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const { postLocation, getLedStatus } = require('../controllers/deviceController');
const vibrationController = require('../controllers/vibrationController');

router.post('/location', postLocation);               // ESP32 → 위치 업로드 (3초마다)
router.get('/led-status', getLedStatus);              // ESP32 ← LED 상태 폴링
router.get('/vibration/status', vibrationController.getVibrationStatus); // ESP32 ← 진동 상태 폴링

module.exports = router;
