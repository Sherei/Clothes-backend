import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.ProcessStripePayment = async (amount, paymentMethodDetails) => {
  console.log(amount, "dsjfisdj");
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe accepts amounts in cents
      currency: "usd",
      payment_method: paymentMethodDetails.id,
      confirm: true, // Immediately confirm the payment
    });

    return { success: true, data: paymentIntent };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
