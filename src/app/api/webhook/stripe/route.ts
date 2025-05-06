import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature") ?? "";
  const body = await request.text();

  let event: Stripe.Event;
  let data;
  let eventType;

  try {
    if (!webhookSecret) throw new Error("Webhook secret not set");
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error(`Error verifying webhook signature: ${err}`);
    return new Response("Webhook Error", { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  // Handle the event
  switch (eventType) {
    case "checkout.session.completed": // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
      // ✅ Grant access to the product
      let user;
      const session = await stripe.checkout.sessions.retrieve(data.object.id, {
        expand: ["line_items"],
      });
      const customerId = session?.customer;
      const customer = await stripe.customers.retrieve(customerId);
      const priceId = session?.line_items?.data[0]?.price.id;

      if (customer.email) {
        user = await User.findOne({ email: customer.email });

        if (!user) {
          user = await User.create({
            email: customer.email,
            name: customer.name,
            customerId,
          });

          await user.save();
        }
      } else {
        console.error("No user found");
        throw new Error("No user found");
      }

      // Update user data + Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
      user.priceId = priceId;
      user.hasAccess = true;
      await user.save();

      // Extra: >>>>> send email to dashboard <<<<

      break;
    case "customer.subscription.updated":
      // Handle subscription update
      break;
    case "customer.subscription.deleted":
      // Handle subscription cancellation
      break;
    default:
      console.warn(`Unhandled event type ${eventType}`);
  }

  return new Response("Webhook received", { status: 200 });
}
