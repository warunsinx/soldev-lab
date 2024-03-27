import { initializeKeypair } from "./initializeKeypair";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  NftWithToken,
} from "@metaplex-foundation/js";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "finalized");
  const user = await initializeKeypair(connection);
  console.log("PublicKey:", user.publicKey.toBase58());

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  // const collectionNftData = {
  //   name: "TestCollectionNFT",
  //   symbol: "TEST",
  //   description: "Test Description Collection",
  //   sellerFeeBasisPoints: 100,
  //   imageFile: "success.png",
  //   isCollection: true,
  //   collectionAuthority: user,
  // };

  // const collectionUri = await uploadMetadata(metaplex, collectionNftData);

  // const collectionNft = await createCollectionNft(
  //   collectionUri,
  //   collectionNftData
  // );

  // const uri = await uploadMetadata(metaplex, nftData);
  // const nft = await createNft(
  //   metaplex,
  //   uri,
  //   nftData,
  //   collectionNft.mint.address
  // );

  const updatedUri = await uploadMetadata(metaplex, {
    name: "Hello",
    symbol: "World",
    description: "YOYO",
    imageFile: "success.png",
  });

  await updateNftUri(
    metaplex,
    updatedUri,
    new PublicKey("BPEqkBKAajRDJTtnNWM7HiKu6WQcdzXEU4oVFf1FBWaq")
  );

  // async function createCollectionNft(
  //   uriC: string,
  //   data: any
  // ): Promise<NftWithToken> {
  //   const { nft } = await metaplex.nfts().create(
  //     {
  //       uri: uriC,
  //       name: data.name,
  //       sellerFeeBasisPoints: data.sellerFeeBasisPoints,
  //       symbol: data.symbol,
  //       isCollection: true,
  //     },
  //     { commitment: "finalized" }
  //   );

  //   console.log(
  //     `Collection Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  //   );

  //   return nft;
  // }
}

interface NftData {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints?: number;
  imageFile: string;
}

// example data for a new NFT
const nftData = {
  name: "Name",
  symbol: "SYMBOL",
  description: "Description",
  sellerFeeBasisPoints: 0,
  imageFile: "solana.png",
};

// example data for updating an existing NFT
const updateNftData = {
  name: "Update",
  symbol: "UPDATE",
  description: "Update Description",
  sellerFeeBasisPoints: 100,
  imageFile: "success.png",
};

async function uploadMetadata(
  metaplex: Metaplex,
  nftData: NftData
): Promise<string> {
  // file to buffer
  const buffer = fs.readFileSync("src/" + nftData.imageFile);

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, nftData.imageFile);

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    symbol: nftData.symbol,
    description: nftData.description,
    image: imageUri,
    sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
  });

  console.log("metadata uri:", uri);
  return uri;
}

// helper function create NFT
async function createNft(
  metaplex: Metaplex,
  uri: string,
  nftData: NftData,
  collectionMint: PublicKey
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri, // metadata URI
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints || 100,
      symbol: nftData.symbol,
      collection: collectionMint,
    },
    { commitment: "finalized" }
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  await metaplex.nfts().verifyCollection({
    mintAddress: nft.mint.address,
    collectionMintAddress: collectionMint,
    isSizedCollection: true,
  });

  return nft;
}

async function updateNftUri(
  metaplex: Metaplex,
  uri: string,
  mintAddress: PublicKey
) {
  const nft = await metaplex.nfts().findByMint({ mintAddress });

  const { response } = await metaplex.nfts().update(
    {
      nftOrSft: nft,
      uri: uri,
      sellerFeeBasisPoints: 700,
    },
    { commitment: "finalized" }
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  console.log(
    `Transaction: https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
  );
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
