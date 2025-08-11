const express = require('express');
const router = express.Router();
const { postLocation, getLedStatus } = require('../controllers/deviceController');

router.post('/location', postLocation);      // ✅ POST /location
router.get('/led-status', getLedStatus);     // ✅ GET /led-status

module.exports = router;