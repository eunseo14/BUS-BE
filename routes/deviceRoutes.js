const express = require('express');
const router = express.Router();
const { postLocation, getLedStatus } = require('../controllers/deviceController');
const vibrationController = require('../controllers/vibrationController');

router.post('/location', postLocation);      // ✅ POST /location
router.get('/led-status', getLedStatus);     // ✅ GET /led-status
router.get('/vibration/status', vibrationController.getVibrationStatus);

module.exports = router;