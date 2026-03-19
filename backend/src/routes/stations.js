const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', stationController.getAllStations);
router.get('/:id', stationController.getStationById);
router.get('/search/city/:city', stationController.searchByCity);

// Protected routes
router.post('/', auth, stationController.createStation);
router.put('/:id', auth, stationController.updateStation);
router.delete('/:id', auth, stationController.deleteStation);

module.exports = router;
