import React from "react";
import { StudentIntro } from "../models/StudentIntro";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const STUDENT_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

export default function StudentForm() {
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const studentIntro = new StudentIntro(name, message);
    handleSubmitTransaction(studentIntro);
  };

  const handleSubmitTransaction = async (studentIntro: StudentIntro) => {
    console.log(studentIntro);
    if (!publicKey) {
      alert("Wallet not connected");
      return;
    }

    const transaction = new web3.Transaction();
    const buffer = studentIntro.serialize();

    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer()],
      new web3.PublicKey(STUDENT_PROGRAM_ID)
    );

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
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
      data: buffer,
      programId: new web3.PublicKey(STUDENT_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      const txId = await sendTransaction(transaction, connection);
      console.log(txId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
