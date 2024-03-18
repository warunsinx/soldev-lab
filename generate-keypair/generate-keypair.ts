import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// const keypair = Keypair.generate();
// console.log(keypair.publicKey.toBase58());
// console.log(bs58.encode(keypair.secretKey));

//tDN8dHGLWsc5ZK1ybsQfSNaFXfHsE5MzwmUVARykxbv
const restoreKeypair = Keypair.fromSecretKey(
  bs58.decode(
    "4dZGv3HgYgNrizJ9CypMVVLCisc5pLWD2WLSbveA136qRUgFd6dBdzVMsjZUXMdqBU4nmSA4gkyo6p4e4z8ufkDA"
  )
);

console.log(restoreKeypair.publicKey.toBase58());
console.log(bs58.encode(bs58.decode(restoreKeypair.publicKey.toBase58())));
