export function DashboardSkeleton() {
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
            <div className="h-10 w-24 bg-muted-background animate-pulse rounded-md" />
            <div className="h-10 w-24 bg-muted-background animate-pulse rounded-md" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-muted-foreground p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 bg-muted-background animate-pulse rounded-full" />
                <div className="h-6 w-16 bg-muted-background animate-pulse rounded-md" />
              </div>
              <div className="h-8 w-24 bg-muted-background animate-pulse rounded-md" />
              <div className="h-4 w-20 bg-muted-background animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-muted-foreground p-6"
            >
              <div className="h-6 w-32 bg-muted-background animate-pulse rounded-md mb-8" />
              <div className="h-[300px] bg-muted-background animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        {/* Recent Orders Skeleton */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-32 bg-muted-background animate-pulse rounded-md" />
            <div className="h-4 w-24 bg-muted-background animate-pulse rounded-md" />
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg border border-muted-foreground p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted-background animate-pulse rounded-md" />
                    <div className="h-4 w-24 bg-muted-background animate-pulse rounded-md" />
                  </div>
                  <div className="h-6 w-24 bg-muted-background animate-pulse rounded-full" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="h-12 w-12 bg-muted-background animate-pulse rounded-md border-2 border-muted-background"
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-muted-background animate-pulse rounded-md" />
                  </div>
                  <div className="h-6 w-16 bg-muted-background animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
