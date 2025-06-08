const xrpl = require('xrpl');

async function createTestWallet() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const fund_result = await client.fundWallet();
  const { wallet, balance } = fund_result;

  console.log("Wallet Address:", wallet.classicAddress);
  console.log("Secret:", wallet.seed);
  console.log("Balance:", balance);
  await client.disconnect();
}

createTestWallet();
