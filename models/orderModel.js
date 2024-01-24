const mongoose = require("mongoose");

const orderTrackingSchema = new mongoose.Schema({

  trackingId: { type: String, required: true },
  shippingBy: { type: String, required: true },
  shippingFrom: { type: String, required: true },
  deliveringTo: { type: String, required: true },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  details: { type: String },

});

const OrderTracking = mongoose.model("OrderTracking", orderTrackingSchema);

module.exports = OrderTracking;
