const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product");


router.post("/product", ProductController.AddProduct);

router.get("/products", ProductController.GetProduct);

router.get("/product", ProductController.Product);

router.get("/Product/byCategory/:category", ProductController.ProductByCategory);

router.get("/collect/products/active", ProductController.CollectActiveProducts);

router.get("/activeproduct", ProductController.ActiveProducts);

router.get("/singleProduct", ProductController.GetSingleProduct);

router.delete("/deleteProduct", ProductController.DeleteProduct);

router.get("/product_edit", ProductController.EditProduct);

router.put("/product-update", ProductController.UpdateProduct);



module.exports = router;