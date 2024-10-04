const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog");


router.post("/blog", blogController.AddBlog);

router.get("/blog", blogController.getBlog);

router.get("/singleBlog", blogController.getSingleBlog);

router.delete("/deleteBlog", blogController.DeleteBlog);

router.get("/blog_edit", blogController.BlogEdit);

router.put("/blog_update", blogController.UpdateBlog);


module.exports = router;