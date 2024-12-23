
import localFont from "next/font/local";
import "./globals.css";
// import { NextUIProvider } from "@nextui-org/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Admin-Sphere',
  description: 'Role-Based Access Control (RBAC) Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <NextUIProvider> */}
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
          </div>
          {children}
        </AuthProvider>
        {/* </NextUIProvider> */}

      </body>
    </html>
  );
}
