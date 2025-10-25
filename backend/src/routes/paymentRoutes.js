import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// PayPal: get client id for frontend
router.get("/config/paypal", (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || "" });
});

// Stripe: publishable key
router.get("/config/stripe", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "" });
});

// PayPal: create order on PayPal
router.post("/payments/paypal/create-order", async (req, res) => {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: req.body.total.toFixed(2),
            },
          },
        ],
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PayPal: capture order
router.post("/payments/paypal/capture/:orderId", async (req, res) => {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(
      `${getPayPalBaseUrl()}/v2/checkout/orders/${req.params.orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COD: simple confirmation
router.post("/payments/cod", (req, res) => {
  res.json({ status: "cod_confirmed" });
});

// Stripe (Visa/GPay)
router.post("/payments/stripe/create-payment-intent", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(501).json({ message: "Stripe not configured (missing STRIPE_SECRET_KEY)" });
    }
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(req.body.total) * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Easypaisa (stub)
router.post("/payments/easypaisa/create-charge", async (req, res) => {
  if (!process.env.EASYPAISA_MERCHANT_ID || !process.env.EASYPAISA_STORE_SECRET) {
    return res.status(501).json({ message: "Easypaisa not configured (set EASYPAISA_MERCHANT_ID and EASYPAISA_STORE_SECRET)" });
  }
  res.json({ status: "created", reference: `EP-${Date.now()}` });
});

// Bitcoin via Coinbase Commerce
router.post("/payments/bitcoin/create-invoice", async (req, res) => {
  try {
    if (!process.env.COINBASE_COMMERCE_API_KEY) {
      return res.status(501).json({ message: "Coinbase Commerce not configured (missing COINBASE_COMMERCE_API_KEY)" });
    }
    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: "Order Payment",
        pricing_type: "fixed_price",
        local_price: { amount: Number(req.body.total).toFixed(2), currency: "USD" },
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bank Transfer
router.post("/payments/bank/initiate", async (req, res) => {
  res.status(200).json({
    status: "pending_manual_transfer",
    instructions: {
      bankName: process.env.BANK_NAME || "Your Bank",
      accountName: process.env.BANK_ACCOUNT_NAME || "Your Company",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || "0000000000",
      iban: process.env.BANK_IBAN || "",
    },
  });
});

function getPayPalBaseUrl() {
  const isLive = process.env.NODE_ENV === "production";
  return isLive ? "https://api.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Unable to get PayPal access token");
  }
  return data.access_token;
}

export default router;


