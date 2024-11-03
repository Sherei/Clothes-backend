const Collection = require("../model/collection");
const Product = require('../model/product')

exports.AddCollection = async (req, res) => {  

  try {
    const newCollection = new Collection(req.body);
    await newCollection.save();
    res.send({ message: "Collection Added" });
  } catch (e) {
    console.log("E:",e);
    res.status(500).send("Internal Server Error");
  }
};

exports.getCollection = async (req, res) => {  


  try {
    const newCollection = await Collection.find().sort({ _id: -1 });
    res.json(newCollection);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCollection = async (req, res) => {  

  try {
    await Collection.findByIdAndDelete(req.query.id);
    res.end("Delete ho gya");
  } catch (e) {
    res.send(e);
  }
};

exports.editCollection = async (req, res) => {  

  try {
    const collection = await Collection.findById(req.query.id);
    res.json(collection);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.UpdateCollection = async (req, res) => {  

  try {
    const collectionId = req.body.id;
    const newStatus = req.body.status;
    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedCollection) {
      return res.status(404).send("Collection not found");
    }
    res.json(updatedCollection);
  } catch (e) {
    res.status(500).send("Error updating user status");
  }
};


exports.CollectionUpdate = async (req, res) => {  
  try {
    const collectionId = req.body._id;

    // Find the existing collection
    const existingCollection = await Collection.findById(collectionId);
    if (!existingCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Update the collection details
    existingCollection.category = req.body.category;
    existingCollection.image = req.body.image || existingCollection.image;
    await existingCollection.save();

    // Update the category of all products associated with this collection
    await Product.updateMany(
      { collectionId: collectionId }, // Find products by collectionId
      { $set: { category: req.body.category } } // Set the new category
    );

    res.json({ message: "Collection and associated products updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.getActiveStatus = async (req, res) => {  
    try {
      const newCollection = await Collection.find({ status: "active" });
      res.json(newCollection);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };