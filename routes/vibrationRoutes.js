const express = require('express');
const router = express.Router();
const vibrationController = require('../controllers/vibrationController');

// FE가 진동 포인트 설정
router.post('/vibration/point', vibrationController.setVibrationPoint);

// ESP32가 진동 여부 확인
router.get('/vibration/status', vibrationController.getVibrationStatus);

module.exports = router;
