import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../src/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qivee - Your One-Stop Online Shopping Destination",
  description:
    "Discover the best deals on electronics, fashion and more. Qivee offers high-quality products at unbeatable prices with fast delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="dark ">
      <body
        className={`${inter.className} text-primary-foreground custom-scrollbar`}
      >
        <div className="fixed inset-0 -z-50" />
        <Header />
        <div className="mt-16 container">{children}</div>
      </body>
    </html>
  );
}
