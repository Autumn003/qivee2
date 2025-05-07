"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-muted-background animate-pulse rounded-md" />
            <div className="h-4 w-64 bg-muted-background animate-pulse rounded-md" />
          </div>
          <div className="flex space-x-4">
            <div className="h-10 w-10 bg-muted-background animate-pulse rounded-md" />
            <div className="h-10 w-10 bg-muted-background animate-pulse rounded-md" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="brounded-lg border border-secondary-foreground p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded-md" />
              </div>
              <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-lg border border-secondary-foreground p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="h-6 w-32 bg-muted-background animate-pulse rounded-md" />
                <div className="h-8 w-24 bg-muted-background animate-pulse rounded-md" />
              </div>
              <div className="h-[300px] bg-muted-background animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
