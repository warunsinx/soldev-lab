import { Center } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { AppBar } from "../components/AppBar";
import styles from "../styles/Home.module.css";
import StudentForm from "../components/StudentForm";
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { StudentIntro } from "../models/StudentIntro";

const STUDENT_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

const Student: NextPage = () => {
  const { connection } = useConnection();
  const [intros, setIntros] = useState<StudentIntro[]>([]);

  useEffect(() => {
    connection
      .getProgramAccounts(new web3.PublicKey(STUDENT_PROGRAM_ID))
      .then((accounts) => {
        const intros = accounts.map(({ account }) => {
          return StudentIntro.deserialize(account.data) as StudentIntro;
        });
        setIntros(intros);
      });
  }, []);

  return (
    <div className={styles.App}>
      <Head>
        <title>Movie Reviews</title>
      </Head>
      <AppBar />
      <Center>
        <StudentForm />
        {intros.map((intro, i) => {
          return (
            <div style={{ color: "white" }} key={i}>
              <p>{intro.name}</p>
              <p>{intro.message}</p>
            </div>
          );
        })}
      </Center>
    </div>
  );
};

export default Student;
