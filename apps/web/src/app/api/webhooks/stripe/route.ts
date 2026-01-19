import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient, createPass, PassType, completeTransaction, cancelTransaction } from "@kaitif/db";
import { getStripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Handle Pass Purchase
      const userId = session.metadata?.userId;
      const passType = session.metadata?.passType as PassType;

      if (userId && passType) {
        console.log(`Creating ${passType} pass for user ${userId}`);
        
        try {
          const pass = await createPass(
            supabase as any, 
            userId, 
            passType, 
            session.payment_intent as string
          );
          
          if (!pass) {
            console.error("Failed to create pass in database");
          } else {
            console.log("Pass created successfully:", pass.id);
          }
        } catch (e) {
          console.error("Error creating pass:", e);
        }
      }

      // Handle Marketplace Transaction
      const transactionId = session.metadata?.transactionId;
      if (transactionId) {
        console.log(`Completing transaction ${transactionId}`);
        try {
           const transaction = await completeTransaction(supabase as any, transactionId);
           if (!transaction) console.error("Failed to complete transaction in DB");
           else console.log("Transaction completed:", transaction.id);
        } catch (e) {
           console.error("Error completing transaction:", e);
        }
      }
      break;
    }

    case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const transactionId = session.metadata?.transactionId;
        if (transactionId) {
            console.log(`Cancelling transaction ${transactionId} due to session expiration`);
            try {
                await cancelTransaction(supabase as any, transactionId);
            } catch (e) {
                console.error("Error cancelling transaction:", e);
            }
        }
        break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment failed:", paymentIntent.id);
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription created:", subscription.id);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription updated:", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription cancelled:", subscription.id);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Invoice paid:", invoice.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Invoice payment failed:", invoice.id);
      break;
    }

    // Marketplace events (Stripe Connect)
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      console.log("Connected account updated:", account.id);
      break;
    }

    case "transfer.created": {
      const transfer = event.data.object as Stripe.Transfer;
      console.log("Transfer created:", transfer.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
