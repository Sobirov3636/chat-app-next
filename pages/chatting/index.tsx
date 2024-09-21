import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { serverApi } from "../../libs/config";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default function ChatApp() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [messages, setMessages] = useState<{ userMessage: string; botResponse: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (language: string) => {
    router.push(router.pathname, router.asPath, { locale: language });
  };

  const getKeyHandler = (e: any) => {
    try {
      if (e.key == "Enter") {
        sendMessage();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This will trigger when messages change

  const sendMessage = async () => {
    if (input.trim()) {
      // Send the user's message via POST
      await axios.post(`${serverApi}/message`, { message: input });

      // Get the response from GET
      const response = await axios.get(`${serverApi}/message`);
      const modifiedMessage = response.data.message;

      // Update state to reflect both user message and bot response
      setMessages([...messages, { userMessage: input, botResponse: modifiedMessage }]);
      setInput("");
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <header className='bg-white shadow-md p-4'>
        <div className='w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto flex justify-between items-center'>
          <h1 className='text-xl font-bold'>{t("Coding Test")}</h1>
          <div>
            <button
              className='mr-2 px-3 py-1 bg-blue-500 text-white rounded'
              onClick={() => handleLanguageChange("kr")}
            >
              한국어
            </button>
            <button className='px-3 py-1 bg-blue-500 text-white rounded' onClick={() => handleLanguageChange("en")}>
              English
            </button>
          </div>
        </div>
      </header>

      <div className='flex-grow flex items-center justify-center p-4'>
        <div className='w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[600px] bg-white rounded-lg shadow-lg flex flex-col'>
          <div className='flex-1 overflow-y-auto p-4'>
            {messages.map((message, index) => (
              <div key={index}>
                <div className='chat chat-end'>
                  <div className='chat-bubble chat-bubble-primary'>{message.userMessage}</div>
                </div>
                <div className='chat chat-start'>
                  <div className='chat-bubble'>{message.botResponse}</div>
                </div>
              </div>
            ))}
            <div ref={lastMessageRef} />
          </div>
          <div className='bg-gray-50 p-4 rounded-b-lg'>
            <div className='join w-full'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("Enter your message...")}
                className='input input-bordered join-item flex-grow'
                onKeyDown={getKeyHandler}
              />
              <button onClick={sendMessage} className='btn btn-primary join-item'>
                {t("Send")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
