"use client";

import Link from "next/link";

export default function Loading() {
  // Skeleton cart items to display while loading
  const skeletonItems = Array(3).fill(0);

  return (
    <div className="min-h-screen bg-muted-background/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
            Shopping Cart
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center px-3 py-2 text-sm text-secondary-foreground hover:text-primary-foreground hover:bg-secondary-background/10 transition-all duration-150 rounded-full"
          >
            <i className="ri-arrow-left-line mr-1 text-lg"></i>
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Skeleton Cart Items */}
          <div className="lg:col-span-8 max-h-[40rem] overflow-auto p-4 border border-muted-background rounded-2xl custom-scrollbar">
            <div className="space-y-4">
              {skeletonItems.map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-card p-4 rounded-lg border border-muted-foreground"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted-foreground/20 animate-pulse"></div>
                  <div className="flex flex-col md:flex-row items-start gap-4 justify-between w-full">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-5 w-40 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                      <div className="h-4 w-20 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-between w-full md:justify-normal md:w-fit space-x-4">
                      <div className="h-10 w-24 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                      <div className="h-10 w-10 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-lg border border-muted-foreground p-6">
              <div className="h-6 w-32 bg-muted-foreground/20 rounded-md animate-pulse mb-4"></div>
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="h-4 w-20 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                      <div className="h-4 w-16 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                <div className="border-t border-muted-foreground pt-3">
                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                    <div className="h-5 w-20 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-6 h-12 bg-muted-foreground/20 rounded-lg animate-pulse"></div>
            </div>

            {/* Skeleton Secure Checkout Notice */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center">
                <div className="h-5 w-5 bg-muted-foreground/20 rounded-md animate-pulse mr-2"></div>
                <div className="h-4 w-48 bg-muted-foreground/20 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
