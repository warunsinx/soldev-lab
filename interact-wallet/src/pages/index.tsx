import PingButton from "@/components/PingButton";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  return (
    <main
      className={`${inter.className} w-full h-screen bg-gray-900 flex flex-col`}
    >
      <div className="w-full flex justify-end h-[45px] items-center">
        <WalletMultiButton />
      </div>
      <div className="flex-1 w-full h-full flex items-center justify-center bg-gray-800">
        <PingButton />
      </div>
    </main>
  );
}
