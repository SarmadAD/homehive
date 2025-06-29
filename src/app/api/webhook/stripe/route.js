import Stripe from "stripe";

const stripeSecret = process.env.NODE_ENV === "development" ? process.env.STRIPE_SECRET_TEST_KEY : process.env.STRIPE_SECRET_LIVE_KEY;

const stripe = new Stripe(stripeSecret ?? "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
import { prisma } from "src/app/db/db";

export async function POST(request) {
  const sig = request.headers.get("stripe-signature") ?? "";
  const body = await request.text();

  let event;
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
    case "checkout.session.completed":
      const session = await stripe.checkout.sessions.retrieve(data.object.id, {
        expand: ["line_items"],
      });
      const clientReferenceId = session?.client_reference_id;

      const priceId = session?.line_items?.data[0]?.price.id;
      const customerId = session?.customer;

      if (clientReferenceId) {
        try {
          // Update the landlord in the database
          const landlord = await prisma.landlord.update({
            where: { authenticatedUserId: clientReferenceId },
            data: {
              priceId: priceId,
              hasAccess: true,
              customerId,
            },
          });
        } catch (error) {
          console.error("Error updating landlord:", error);
          throw new Error("Landlord update failed");
        }
      } else {
        console.error("No customer email found");
        throw new Error("No customer email found");
      }

      // Extra: >>>>> send email to dashboard <<<<

      break;
    case "customer.subscription.updated":
      // Handle subscription update
      break;
    case "customer.subscription.deleted": {
      const subscription = data.object;
      const customerId = subscription.customer;

      try {
        if (customerId) {
          // Update the landlord in the database
          await prisma.landlord.update({
            where: { customerId: customerId },
            data: {
              hasAccess: false,
            },
          });
        } else {
          console.error("No customer email found");
          throw new Error("No customer email found");
        }
      } catch (error) {
        console.error("Error revoking landlord access:", error);
        throw new Error("Landlord access revocation failed");
      }

      break;
    }
    default:
      console.warn(`Unhandled event type ${eventType}`);
  }

  return new Response("Webhook received", { status: 200 });
}
