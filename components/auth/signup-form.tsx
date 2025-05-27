"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { registerUser } from "@/app/api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const signupSchema = yup.object().shape({
  name: yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
    email: yup.string()
    .required("Email is required")
    .email("Please enter a valid email")
    .test(
      "not-disposable",
      "Disposable emails are not allowed",
      (value) => {
        const disposableDomains = ['mailinator.com', 'tempmail.com'];
        const domain = value?.split('@')[1];
        return !disposableDomains.includes(domain || '');
      }
    ),
  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
});

type SignupFormData = yup.InferType<typeof signupSchema>;

export function SignupForm() {
    const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
  
      if (response.success) {
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        // This block is optional now; registerUser throws on error
        toast.error(response.message || "Something went wrong");
      }
    } catch (error: any) {

      toast.error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("name")}
            id="name"
            placeholder="John Doe"
            className="pl-10"
          />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="name@example.com"
            className="pl-10"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  )
}