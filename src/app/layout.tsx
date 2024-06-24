import ClientWrapper from "@/components/ client-wrapper";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/AuthContext";
import { PostProvider } from "@/lib/PostContext";
import { UserProvider } from "@/lib/UserContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Network",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.className} select-none min-h-screen`}>
        <AuthProvider>
          <UserProvider>
            <PostProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ClientWrapper>
                  <NavBar />
                  {children}
                </ClientWrapper>
              </ThemeProvider>
            </PostProvider>
          </UserProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
