import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Saudi Wood Factory | Premium Architectural Doors",
  description: "Premium wooden doors crafted with Chinese precision and Saudi heritage. Engineered for the Gulf climate, built for global standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
