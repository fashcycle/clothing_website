"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn } from "next-auth/react"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '@/lib/firebase'
import { sendPasswordResetEmail } from "firebase/auth";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required")
});

type LoginFormData = yup.InferType<typeof loginSchema>;
import { loginUser } from "@/app/api/api"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });


  const responseGoogle = async (authResult: any) => {

    try {
      if (authResult?.code) {
        const result: any = loginUser({ id_token: authResult?.code });
        const { email, name, image } = result.data.user
        const token = result.data.token
        const object = { email, name, image, token }
        localStorage.setItem('user-info', JSON.stringify(object))

        router.push('/profile');
      }
    } catch (error) {
      console.log('Erro while requesting goggle code', error)
    }
  }
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })


  const handleEmailLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password
      });

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user-info', JSON.stringify(response.user));

        toast.success("Login successful!");
        router.push('/profile');
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };


  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // This would be replaced with actual phone OTP verification logic
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/profile"
    }, 1500)
  }
  // const handleLoginSuccess = async (credentialResponse: any) => {
  //   const decoded: any = jwtDecode(credentialResponse.credential);

  //   const { email, name, picture } = decoded;
  //   const token = credentialResponse.credential;

  //   const object = { email, name, image: picture, token };
  //   try {
  //     if (token) {
  //       const result: any = await loginUser({ id_token: token });
  //       if (result.success == true) {
  //         const userInfo = {
  //           email: result.user.email,
  //           name: result.user.name,
  //           image: result.user.avatar,
  //           id: result.user.id,
  //           role: result.user.role
  //         };

  //         localStorage.setItem('user-info', JSON.stringify(userInfo));
  //         localStorage.setItem('token', result.token); // Store token without JSON.stringify

  //         router.push('/profile');
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Erro while requesting goggle code', error)
  //   }

  // };
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const object = {
        email: user.email,
        name: user.displayName,
        image: user.photoURL,
        token: await user.getIdToken()
      };

      // Optional: send ID token to backend
      const response: any = await loginUser({ id_token: object.token });

      if (response.success) {
        const userInfo = {
          email: response.user.email,
          name: response.user.name,
          image: response.user.avatar,
          id: response.user.id,
          role: response.user.role
        };

        localStorage.setItem("user-info", JSON.stringify(userInfo));
        localStorage.setItem("token", response.token);

        router.push("/profile");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Firebase login error", error);
      toast.error("Login failed");
    }
  };
 

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/0 to-background/0 z-0"></div>
      <div className="w-full max-w-md z-10">
        <div className="bg-background/95 rounded-xl shadow-2xl overflow-hidden border border-gray-800/10 backdrop-blur-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
            <div className="w-full flex justify-center">
              {/* <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  console.error("Google Login Failed");
                }}
                theme="outline"
                size="large"
                width={340}
                useOneTap
              /> */}
              <Button onClick={handleGoogleLogin} variant="outline" className="w-full mb-4">
                <img src="/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </div>
            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
              </div>
            </div>

            <Tabs defaultValue="email" className="w-full">
              {/* <TabsList className="grid w-full grid-cols-1 mb-6">
                  <TabsTrigger value="email">Emai</TabsTrigger>
                </TabsList> */}

              <TabsContent value="email">
                <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
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
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 9876543210" required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

