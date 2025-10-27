import { config } from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { paymentMiddleware, Network, Resource } from "x402-hono";
import { facilitator } from "@coinbase/x402";
config();


const payTo = process.env.ADDRESS as `0x${string}`;
const network = process.env.NETWORK as Network;

if ( !payTo || !network) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = new Hono();

console.log("Server is running");
console.log("Configuration:");
console.log("- Network:", network);
console.log("- PayTo:", payTo);

app.use(
  paymentMiddleware(
    payTo,
    {
      "/weather": {
        price: "$0.001",
        network,
      },
    },
    facilitator
  ),
);

app.get("/weather", c => {
  return c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

app.get("/", c => {
  return c.json({
    message: "Hello World",
  });
});

serve({
  fetch: app.fetch,
  port: 4021,
});