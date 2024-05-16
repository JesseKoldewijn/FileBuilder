import "~/styles/globals.css";

import { Inter } from "next/font/google";

import NavBar from "~/components/NavBar";
import { cookies } from "next/headers";
import { appConfig } from "~/config/app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Temp File-Builder",
  description:
    "This application builds files based on a base64 string and responds with a public URL to allow file downloads for a curtain amount of time",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieJar = cookies();
  const themeCookie = cookieJar.get(appConfig.core.cookies.theme);
  const theme = themeCookie && themeCookie.value == "light" ? "light" : "dark";

  return (
    <html lang="en" className={theme}>
      <body className={`font-sans ${inter.variable}`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
