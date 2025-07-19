const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class PaymentService {
  async createPaymentIntent({ amount, currency, metadata }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return paymentIntent
    } catch (error) {
      console.error("Stripe payment intent creation error:", error)
      throw new Error("Failed to create payment intent")
    }
  }

  constructWebhookEvent(body, signature) {
    try {
      return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      throw new Error("Invalid webhook signature")
    }
  }

  async getPaymentStatus(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error("Error retrieving payment status:", error)
      throw new Error("Failed to retrieve payment status")
    }
  }
}

module.exports = new PaymentService()
