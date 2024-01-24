const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/createtrack', orderController.createTrack);

// GET /tracking
router.get('/tracking', orderController.getAllTrackings);

// GET /tracking/search
router.get('/tracking/search', orderController.searchTracking);

// GET /tracking/filter
router.get('/tracking/filter',  orderController.filterTracking);

// PUT /tracking/{trackingId}
router.put('/tracking/:trackingId', orderController.updateTracking);

// DELETE /tracking/{trackingId}
router.delete('/tracking/:trackingId', orderController.deleteTracking);

// GET /tracking/{trackingId}
router.get('/tracking/:trackingId',  orderController.getTracking);

// PATCH /tracking/bulk-update
router.patch('/tracking/bulk-update', orderController.bulkUpdateTracking);

// DELETE /{id}
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
