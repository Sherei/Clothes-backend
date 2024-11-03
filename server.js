const myExpress = require("express");
const app = myExpress();
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();
app.use(myExpress.json());
app.use(cors());
// app.use(myExpress.json());

require("./model/db");

const bcrypt = require("bcrypt");

const SignupUsers = require("./model/user");
const paymentModal = require("./model/orders");
const Product = require("./model/product");

const Comment = require("./model/comment");
const Payment = require("./model/payment"); // Import the Payment model

const Collection = require("./model/collection");

const Orders = require("./model/orders");

const Blog = require("./model/blog");

const Cart = require("./model/cart");

const token = require("jsonwebtoken");
const { appendFile } = require("fs/promises");
const { error } = require("console");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// define routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const commentRoutes = require("./routes/comment");
const videoRoutes = require("./routes/video");
const blogRoutes = require("./routes/blog");
const collectionRoutes = require("./routes/collection");
const paymentRoute = require("./routes/paymentRoute");

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });


    const last4 =
      paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4 ||
      null;


    const payment = new Payment({
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      secrate: paymentIntent.client_secret,
      last4,
      status: paymentIntent.status,
    });
    await payment.save();


    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

app.post("/api/save-payment-status", async (req, res) => {
  const { paymentId, status } = req.body;

  try {

    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId: paymentId },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ message: "Payment status updated successfully", payment });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

// Admin Data

app.get("/dashboard", async function (req, res) {
  try {
    const Users = await SignupUsers.find();
    const Products = await Product.find();
    const comments = await Comment.find();
    const allOrder = await Orders.find();
    const allBlog = await Blog.find();
    const allCollection = await Collection.find();
    res.json({ Users, Products, comments, allOrder, allBlog, allCollection });
  } catch (e) {
    res.send(e);
  }
});

app.get("/AdminUsers", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      };
    }
    const newUser = await SignupUsers.find(query).sort({ _id: -1 });
    res.json(newUser);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/Admincomments", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { comment: { $regex: searchRegex } },
        ],
      };
    }

    const comments = await Comment.find(query).sort({ _id: -1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/Adminproduct", async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      if (!isNaN(search)) {
        query = {
          $or: [
            { sn: Number(search) },
            { title: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
            { subCategory: { $regex: searchRegex } },
          ],
        };
      } else {
        query = {
          $or: [
            { title: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
            { subCategory: { $regex: searchRegex } },
          ],
        };
      }
    }
    const products = await Product.find(query).sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/", (req, res) => {
  res.send("Server is running on port 3010");
});
app.get("/AdminBlog", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { author: { $regex: searchRegex } },
          { description1: { $regex: searchRegex } },
          { description2: { $regex: searchRegex } },
          { description3: { $regex: searchRegex } },
          { description4: { $regex: searchRegex } },
          { description5: { $regex: searchRegex } },
          { description6: { $regex: searchRegex } },
        ],
      };
    }
    const newBlog = await Blog.find(query).sort({ _id: -1 });
    res.json(newBlog);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/", userRoutes);

app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);
app.use("/", commentRoutes);
app.use("/", videoRoutes);
app.use("/", blogRoutes);
app.use("/", collectionRoutes);
app.use("/", paymentRoute);
// app.use() // Remove or comment out this line

const port = process.env.PORT || 3010;

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
