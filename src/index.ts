import { config } from "dotenv";
import express from "express";
import { paymentMiddleware,Resource } from "x402-express";
// Import the facilitator from the x402 package to use the mainnet facilitator
import { facilitator } from "@coinbase/x402";

config();


const facilitatorUrl = process.env.FACILITATOR_URL as Resource;
const payToAddress = process.env.ADDRESS as `0x${string}`;

// The CDP API key ID and secret are required to use the mainnet facilitator
if (!payToAddress || !process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

app.use(
  paymentMiddleware(
    payToAddress,
    {
      "GET /weather": {
        // USDC amount in dollars
        price: "$0.001",
        network: "base",
      },
    },
    // Pass the mainnet facilitator to the payment middleware
        {
      url: facilitatorUrl,
    },
  ),
);

app.get("/weather", (req, res) => {
  
  // 上面字段取决于中间件实际插入了什么
    res.json({
    success: true,
    buyerWallet:   "unknown",
    
  });
});

app.post("/x402/webhook", (req, res) => {
  const buyer = req.body.data?.buyer_wallet_address;
  console.log("👛 Buyer wallet:", buyer);
  res.json({ ok: true });
});



app.listen(4021, () => {
  console.log(`Server listening at http://localhost:4021`);
});