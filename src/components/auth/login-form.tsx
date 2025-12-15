"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Button3D } from "@/components/ui/3d-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { InlineSpinner } from "@/components/ui/loading";
import Image from "next/image";

// Google Logo Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
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
);

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // Helper function to get redirect URL based on user role
  const getRedirectUrl = (userRole: string) => {
    const adminRoles = ["ADMIN", "ORGANIZER", "CO_ORGANIZER", "FACILITATOR"];
    if (adminRoles.includes(userRole)) {
      return "/admin";
    }
    return "/";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (result?.ok) {
        const session = await getSession();
        if (session?.user) {
          const redirectUrl = callbackUrl || getRedirectUrl(session.user.role);
          router.push(redirectUrl);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const result = await signIn("google", {
        callbackUrl: callbackUrl || "/",
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "OAuthAccountNotLinked") {
          setError(
            "This email is already registered with a different sign-in method. Please use email and password to sign in."
          );
        } else {
          setError(
            "An error occurred during Google sign-in. Please try again."
          );
        }
      } else if (result?.ok) {
        // Get session to determine redirect URL
        const session = await getSession();
        if (session?.user) {
          const redirectUrl = callbackUrl || getRedirectUrl(session.user.role);
          window.location.href = result.url || redirectUrl;
        } else {
          window.location.href = result.url || "/";
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("An error occurred during Google sign-in. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <Image
            src="/Logo.webp"
            alt="GDG Vishnu Logo"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* Login Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-productSans">
            Login
          </h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 font-productSans"
            >
              Address email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              disabled={isLoading || isGoogleLoading}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 font-productSans">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 font-productSans"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                disabled={isLoading || isGoogleLoading}
                className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 font-productSans">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 font-productSans"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button3D
            type="submit"
            variant="default"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium"
            disabled={isLoading || isGoogleLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button3D>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-productSans">
              OR
            </span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <InlineSpinner className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </>
          )}
        </Button>

        {/* Sign up link */}
        <div className="text-center text-sm text-gray-600 font-productSans">
          You don&apos;t have an account yet?{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-500 font-medium underline font-productSans"
            onClick={() => router.push("/auth/signup")}
          >
            Sign up
          </button>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500 font-productSans">
          By creating account you agree to our{" "}
          <a href="#" className="text-blue-600 hover:text-blue-500 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-500 underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
