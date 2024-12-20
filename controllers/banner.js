const Banner = require("../model/bannet");

exports.AddBanner = async (req, res) => {  

  try {
    const newBanner = new Banner(req.body);
    await newBanner.save();
    res.send({ message: "Banner Added" });
  } catch (e) {
    // console.log("E:",e);
    res.status(500).send("Internal Server Error");
  }
};

exports.getBanner = async (req, res) => {  


  try {
    const newBanner = await Banner.find().sort({ _id: -1 });
    res.json(newBanner);
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteBanner = async (req, res) => {  

  try {
    await Banner.findByIdAndDelete(req.query.id);
    res.end("Delete ho gya");
  } catch (e) {
    res.send(e);
  }
};

exports.editBanner = async (req, res) => {  

  try {
    const banner = await Banner.findById(req.query.id);
    res.json(banner);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.UpdateBanner = async (req, res) => {  

  try {
    const bannerId = req.body._id;

    const existingBanner = await Banner.findById(bannerId);

    if (!existingBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    existingBanner.title = req.body.title;
    existingBanner.image = req.body.image || existingBanner.image;
    await existingBanner.save();
    res.json({ message: "Banner Updated" });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};