
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

  exports.GetProduct = async (req, res) => {  

    try {
      const { name, sort, minPrice, maxPrice, search, size, color } = req.query;
  
      let query = {};
      let sortQuery = {};
  
      // Filter by category (if category name is provided)
      if (name && name !== "all") {
        query.category = new RegExp(`^${name}$`, 'i');
      }
  
      // Filter by price range
      if (minPrice || maxPrice) {
        query.Fprice = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
      }
  
      // Filter by search term (title or category)
      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') },
        ];
      }
  
      // Filter by size (if size filter is provided)
      if (size) {
        query.sizes = size;
      }
  
      // Filter by color (if color filter is provided)
      if (color) {
        query.colors = color;
      }
  
      // Sort by price
      if (sort) {
        sortQuery = sort === "asc" ? { Fprice: 1 } : { Fprice: -1 };
      }
  
      // Fetch products based on filters and sort order
      const filteredProducts = await Product.find(query)
        .sort({ ...sortQuery, _id: -1 })
        .exec();
  
      res.json(filteredProducts);
  
    } catch (error) {
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
  
        console.log(activeProducts, "here active products");
        
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
      } else if (
        req.body.images &&
        (req.body.images.length < 1 || req.body.images.length > 10)
      ) {
        return res.status(400).json({
          message: "Invalid number of images. Must be between 1 and 10.",
        });
      } else {
        existingProduct.images = req.body.images;
      }
      existingProduct.title = req.body.title;
      existingProduct.sn = req.body.sn;
      existingProduct.category = req.body.category;
      existingProduct.description = req.body.description;
      existingProduct.colors = req.body.colors || existingProduct.colors;
      existingProduct.sizes = req.body.sizes || existingProduct.sizes; 
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
  