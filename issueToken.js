const xrpl = require('xrpl');

async function issueToken() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const issuerWallet = xrpl.Wallet.fromSeed("ss...yourWalletSecretHere");

  const trustSetTx = {
    TransactionType: "TrustSet",
    Account: issuerWallet.classicAddress,
    LimitAmount: {
      currency: "GTX",
      issuer: issuerWallet.classicAddress,
      value: "1000000"
    }
  };

  const preparedTx = await client.autofill(trustSetTx);
  const signedTx = issuerWallet.sign(preparedTx);
  await client.submitAndWait(signedTx.tx_blob);

  console.log("Token GTX issued by:", issuerWallet.classicAddress);
  await client.disconnect();
}

issueToken();
