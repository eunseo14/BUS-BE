const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// ESP32로부터 위도, 경도 받기
router.post('/location', deviceController.receiveDeviceLocation);

// ESP32에 명령 내리기
router.get('/command', deviceController.getDeviceCommand);

module.exports = router;