import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ChatApp from "./chatting";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  return <ChatApp />;
};

export default Home;
