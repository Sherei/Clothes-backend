const Collection = require("../model/collection");


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

    const existingCollection = await Collection.findById(collectionId);

    if (!existingCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    existingCollection.title = req.body.title;
    existingCollection.image = req.body.image || existingBlog.image;
    await existingBlog.save();
    res.json({ message: "Collection Updated" });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getActiveStatus = async (req, res) => {  

    // console.log("running")
    try {
      const newCollection = await Collection.find({ status: "active" });
      res.json(newCollection);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };