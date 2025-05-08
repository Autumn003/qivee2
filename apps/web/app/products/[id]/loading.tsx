"use client";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button skeleton */}
        <div className="inline-flex items-center text-sm mb-8 px-3 py-1 rounded-full">
          <div className="w-5 h-5 mr-2 bg-muted-background rounded-full animate-pulse"></div>
          <div className="w-32 h-4 bg-muted-background rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Skeleton */}
          <div className="space-y-4 lg:flex gap-4 lg:max-h-[30rem]">
            {/* Thumbnail skeletons - desktop */}
            <div className="lg:grid grid-rows-4 gap-2 hidden">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden w-24 bg-muted-background animate-pulse"
                  ></div>
                ))}
            </div>

            {/* Main image skeleton */}
            <div className="aspect-square flex justify-center overflow-hidden">
              <div className="w-full h-full rounded-lg bg-muted-background animate-pulse"></div>
            </div>

            {/* Thumbnail skeletons - mobile */}
            <div className="grid grid-cols-4 gap-4 lg:hidden">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden bg-muted-background animate-pulse"
                  ></div>
                ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              {/* Product title skeleton */}
              <div className="w-3/4 h-8 bg-muted-background rounded animate-pulse"></div>
              <div className="flex items-center space-x-4 space-y-2">
                {/* Price skeleton */}
                <div className="w-24 h-6 bg-muted-background rounded animate-pulse"></div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-muted-background rounded animate-pulse"></div>
              <div className="w-full h-4 bg-muted-background rounded animate-pulse"></div>
              <div className="w-full h-4 bg-muted-background rounded animate-pulse"></div>
              <div className="w-full h-4 bg-muted-background rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-muted-background rounded animate-pulse"></div>
            </div>

            {/* Action Buttons skeleton */}
            <div className="flex space-x-4 pt-6">
              <div className="flex-1 h-12 bg-muted-background rounded-lg animate-pulse"></div>
              <div className="h-12 w-12 bg-muted-background rounded-lg animate-pulse"></div>
              <div className="h-12 w-12 bg-muted-background rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS SKELETON */}
      <section className="container mx-auto my-20">
        <div className="w-64 h-8 bg-muted-background rounded animate-pulse mx-auto mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="group">
                <div className="aspect-square w-full bg-muted-background rounded-lg animate-pulse mb-2"></div>
                <div className="w-3/4 h-5 bg-muted-background rounded animate-pulse mt-2"></div>
                <div className="w-1/4 h-5 bg-muted-background rounded animate-pulse mt-2"></div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
