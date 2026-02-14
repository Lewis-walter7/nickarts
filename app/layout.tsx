import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nickarts.com"),
  title: {
    default: "NickArts | Premium Art Studio",
    template: "%s | NickArts Studio"
  },
  description: "Elite contemporary artistic vision. Transcend boundaries with museum-grade physical masterpieces and digital rarities in Nairobi, Kenya.",
  keywords: ["contemporary art", "Nairobi art studio", "abstract paintings", "digital art", "NickArts", "fine art Kenya"],
  authors: [{ name: "Wayne Otanga" }],
  creator: "Wayne Otanga",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nickarts.com",
    siteName: "NickArts",
    title: "NickArts | Premium Art Studio",
    description: "Transcending the boundaries of physical and digital expression. Based in Nairobi, Kenya.",
    images: [
      {
        url: "/hero-art.png",
        width: 1200,
        height: 630,
        alt: "NickArts Contemporary Masterpiece",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NickArts | Premium Art Studio",
    description: "Transcending the boundaries of physical and digital expression.",
    images: ["/hero-art.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
