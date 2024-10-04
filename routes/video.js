const express = require("express");
const router = express.Router();
const VideoController = require("../controllers/video");


router.post("/add-video", VideoController.add_Video);

router.get("/getVideo/:user", VideoController.get_Video);


module.exports = router;