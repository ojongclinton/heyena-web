import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heyana Objects",
  description: "Manage objects with title, description, and image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
