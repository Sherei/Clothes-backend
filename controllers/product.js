
const Product = require("../model/product");
const Collection = require("../model/collection");


exports.AddProduct = async (req, res) => {  

    try {
      const existingProduct = await Product.findOne({ sn: req.body.sn });
      if (existingProduct) {
        return res.status(400).send("Try with a different Serial Number");
      }
      const newProduct = new Product(req.body);
  
      await newProduct.save();
  
      res.send({ message: "Product Added" });
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  };

  // exports.GetProduct = async (req, res) => {
  //   try {
  //     const { name, sort, minPrice, maxPrice, search, size, color } = req.query;
  
  //     let query = {};
  //     let sortQuery = {};
  
  //     if (name && name !== "all") {
  //       query.category = new RegExp(`^${name}$`, 'i');
  //     }
  
  //     if (minPrice || maxPrice) {
  //       query.Fprice = { 
  //         $gte: Number(minPrice) || 0, 
  //         $lte: Number(maxPrice) || Infinity 
  //       };
  //     }
  
  //     if (search) {
  //       query.$or = [
  //         { title: new RegExp(search, 'i') },
  //         { category: new RegExp(search, 'i') },
  //       ];
  //     }
  
  //     if (size) {
  //       query.sizes = { $in: [size] };
  //     }
  
  //     if (color) {
  //       query.colors = { $in: [color] };
  //     }
  
  //     if (sort) {
  //       sortQuery = sort === "asc" ? { Fprice: 1 } : { Fprice: -1 };
  //     }
  
  //     const filteredProducts = await Product.find(query)
  //       .sort({ ...sortQuery, _id: -1 })
  //       .exec();
  
  //     console.log("products sent at front end = ", filteredProducts);
  //     res.json(filteredProducts);
  
  //   } catch (error) {
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // };
  
  // controllers/productController.js

  exports.GetProduct = async (req, res) => {
    try {
      const { category, minPrice, maxPrice, size, color, search } = req.query;
  
      const query = {};
  
      if (category && category !== "all") {
        query.category = category;
      }
  
      if (minPrice && maxPrice) {
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
      }
  
      // Update size filtering to search across multiple fields
      if (size) {
        query.$or = [
          { size1: size },
          { size2: size },
          { size3: size },
          { size4: size },
          { size5: size },
        ];
      }
  
      if (color) {
        query.$or = query.$or || [];
        query.$or.push(
          { color1: color },
          { color2: color },
          { color3: color },
          { color4: color },
          { color5: color }
        );
      }
  
      if (search) {
        query.title = { $regex: search, $options: "i" };
      }
  
      const products = await Product.find(query).sort({ _id: -1 });
      res.json(products);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  exports.Product = async (req, res) => {  

    try {
      const newProduct = await Product.find().sort({ _id: -1 });
      res.json(newProduct);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  exports.ProductByCategory = async (req, res) => {  
  
    try {
      const newCollection = await Product.find({ category: req.params.category });
      res.json(newCollection);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  

    exports.CollectActiveProducts = async (req, res) => {  

    try {
        // Step 1: Get the active collections
        const newCollection = await Collection.find({ status: "active" });
  
        // Step 2: Extract categories from the newCollection
        const categories = newCollection.map(item => item.category).flat();
  
        // Step 3: Find products that match the extracted categories
        const activeProducts = await Product.find({
            category: { $in: categories }
        });
  
        // console.log(activeProducts, "here active products");
        
        // Step 4: Send the active products as response
        res.json(activeProducts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  exports.ActiveProducts = async (req, res) => {  

    try {
      const newProduct = await Product.find({})
        .sort({ _id: -1 })
        .populate({
          path: "category",
          match: { status: "active" }, // This filters the populated categories by status
        });
  
      // Filter out products that have a null category due to the match condition
      const filteredProducts = newProduct.filter(
        (product) => product.category !== null
      );
  
      res.json(filteredProducts);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  exports.GetSingleProduct = async (req, res) => {  

  // app.get("/singleProduct", async (req, res) => {
    try {
      const singleProduct = await Product.findById(req.query.id);
      res.json(singleProduct);
    } catch (e) {
      res.end(e);
    }
  };
  
  exports.DeleteProduct = async (req, res) => {  
    try {
      await Product.findByIdAndDelete(req.query.id);
  
      fs.rmSync("./server/pics/", { recursive: true, force: true });
  
      res.end("Delete ho gya");
    } catch (e) {
      res.send(e);
    }
  };
  
  // Find Update Product
  exports.EditProduct = async (req, res) => {  
    try {
      let product = await Product.findById(req.query.id);
      res.json(product);
    } catch (e) {
      res.status(500).json(e);
    }
  };
  
  // Up date Product
  exports.UpdateProduct = async (req, res) => {  

    try {
      const productId = req.body._id;
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }else {
        existingProduct.images = req.body.images;
      }
      existingProduct.title = req.body.title;
      existingProduct.sn = req.body.sn;
      existingProduct.category = req.body.category;
      existingProduct.collectionId = req.body.collectionId;
      existingProduct.description = req.body.description;
      existingProduct.color1 = req.body.color1 || existingProduct.color1;
      existingProduct.color2 = req.body.color2 || existingProduct.color2;
      existingProduct.color3 = req.body.color3 || existingProduct.color3;
      existingProduct.color4 = req.body.color4 || existingProduct.color4;
      existingProduct.color5 = req.body.color5 || existingProduct.color5;
      existingProduct.size1 = req.body.size1 || existingProduct.size1; 
      existingProduct.size2 = req.body.size2 || existingProduct.size2; 
      existingProduct.size3 = req.body.size3 || existingProduct.size3; 
      existingProduct.size4 = req.body.size4 || existingProduct.size4; 
      existingProduct.size5 = req.body.size5 || existingProduct.size5; 
      existingProduct.status = req.body.status;
      existingProduct.price = req.body.price || existingProduct.price;
      existingProduct.discount = req.body.discount;
      existingProduct.Fprice = req.body.Fprice || existingProduct.Fprice;
  
      await existingProduct.save();
  
      res.json({ message: "Product Updated" });
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  