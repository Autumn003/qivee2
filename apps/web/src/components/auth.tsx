"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "actions/user.action";
import { registerSchema } from "schemas/register-schema";
import { loginSchema } from "schemas/login-schema";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const response = await createUser(formData);

      if (response?.error) {
        console.error("Registration error:", response.error);
        return;
      }

      const loginResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (loginResult?.error) {
        console.error("Login failed after registration:", loginResult.error);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-late-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Welcome to Qivee
          </h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            Your one-stop shop for premium essentials
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-muted-foreground">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === "signin"
                ? "border-primary-foreground text-primary-foreground"
                : "border-transparent text-secondary-foreground hover:text-primary-foreground cursor-pointer"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === "signup"
                ? "border-primary-foreground text-primary-foreground"
                : "border-transparent text-secondary-foreground hover:text-primary-foreground cursor-pointer"
            }`}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "signin" ? (
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...loginForm.register("email")}
                  className="appearance-none block w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 focus:border-primary-background sm:text-sm"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password")}
                  className="appearance-none block w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 focus:border-primary-background sm:text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary-foreground cursor-pointer transition-colors duration-150"
                >
                  {showPassword ? (
                    <i className="ri-eye-off-line "></i>
                  ) : (
                    <i className="ri-eye-line"></i>
                  )}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4  rounded-md shadow-sm text-sm font-semibold text-primary-background bg-primary-foreground hover:bg-primary-foreground/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex gap-2">
                    <p>Sign in</p>{" "}
                    <i className="ri-loader-4-line animate-spin"></i>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-foreground" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-late-background text-secondary-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center py-2 px-4 border border-secondary-foreground rounded-md shadow-sm text-sm font-medium hover:bg-muted-background cursor-pointer transition-colors duration-150"
              >
                <i className="ri-google-fill text-xl mr-2"></i>
                Google
              </button>
            </div> */}
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  {...registerForm.register("name")}
                  className="appearance-none block w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 focus:border-primary-background sm:text-sm"
                />
              </div>
              {registerForm.formState.errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="register-email"
                  type="email"
                  {...registerForm.register("email")}
                  className="appearance-none block w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 focus:border-primary-background sm:text-sm"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  {...registerForm.register("password")}
                  className="appearance-none block w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 focus:border-primary sm:text-sm pr-10 focus:border-primary-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                >
                  {showPassword ? (
                    <i className="ri-eye-off-line"></i>
                  ) : (
                    <i className="ri-eye-line"></i>
                  )}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-foreground"
              >
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  {...registerForm.register("confirmPassword")}
                  className="appearance-none block w-full px-3 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 focus:border-primary-background sm:text-sm"
                />
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-semibold text-primary-background bg-primary-foreground hover:bg-primary-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex gap-2 items-center justify-center">
                    <p>Create account</p>
                    <i className="ri-loader-4-line animate-spin"></i>
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-foreground" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-late-background text-secondary-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center py-2 px-4 border border-muted-foreground rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-secondary"
              >
                <i className="ri-google-fill text-xl mr-2"></i>
                Google
              </button>
            </div> */}
          </form>
        )}
      </div>
    </div>
  );
}
