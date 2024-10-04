const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart");


router.post("/addToCart", CartController.AddToCart);

router.get("/addToCart", CartController.getAddToCart);

router.put("/updateCart", CartController.UpdateCart);

router.delete("/chkdeleteCart", CartController.CheckDelCArt);

router.delete("/deleteCart", CartController.DeleteCart);


module.exports = router;