import type { Metadata } from "next";
// import { Source_Sans_3 } from "next/font/google";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

// const sourceSansPro = Source_Sans_3({
//   subsets: ["latin"],
//   weight: ["300", "400", "600", "700"],
//   variable: "--font-source-sans-pro",
// });

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TMTT",
  description: "Time management team titans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.className} font-sans  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
