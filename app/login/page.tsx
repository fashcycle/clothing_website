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

  const handleSuccess = async (credentialResponse: any) => {
    const id_token = credentialResponse.credential; // This is the id_token

    // Now send the id_token to the backend
    try {
      const res = await axios.post("/users/login", {
        id_token,
      });
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };
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
    setIsLoading(true)
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password
      });
    
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user-info', JSON.stringify(response.user));
        router.push('/profile');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // This would be replaced with actual phone OTP verification logic
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/profile"
    }, 1500)
  }
  const handleLoginSuccess = async (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential);

    const { email, name, picture } = decoded;
    const token = credentialResponse.credential;

    const object = { email, name, image: picture, token };
    try {
      if (token) {
        const result: any = await loginUser({ id_token: token });
        if (result.success == true) {
          const userInfo = {
            email: result.user.email,
            name: result.user.name,
            image: result.user.avatar,
            id: result.user.id,
            role: result.user.role
          };

          localStorage.setItem('user-info', JSON.stringify(userInfo));
          localStorage.setItem('token', result.token); // Store token without JSON.stringify
         
          router.push('/profile');
        }
      }
    } catch (error) {
      console.log('Erro while requesting goggle code', error)
    }

  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/0 to-background/0 z-0"></div>
      <div className="w-full max-w-md z-10">
        <div className="bg-background rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Link>
              <Link href="/" className="font-bold text-xl">
                <span className="text-primary">Style</span>Swap
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>

            {/* <Button variant="outline" className="w-full mb-4 relative" onClick={handleGoogleLogin} disabled={isLoading}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                Continue with Google
              </Button> */}
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.error("Google Login Failed");
              }}
            />
            {/* <GoogleLogin
  clientId="728166853981-5ijtecpp013m00fditbq17ko09h94qsc.apps.googleusercontent.com"
  buttonText="Login with Google"
  onSuccess={(response:any) => console.log(response)}
  onFailure={(response:any) => console.error(response)}
  cookiePolicy={'single_host_origin'}
  // Add this:
  responseType="id_token"
  scope="profile email"
/> */}
            {/* <Button 
  variant="outline" 
  className="w-full mb-4 relative flex items-center justify-center gap-2" 
  onClick={() => googleLogin()}
>
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
  Continue with Google
</Button> */}
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

