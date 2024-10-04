const Cart = require("../model/cart");
const Orders = require("../model/orders");

exports.Checkout = async (req, res) => {  

    try {
      const newCart = await Cart.find({ userId: req.query.userId }).sort({
        _id: -1,
      });
      res.json(newCart);
    } catch (e) {}
  };

  exports.AddOrder = async (req, res) => {  

    try {
      const orderItems = JSON.parse(req.body.orderItems);
      const newOrder = new Orders({
        userId: req.body.userId,
        orderId: req.body.orderId,
        orderItems: orderItems,
        total: req.body.total,
        name1: req.body.name1,
        name2: req.body.name2,
        number1: req.body.number1,
        street: req.body.street,
        appartment: req.body.appartment,
        country: req.body.country,
        city: req.body.city,
        postal: req.body.postal,
        email: req.body.email,
        shipping: req.body.shipping,
        note: req.body.note,
      });
  
      await newOrder.save();
      res.send("Order is Placed");
      await Cart.deleteMany({ userId: req.body.userId });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error placing the order");
    }
  };
  
  exports.getOrder = async (req, res) => {  

    try {
      const newOrder = await Orders.find().sort({ _id: -1 });
      res.json(newOrder);
    } catch (e) {
      res.status(500).send("Error fetching orders");
    }
  };
  
  exports.OrderDetail = async (req, res) => {  

    try {
      const singleOrder = await Orders.findById(req.query.id);
      res.json(singleOrder);
    } catch (e) {
      res.end(e);
    }
  };
  

  exports.UpdateStatus = async (req, res) => {  

    try {
      const orderId = req.body.id;
      const newStatus = req.body.status;
      const updatedOrder = await Orders.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).send("Order not found");
      }
      res.json(updatedOrder);
    } catch (e) {
      res.status(500).send("Error updating order status");
    }
  };
  
  exports.DeleteOrder = async (req, res) => {  

    try {
      await Orders.findByIdAndDelete(req.query.id);
      res.end("Delete ho gya");
    } catch (e) {
      res.send(e);
    }
  };
