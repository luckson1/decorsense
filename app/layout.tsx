import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { fontSans } from "@/lib/fonts";
import { Metadata } from "next";
import {cookies} from "next/headers"
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { ThemeProvider } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { Toaster as NewYorkToaster } from "@/components/ui/toaster";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
export const dynamic = 'force-static'
export const revalidate = 60
import SessionCheck from "@/components/session_check";
const title= {
  default: siteConfig.name,
  template: `%s - ${siteConfig.name}`,
}
const description = siteConfig.description
let ogimage = "https://roomgpt-demo.vercel.app/og-image.png";


export const metadata: Metadata = {
title,
themeColor: [
  { media: "(prefers-color-scheme: light)", color: "white" },
  { media: "(prefers-color-scheme: dark)", color: "black" },
],
keywords: ["Interior Decor", "interior Design", "AI", "Artificial Intelligent and Interior Decor"],
  description,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase=createServerComponentClient({cookies})
  const {data: {session}}= await supabase.auth.getSession()

  return (
    <>
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionCheck session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
              {/* @ts-expect-error Server Component */}
            <SiteHeader />
            <div className="flex-1">{children}</div>
       
          </div>
          <TailwindIndicator />
        </ThemeProvider>
        </SessionCheck>
        <NewYorkToaster />
        <DefaultToaster />
      </body>
    </html>
  </>
  );
}
