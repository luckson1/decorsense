import Footer from '@/components/Footer';
import React from 'react'
import {cookies} from "next/headers"
import { Room, Theme, prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import Image  from 'next/image';
import DownloadButton from './components/Client';
import ToolTipComponent from '@/components/ui/tooltip_component';
import { Button } from '@/components/ui/button';
import { LucideDownload } from 'lucide-react';
import Client from './components/Client';




async function getImages (){
     const res = await (await import('./../images/route')).GET()
    return res.json()
}
export default async function MyDesigns() {
    const data=await getImages() 
    const restoredImages= data.userImages as {
      room: Room;
      id: string;
      theme: Theme;
      imageUrl: string;
  }[] | null

  return (
    <div className="flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
    <h1 className="mx-auto w-full  s font-display text-4xl font-bold tracking-normal  sm:text-6xl mb-5">
        Your <span className="text-blue-600">Designs</span>
      </h1>
      
         <Client restoredImages={restoredImages} />
       
   
    </main>
    <Footer />
  </div>
  )
}
