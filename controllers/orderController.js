const catchAsync = require("../utils/catchAsync");
const OrderTracking = require("../models/orderModel");

exports.createTrack = catchAsync(async (req, res, next) => {
  const { trackingId, shippingBy, shippingFrom, deliveringTo } = req.body;

  const newOrderTrack = await OrderTracking.create({
    trackingId,
    shippingBy,
    shippingFrom,
    deliveringTo,
  });

  res.status(201).json({
    status: "success",
    data: {
      newOrderTrack,
    },
  });
});

exports.getAllTrackings = catchAsync(async (req, res, next) => {

  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  
  // --------------- Filtering -----------------
  // Finding resource with query string 
  const query = OrderTracking.find(queryObj);

  const orderTrack = await query;

  res.status(200).json({
    status: "success",
    data: {
      orderTrack,
    },
  });
});

exports.getTracking = catchAsync(async (req, res, next) => {
  const orderTrack = await OrderTracking.findById(req.params.trackingId);

  res.status(200).json({
    status: "success",
    data: {
      orderTrack,
    },
  });
});

exports.searchTracking = catchAsync(async (req, res, next) => {
  const orderTrack = await OrderTracking.find({
    trackingId: req.query.trackingId,
  });

  res.status(200).json({
    status: "success",
    data: {
      orderTrack,
    },
  });
});

exports.filterTracking = catchAsync(async (req, res, next) => {

  const orderTrack = await OrderTracking.find({

    shippingBy: req.query.shippingBy,
    shippingFrom: req.query.shippingFrom,
    deliveringTo: req.query.deliveringTo,

  });

  res.status(200).json({
    status: "success",
    data: {
      orderTrack,
    },
  });
});



exports.updateTracking = catchAsync(async (req, res, next) => {
  const orderTrack = await OrderTracking.findByIdAndUpdate(
    req.params.trackingId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      orderTrack,
    },
  });
});

exports.deleteTracking = catchAsync(async (req, res, next) => {
  await OrderTracking.findByIdAndDelete(req.params.trackingId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.bulkUpdateTracking = catchAsync(async (req, res, next) => {
  const orderTrack = await OrderTracking.updateMany(req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      orderTrack,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  await OrderTracking.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
