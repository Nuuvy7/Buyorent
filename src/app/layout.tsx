import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buyorrent // Cyber-Campus Marketplace",
  description: "Next-gen pre-loved marketplace & student skill exchange. Built for campus hustlers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cyber-bg text-slate-100 font-sans antialiased selection:bg-accent selection:text-black">
        {children}
      </body>
    </html>
  );
}
