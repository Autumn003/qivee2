export default function OrdersSkeleton() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 w-48 bg-muted-background/80 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-muted-background/80 rounded-lg animate-pulse"></div>
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <div className="h-10 w-full bg-muted-background/80 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-36 bg-muted-background/80 rounded-lg animate-pulse"></div>
            <div className="h-10 w-36 bg-muted-background/80 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* card skeleton */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-muted-foreground/50 overflow-hidden mb-5"
          >
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-6 bg-muted-background/80 rounded animate-pulse"></div>

                  <div>
                    <div className="h-5 w-32 bg-muted-background/80 rounded animate-pulse"></div>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="h-4 w-4 bg-muted-background/80 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-muted-background/80 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center justify-between md:justify-normal space-x-4">
                  <div className="px-3 py-1 rounded-full flex items-center space-x-1.5">
                    <div className="h-4 w-4 bg-muted-background/80 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-muted-background/80 rounded animate-pulse"></div>
                  </div>
                  <div className="p-2 rounded-md">
                    <div className="h-5 w-5 bg-muted-background/80 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
