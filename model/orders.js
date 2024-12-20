const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: String,
  title: String,
  sn: String,
  category: String,
  image: String,
  subCategory: String,
  price: String,
  total: Number,
  quantity: String,
  discount: Number,
  size: String,
  color: String,
});

const orderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  orderItems: [orderItemSchema],
  total: Number,
  name1: String,
  priceId: String,
  name2: String,
  number1: {
    type: Number,
    trim: true,
  },
  street: String,
  appartment: String,
  country: String,
  city: String,
  currency: String,
  postal: String,
  email: String,
  paymentStatus: String,
  quantity: String,
  currency: String,
  price: String,
  payment: String,
  shipping: Number,
  note: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
