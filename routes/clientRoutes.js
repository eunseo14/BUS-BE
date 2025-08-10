const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// 버스 노선 정보 알려주기
router.get('/busLane', clientController.getBusLane);

// 목적지 설정
router.post('/destination', clientController.setDestination);

module.exports = router;