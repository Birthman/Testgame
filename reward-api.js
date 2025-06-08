const express = require("express");
const xrpl = require("xrpl");
require("dotenv").config();

const app = express();
app.use(express.json());

const client = new xrpl.Client(process.env.XRPL_NETWORK);
client.connect();

const rewardWallet = xrpl.Wallet.fromSeed(process.env.REWARD_WALLET_SEED);

app.post("/reward", async (req, res) => {
  const { destination, amount } = req.body;

  try {
    const payment = {
      TransactionType: "Payment",
      Account: rewardWallet.classicAddress,
      Destination: destination,
      Amount: {
        currency: process.env.CURRENCY_CODE,
        issuer: process.env.ISSUER_ADDRESS,
        value: amount.toString()
      }
    };

    const prepared = await client.autofill(payment);
    const signed = rewardWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return res.json({ success: true, tx: result.result.hash });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Reward API listening on http://localhost:3000"));
