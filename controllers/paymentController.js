const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.CreateStripePaymentAndOrder = async (req, res) => {
  const { userId, cartDetails, paymentMethodDetails } = req.body;

  try {
    const amount = cartDetails.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const paymentResponse = await this.ProcessStripePayment(
      amount,
      paymentMethodDetails
    );

    if (!paymentResponse.success) {
      return res.status(400).json({ error: paymentResponse.error });
    }

    const paymentId = paymentResponse.data.id;

    const orderResult = await createOrder(userId, cartDetails, paymentId);

    if (!orderResult.success) {
      return res.status(500).json({ error: orderResult.error });
    }

    res.status(200).json({
      message: "Payment and Order created successfully",
      order: orderResult.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ProcessStripePayment = async (amount, paymentMethodDetails) => {
  console.log(amount);

  // Validate if the amount is a valid number
  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: "Invalid amount provided" };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert amount to cents
      currency: "usd",
    });

    // Create a new Payment record in the database
    const paymentRecord = new Payment({
      amount,
      currency: "usd",
      secrate: paymentIntent.client_secret,
      status: "pending",
    });
    await paymentRecord.save();

    return { success: true, data: paymentIntent };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
