import { Outfit } from 'next/font/google';
import localFont from "next/font/local";

import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthContext from '@/context/AuthContext';

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from 'react';

const outfit = Outfit({
  subsets: ["latin"],
});

const nanumGothic = localFont({
  src: "../../public/fonts/NanumGothic.ttf",
  display: "swap",
  variable: "--font-suit",
});

const nanumGothicBold = localFont({
  src: "../../public/fonts/NanumGothicBold.ttf",
  display: "swap",
  variable: "--font-suit",
});

const nanumGothicExtraBold = localFont({
  src: "../../public/fonts/NanumGothicExtraBold.ttf",
  display: "swap",
  variable: "--font-suit",
});

const nanumGothicLight = localFont({
  src: "../../public/fonts/NanumGothicLight.ttf",
  display: "swap",
  variable: "--font-suit",
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="kr">
      
        <body className={`${nanumGothic.className} dark:bg-gray-900` }>
          {/* <AuthContext> */}
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          {/* </AuthContext> */}
        </body>
    </html>
  );
}
