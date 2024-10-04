const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");


router.post("/comments", commentController.AddComment);

router.get("/comments", commentController.getComment);

router.delete("/deleteComment", commentController.deleteComment);



module.exports = router;