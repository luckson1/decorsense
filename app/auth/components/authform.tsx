
'use client'
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icons } from "../../../components/icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [email, setEmail] = useState("");
  const supabase = createClientComponentClient()
  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback`},
    });

    if (error) {
      toast.error(` There was a problem: ${error.message}`);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const signInWithOTP = async (email: string) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback`},
    });
    if (error) {
      toast.error(` There was a problem: ${error.message}`);

      setIsLoading(false);
    }
    if (data) {
      setIsLoading(false);
      setEmailSent(true);
      toast.success("Magic Link sent to your Email.");
    }
  };
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signInWithOTP(email);
        }}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            className="bg-teal-500 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
          {emailSent && (
            <p className="text-sm font-medium">
              A magic link has been sent to your email. Follow it to login
            </p>
          )}
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={signInWithGoogle}
        // disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
