const Cart = require("../model/cart");

exports.AddToCart = async (req, res) => {  

    try {
      let ob = { ...req.body };
      delete ob._id;
      const newCart = await Cart.create(ob);
      const allItems = await Cart.find();
      res.send({ message: "Product Added", alldata: allItems });
    } catch (e) {}
  };
  
  exports.getAddToCart = async (req, res) => {  

    try {
      const newCart = await Cart.find().sort({ _id: -1 });
      res.json(newCart);
    } catch (e) {}
  };
  

  exports.UpdateCart = async (req, res) => {  

    try {
      const updatedCartData = req.body;
      for (const item of updatedCartData) {
        await Cart.updateOne(
          { _id: item._id },
          {
            quantity: item.quantity,
            total: item.total,
          }
        );
      }
      let allItems = await Cart.find();
      res.send({ status: "success", alldata: allItems });
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  };
  exports.CheckDelCArt = async (req, res) => {  

    try {
      await Cart.findByIdAndDelete(req.query.id);
      let allItems = await Cart.find({ userId: req.query.userId });
      res.send({
        status: "success",
        alldata: allItems,
        message: "Item deleted successfully",
      });
    } catch (e) {
      res.send(e);
    }
  };
  
  exports.DeleteCart = async (req, res) => {  

    try {
      await Cart.findByIdAndDelete(req.query.id);
      let allItems = await Cart.find();
      res.send({
        status: "success",
        alldata: allItems,
        message: "Item deleted successfully",
      });
    } catch (e) {
      res.send(e);
    }
  };
  