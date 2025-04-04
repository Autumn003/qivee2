"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "actions/user.action";
import { passwordSchema } from "schemas/user-schema";

const resetPasswordSchema = z
  .object({
    password: passwordSchema.shape.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or expired reset token");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await resetPassword(token, data.password);
      if (response.success) {
        setStatus("success");
        setMessage("Your password has been successfully reset.");
        router.push("/signin");
      } else {
        setStatus("error");
        setMessage(response.error?.message || "Failed to reset password");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <i className="ri-error-warning-line text-5xl text-destructive mx-auto"></i>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forget-password"
            className="w-full sm:w-auto px-6 py-3 bg-secondary-background text-primary-background rounded-lg font-medium flex items-center justify-center hover:bg-secondary-background/80 transition-colors duration-150"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-secondary-foreground hover:text-primary-foreground mb-8 transition-colors duration-150"
          >
            <i className="ri-arrow-left-line text-lg mr-2"></i>
            Back to Sign In
          </Link>

          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            Enter your new password below.
          </p>
        </div>

        <div className="bg-card rounded-lg border border-muted-foreground p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-xl text-muted-foreground"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="appearance-none block w-full pl-10 pr-12 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary/20 focus:border-primary sm:text-sm"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                >
                  {showPassword ? (
                    <i className="ri-eye-off-line"></i>
                  ) : (
                    <i className="ri-eye-line"></i>
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-xl text-muted-foreground"></i>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  className="appearance-none block w-full pl-10 pr-12 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary/20 focus:border-primary sm:text-sm"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-foreground hover:text-primary-foreground transition-colors duration-150 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <i className="ri-eye-off-line"></i>
                  ) : (
                    <i className="ri-eye-line"></i>
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="rounded-md bg-muted-background/60 p-4">
              <h4 className="text-sm font-medium mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-secondary-foreground/50 space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains at least one uppercase letter</li>
                <li>Contains at least one lowercase letter</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full flex justify-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed  py-3 bg-secondary-background text-primary-background rounded-lg  items-center hover:bg-secondary-background/80 transition-colors duration-150 cursor-pointer"
            >
              {status === "loading" ? (
                <div className="animate-spin">
                  <i className="ri-loader-4-line text-xl"></i>
                </div>
              ) : status === "success" ? (
                "Password Reset"
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mt-6 p-4 bg-emerald-100 rounded-md flex items-center">
              <i className="ri-checkbox-circle-line text-xl text-emerald-600 mt-0.5 mr-3 flex-shrink-0"></i>
              <p className="text-sm text-emerald-700">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 p-4 bg-red-100 rounded-md flex items-center ">
              <i className="ri-error-warning-line text-xl text-red-600 mt-0.5 mr-3 flex-shrink-0"></i>
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
