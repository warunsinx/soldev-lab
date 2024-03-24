import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { resolve } from "@bonfida/spl-name-service";

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`✅ Connected to devnet !`);

const parseAccount = (address: string) => {
  try {
    return new PublicKey(address);
  } catch (e) {
    throw new Error(`Invalid public key: ${address}`);
  }
};

const checkBalance = async (account: PublicKey) => {
  const address = parseAccount(account.toBase58());
  console.log(`✅ Checking balance of ${address.toBase58()}...`);
  const balance = await connection.getBalance(address);
  console.log(`✅ Balance in Lamports: ${balance}`);
  const lamportsPerSol = 1000000000;
  const balanceInSol = balance / lamportsPerSol;
  console.log(`✅ Balance in SOL: ${balanceInSol}`);
};

const account = new PublicKey("4JQRjjw6YitVneNaLqsx8H1GGerTCtEWVNJfe4u4aPj3");
checkBalance(account);

// const connectionMainnet = new Connection(clusterApiUrl("mainnet-beta"));
// console.log(`✅ Connected to Mainnet-Beta !`);

// const name = "mccann";
// resolve(connectionMainnet, name).then((address) => {
//   checkBalance(address);
// });
