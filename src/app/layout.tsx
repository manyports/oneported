import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "oneported - ваше сообщество программистов",
  description: "мы создадим из тебя лучшего программиста :)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          property="og:title"
          content="oneported - ваше сообщество программистов"
        />
        <meta
          property="og:description"
          content="мы создадим из тебя лучшего программиста :)"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
