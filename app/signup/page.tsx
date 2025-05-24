import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SignupForm } from "@/components/auth/signup-form"
import { Separator } from "@/components/ui/separator"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/0 to-background/0 z-0"></div>
      <div className="w-full max-w-md z-10">
        <div className="bg-background rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Link>
              <Link href="/" className="font-bold text-xl">
                <span className="text-primary font-serif ">Fashcycle</span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
            
            <SignupForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}