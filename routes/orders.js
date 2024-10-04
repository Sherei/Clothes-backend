const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");


router.get("/checkout", orderController.Checkout);

router.post("/Order", orderController.AddOrder);

router.get("/order", orderController.getOrder);

router.get("/orderDetail", orderController.OrderDetail);

router.put("/updateStatus", orderController.UpdateStatus);

router.delete("/deleteOrder", orderController.DeleteOrder);


module.exports = router;