"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import {
  forgetPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
} from "../api/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Define validation schemas
const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const verifyOTPSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: errorsOTP },
  } = useForm({
    resolver: yupResolver(verifyOTPSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmitEmail = async (data) => {
    setIsLoading(true);
    setEmail(data.email);
    try {
      const response = await forgetPassword(data);
      toast.success(response.message);
      setStep(2);
      startTimer();
    } catch (error) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await verifyOTP({ email, otp: data.otp });
      setVerificationToken(response.verificationToken);
      setStep(3);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsLoading(true);
    try {
      const response = await resetPassword({
        verificationToken,
        password: data.password,
      });
      toast.success(response.message);
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await resendOTP({ email });
      toast.success(response.message);
      startTimer();
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    setResendDisabled(true);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-bg">
      <div className="w-full max-w-md">
        <div className="bg-background/95 rounded-xl shadow-2xl p-6 border border-gray-800/10">
          {step === 1 && (
            <>
              <button
                onClick={() => router.push("/login")}
                className="mb-4 flex items-center text-sm text-muted-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
              </button>
              <form
                onSubmit={handleSubmitEmail(onSubmitEmail)}
                className="space-y-4"
              >
                <h1 className="text-2xl font-bold text-center mb-6">
                  Reset Password
                </h1>
                <p className="text-muted-foreground text-center mb-6">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...registerEmail("email")}
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                  />
                  {errorsEmail.email && (
                    <p className="text-sm text-destructive">
                      {errorsEmail.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="mb-4 flex items-center text-sm text-muted-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
              </button>
              <form
                onSubmit={handleSubmitOTP(onSubmitOTP)}
                className="space-y-4"
              >
                <h1 className="text-2xl font-bold text-center mb-6">
                  Verify OTP
                </h1>
                <p className="text-muted-foreground text-center mb-6">
                  Enter the OTP sent to your email.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    disabled={true}
                  />
                  {errorsOTP.otp && (
                    <p className="text-sm text-destructive">
                      {errorsOTP.otp.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    {...registerOTP("otp")}
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                  />
                  {errorsOTP.otp && (
                    <p className="text-sm text-destructive">
                      {errorsOTP.otp.message}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleResendOTP}
                  variant="ghost"
                  className="w-full"
                  disabled={resendDisabled || isLoading}
                >
                  {isLoading
                    ? "Sending..."
                    : `Resend OTP ${resendDisabled ? `(${timer}s)` : ""}`}
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </>
          )}

          {step === 3 && (
            <form
              onSubmit={handleSubmitPassword(onSubmitPassword)}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-center mb-6">
                Reset Password
              </h1>
              <p className="text-muted-foreground text-center mb-6">
                Enter your new password.
              </p>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...registerPassword("password")}
                  id="password"
                  type="password"
                  placeholder="New Password"
                />
                {errorsPassword.password && (
                  <p className="text-sm text-destructive">
                    {errorsPassword.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  {...registerPassword("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                />
                {errorsPassword.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errorsPassword.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
