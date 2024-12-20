

const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/banner");


router.post("/banner", BannerController.AddBanner);

router.get("/banner", BannerController.getBanner);

router.delete("/deleteBanner", BannerController.deleteBanner);

router.get("/banner_edit", BannerController.editBanner);

router.put("/banner_update", BannerController.UpdateBanner);


module.exports = router;