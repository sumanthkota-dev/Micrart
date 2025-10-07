import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminAuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Micrart Gallery",
  description: "Explore extraordinary carvings and artworks by talented artists",
  icons: {
    icon: "/favicon.ico",           // default favicon for browsers
    apple: "/apple-touch-icon.png", // for iOS devices
    other: [
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdminAuthProvider>
          {children}
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              className: "toast-modern",
              duration: 2800,
            }}
          />
        </AdminAuthProvider>
      </body>
    </html>
  );
}
