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
      "GET /api/v1/mint": {
        // USDC amount in dollars
        price: "$0.001",
        network: "base",
      }
    },
    // Pass the mainnet facilitator to the payment middleware
        {
      url: facilitatorUrl,
    },
  ),
);

app.get("/api/v1/mint", (req, res) => {
  
  // 上面字段取决于中间件实际插入了什么
    res.json({
    success: true,
    message: "wait some time will send to your address ERC20 coin",
    
  });
});

// x402scan Validation Schema Definition 端点
app.get("/schema", (req, res) => {
  const x402Response = {
    x402Version: 1,
    accepts: [
      {
        scheme: "exact",
        network: "base",
        maxAmountRequired: "0.001",
        resource: "/api/v1/mint",
        description: "Mint NTAI ERC20 tokens to your address",
        mimeType: "application/json",
        payTo: payToAddress,
        maxTimeoutSeconds: 300,
        asset: "USDC",
        outputSchema: {
          input: {
            type: "http",
            method: "GET",
            queryParams: {
              amount: {
                type: "string",
                required: false,
                description: "Amount of NTAI tokens to mint (default: 1000)"
              }
            }
          },
          output: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "mint NTAI ERC20 coin operation was successful"
              },
              message: {
                type: "string",
                description: "Response message"
              },
              transactionHash: {
                type: "string",
                description: "Transaction hash of the mint operation"
              }
            }
          }
        },
        extra: {
          category: "defi",
          tags: ["mint", "erc20", "tokens"],
          version: "1.0.0"
        }
      }
    ]
  };

  res.json(x402Response);
});

// 根路径重定向到 schema
app.get("/", (req, res) => {
  res.redirect("/schema");
});



app.listen(4021, () => {
  console.log(`Server listening at http://localhost:4021`);
  console.log(`📋 Schema URL: http://localhost:4021/schema`);
  console.log(`🔗 提交到 x402scan: https://www.x402scan.com/resources/register`);
  console.log(`   - 在 x402scan 注册页面输入: http://localhost:4021/schema`);
  console.log(`   - 或者使用根路径: http://localhost:4021/ (会自动重定向)`);
});