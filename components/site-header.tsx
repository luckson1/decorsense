import Link from "next/link";


import {cookies} from "next/headers"

import { Account } from "./account-button";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";;
import { ModeToggle } from "./mode-toggle";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function SiteHeader() {
  const supabase=createServerComponentClient({cookies})
  const {data: {session}}= await supabase.auth.getSession()
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur bg">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <CommandMenu /> */}
          </div>
          <nav className="flex items-center space-x-2">
       
            <Account session={session}/>

            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
