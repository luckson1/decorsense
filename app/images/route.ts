import { prisma } from "@/lib/prisma"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import {cookies} from "next/headers"
import { NextResponse } from "next/server"


  export async function GET() {
    const supabase=createServerComponentClient({cookies})
    const {data: {user}}= await supabase.auth.getUser()
    if (!user) return new Response("Unauthorised, please login!", {
      status: 401,
    });
      const userImages= await prisma.image.findMany({
        where: {
            usersId: user.id
        },
        select: {
          id: true,
          room: true,
          theme: true,
          imageUrl: true
        }

      })
      if(!userImages) return new Response("An error occurred while fetching images", {
        status: 500,
      });
return NextResponse.json({  userImages })
  }