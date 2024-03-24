import WalletContextProvider from "@/components/WalletContextProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </div>
  );
}
