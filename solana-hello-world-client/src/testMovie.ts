import * as borsh from "@project-serum/borsh";

export const testMovie = async (
  connection: any,
  web3: any,
  signer: any,
  programId: any
) => {
  const movieInstructionLayout = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.u8("rating"),
    borsh.str("description"),
  ]);

  let buffer = Buffer.alloc(1000);
  const movieTitle = `Hello World! ${Math.random()}`;
  movieInstructionLayout.encode(
    {
      variant: 0,
      title: movieTitle,
      rating: 5,
      description: "A great movie",
    },
    buffer
  );

  buffer = buffer.slice(0, movieInstructionLayout.getSpan(buffer));

  const [pda] = await web3.PublicKey.findProgramAddress(
    [signer.publicKey.toBuffer(), Buffer.from(movieTitle)],
    programId
  );

  console.log("PDA is:", pda.toBase58());

  const transaction = new web3.Transaction();

  const instruction = new web3.TransactionInstruction({
    programId: programId,
    data: buffer,
    keys: [
      {
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
  });

  transaction.add(instruction);
  const tx = await web3.sendAndConfirmTransaction(connection, transaction, [
    signer,
  ]);
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
};
