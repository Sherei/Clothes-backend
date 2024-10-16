const express = require("express");
// import { createStripePaymentAndOrder } from "../controllers/paymentController.js";
const PaymentAndOrderController = require("../controllers/paymentController.js");
const router = express.Router();

router.post(
  "/stripe/pay-and-create-order",
  PaymentAndOrderController.ProcessStripePayment
);

module.exports = router;
