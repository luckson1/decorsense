
'use client'
import {
    createPagesBrowserClient,
    type Session,
  } from "@supabase/auth-helpers-nextjs";
  
  import "../styles/globals.css";
  import { ReactNode, useState } from "react";
  import type { AppProps } from "next/app";
  import { SessionContextProvider } from "@supabase/auth-helpers-react";
  import { Database } from '@/lib/database.types'


  
  export default function SupabaseProvider({
    children,
    initialSession
  }: { children:ReactNode, initialSession: Session | null }) {
    const [supabaseClient] = useState(() =>createPagesBrowserClient<Database>());
  
    return (
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={initialSession}
      >
      {children}
      </SessionContextProvider>
    );
  }
  
 
  