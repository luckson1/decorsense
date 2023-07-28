"use client"
import { type Session } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';

export default  function SessionCheck({children, session}: {children: React.ReactNode, session:Session | null}) {

  

    const paths=usePathname()
  const router=useRouter()
  const isAuthPage=paths==='/auth'
  const isHomePage=paths==='/'
  const isPublicPages=isAuthPage || isHomePage
  if( !isPublicPages && !session) {
    router.replace("/auth")
  }
 
  return (
    <>
    {children}
    </>
  )
}
