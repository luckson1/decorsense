


import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redis } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { revalidatePath } from 'next/cache'
import { z } from "zod";

// Create a new ratelimiter, that allows 5 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(100, "1440 m"),
      analytics: true,
    })
  : undefined;

const roomSchema = z.object({
  imageUrl: z.string(),
  room: z.enum([
    "living_room",
    "dining_room",
    "bedroom",
    "bathroom",
    "office",
    "gaming_room",
  ]),
  theme: z.enum([
    "Modern",
    "Traditional",
    "Contemporary",
    "Farmhouse",
    "Rustic",
    "MidCentury",
    "Mediterranean",
    "Industrial",
    "Scandinavian",
  ]),
});

export async function POST(request: Request) {
  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");
  
    if (!result.success) {
      return new Response(
        "Too many uploads in 1 day. Please try again in a 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        }
      );
    }
  }

  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(
      "Unauthorized! Please login in",
      {
        status: 401,

      }
    );
  }

  const inputs = await request.json();
  const data = roomSchema.parse(inputs);
  const { imageUrl, theme, room } = data;

  try {
    // POST request to Replicate to start the image restoration generation process
    const startResponse = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version:
          "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
        input: {
          image: imageUrl,
          prompt:
            room === "gaming_room"
              ? "a room for gaming with gaming computers, gaming consoles, and gaming chairs"
              : `a ${theme.toLowerCase()} ${room.toLowerCase()}`,
          a_prompt:
            "best quality, extremely detailed, photo from Pinterest, photo from Houzz, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, high definition",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
      }
    );

    const jsonStartResponse = startResponse.data;
    const endpointUrl = jsonStartResponse.urls.get;

    // GET request to get the status of the image restoration process & return the result when it's ready
    let restoredImage = null;
    while (!restoredImage) {
      // Loop in 1s intervals until the alt text is ready
      console.log("polling for result...");
      const finalResponse = await axios.get(endpointUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
      });

      const jsonFinalResponse = finalResponse.data;

      if (jsonFinalResponse.status === "succeeded") {
        restoredImage = jsonFinalResponse.output[1];
      } else if (jsonFinalResponse.status === "failed") {
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (restoredImage) {
      await prisma.image.create({
        data: {
          imageUrl: restoredImage,
          room,
          theme,
          usersId: user.id
        },
      });
      revalidatePath("/my-designs")
    }

    return NextResponse.json(
      restoredImage ? restoredImage : "Failed to restore image"
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred while processing the request", {
      status: 500,
    });
  }
}
