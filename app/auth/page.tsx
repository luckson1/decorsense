import { UserAuthForm } from "@/app/auth/components/authform";
import Image from "next/image";
import Link from "next/link";


export default async function  AuthenticationPage() {

  return (
    <>
      <div className="container relative  h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="bg-muted relative  h-full flex-col p-10 text-white dark:border-r :flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1535356795203-50b2eb73f96c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2394&q=80)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src={
                "https://res.cloudinary.com/dhciks96e/image/upload/v1686921534/Screen_Shot_2023-06-16_at_1.45.31_PM-removebg-preview_r97cfc.png"
              }
              height={50}
              width={50}
              alt="Sino Remit"
              className="mr-2 h-6 w-6"
            />{" "} 
           DesignSenseAI
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">Make your dreams come true</p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className="text-muted-foreground px-8 text-center text-sm">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="hover:text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
