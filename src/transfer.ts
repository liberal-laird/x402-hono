import { ethers } from "ethers";

// Base 主网 RPC（也可换成 Alchemy、Infura 或 Coinbase CDP 的节点）
const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

// 钱包私钥（⚠️请使用安全方式管理，不要写死在代码中）
const privateKey = process.env.PRIVATE_KEY!;
const wallet = new ethers.Wallet(privateKey, provider);

// ERC20 标准 ABI（只需 transfer 方法）
const erc20Abi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() public view returns (uint8)",
];

// 代币合约地址（例如 USDC）
const tokenAddress = "0xc09d89d4c04d1e2a6be726aecbac764c2de78649"; // Base NTAI

// 目标账户
const to = "0x07E19d2f85EA2aE6C9040c39243696a3d69cADe8";

// 转账逻辑
async function transferERC20() {
  const token = new ethers.Contract(tokenAddress, erc20Abi, wallet);

  const decimals = await token.decimals();
  const amount = ethers.parseUnits("1.5", decimals); // 转 1.5 个代币

  const tx = await token.transfer(to, amount);
  console.log("⏳ 等待确认中...", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ 成功发送:", receipt.hash);
}

transferERC20().catch(console.error);