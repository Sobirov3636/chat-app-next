/** @type {import('next-i18next').NextI18NextConfig} */
const i18n = {
  defaultLocale: "en",
  locales: ["en", "kr"],
  localeDetection: false,
  react: { useSuspense: false },
};

module.exports = { i18n };
