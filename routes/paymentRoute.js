const express = require("express");
const PaymentAndOrderController = require("../controllers/paymentController.js");
const router = express.Router();

router.post(
  "/stripe/pay-and-create-order",
  PaymentAndOrderController.CreateStripePaymentAndOrder
);

module.exports = router;
