import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default appWithTranslation(App);
