"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "actions/user.action";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await requestPasswordReset(email);
      console.log(response);
      if (response.success) {
        setStatus("success");
        setMessage("Password reset instructions have been sent to your email.");
      } else {
        setStatus("error");
        setMessage(response.error?.message || "Failed to send reset link.");
        return;
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-secondary-foreground hover:text-foreground mb-8"
          >
            <i className="ri-arrow-left-line text-lg mr-2"></i>
            Back to Sign In
          </Link>

          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        <div className="bg-card rounded-lg border border-muted-foreground p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-mail-line text-xl text-muted-foreground"></i>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full pl-10 pr-4 py-2 border border-muted-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary/20 focus:border-primary sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
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
                "Email Sent"
              ) : (
                "Send Reset Link"
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
            <div className="mt-6 p-4 bg-red-100 rounded-md flex items-center">
              <i className="ri-error-warning-line text-xl text-red-600 mt-0.5 mr-3 flex-shrink-0"></i>
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-secondary-foreground">
          Remember your password?{" "}
          <Link
            href="/signin"
            className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
