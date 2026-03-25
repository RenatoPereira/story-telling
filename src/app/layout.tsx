import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReaderThemeSync } from "@/components/theme/ReaderThemeSync";
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
  title: "Leitor animado - O Nome do Vento",
  description: "Experiencia de leitura animada com texto, imagem e narracao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReaderThemeSync />
        {children}
      </body>
    </html>
  );
}
