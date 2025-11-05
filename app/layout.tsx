import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair"
});

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "Poonam Cosmetics - Beauty & Makeup Products",
  description: "Shop the latest cosmetics, makeup, skincare, and beauty products at Poonam Cosmetics. Quality products delivered to your doorstep.",
  keywords: "cosmetics, makeup, skincare, beauty products, lipstick, foundation, face cream",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
