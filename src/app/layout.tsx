import "~/styles/globals.css";

import { Inter } from "next/font/google";

import NavBar from "~/components/layout/NavBar";
import { cookies } from "next/headers";
import { appConfig } from "~/config/app";
import PageMeta from "~/components/layout/PageMeta";
import { type Viewport, type Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const APP_NAME = "File-Builder";
const APP_DEFAULT_TITLE = "File-Builder";
const APP_TITLE_TEMPLATE = "%s | File-Builder";
const APP_DESCRIPTION =
  "This application builds files based on a base64 string and responds with a public URL to allow file downloads for a curtain amount of time";

export const viewport: Viewport = {
  themeColor: "#fff",
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
      <head>
        <PageMeta />
      </head>
      <body className={`font-sans ${inter.variable}`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};
