"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/public/HomeLogo.png";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/0 to-background/0 z-0"></div>
      <div className="w-full max-w-md z-10">
        <div className="bg-background rounded-xl shadow-lg overflow-hidden relative">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors self-start mb-4 absolute"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Link>
              <div className="flex justify-center w-full">
                <Image
                  src={Logo}
                  alt="HOMELOGO"
                  width={200}
                  height={200}
                  className="object-contain "
                />
              </div>
              <h1 className="text-2xl font-bold text-center mb-6 mt-4">
                Create an Account
              </h1>
            </div>
            <SignupForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?
              </span>{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
