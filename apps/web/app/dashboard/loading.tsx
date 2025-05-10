export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header - Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-muted-background animate-pulse"></div>
            <div className="ml-4">
              <div className="h-8 w-48 bg-muted-background rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-muted-background rounded mt-2 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex justify-around">
            <div className="h-10 w-28 bg-muted-background rounded-lg mr-2 animate-pulse"></div>
            <div className="h-10 w-28 bg-muted-background rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Navigation Tabs - Skeleton */}
        <div className="border-b border-muted-foreground mb-8">
          <div className="flex justify-between">
            <div className="flex space-x-8">
              <div className="py-4 mb-2 w-20 h-6 bg-muted-background rounded animate-pulse"></div>
              <div className="py-4 mb-2 w-20 h-6 bg-muted-background rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton for both tabs */}
        <div className="space-y-8 mb-20">
          {/* Quick Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-late-background p-6 rounded-lg border border-muted-foreground"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-muted-background rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-muted-background rounded animate-pulse"></div>
                </div>
                <div className="mt-4 h-8 w-12 bg-muted-background rounded animate-pulse"></div>
                <div className="mt-2 h-4 w-24 bg-muted-background rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Recent Orders Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 w-40 bg-muted-background rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-muted-background rounded animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-card rounded-lg border border-muted-foreground p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="h-5 w-32 bg-muted-background rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-muted-background rounded mt-2 animate-pulse"></div>
                    </div>
                    <div className="h-6 w-24 bg-muted-background rounded-full animate-pulse"></div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((img) => (
                        <div
                          key={img}
                          className="h-12 w-12 rounded-md border-2 border-muted-background bg-muted-background animate-pulse"
                        ></div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-muted-background rounded animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-20 bg-muted-background rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Section Skeleton */}
          <div className="rounded-lg border border-muted-foreground p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 w-48 bg-muted-background rounded animate-pulse"></div>
              <div className="h-10 w-36 bg-muted-background rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-muted-background rounded animate-pulse"></div>
                <div className="mt-1 h-6 w-48 bg-muted-background rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-muted-background rounded animate-pulse"></div>
                <div className="mt-1 h-6 w-48 bg-muted-background rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Addresses Skeleton */}
          <div className="rounded-lg border border-muted-foreground p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-6 w-6 bg-muted-background rounded mr-2 animate-pulse"></div>
                <div className="h-6 w-36 bg-muted-background rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-32 bg-muted-background rounded-md animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[1, 2].map((address) => (
                <div
                  key={address}
                  className="p-4 rounded-lg border border-secondary-foreground"
                >
                  <div>
                    <div className="h-5 w-32 bg-muted-background rounded animate-pulse"></div>
                    <div className="h-4 w-48 bg-muted-background rounded mt-2 animate-pulse"></div>
                    <div className="h-4 w-64 bg-muted-background rounded mt-2 animate-pulse"></div>
                    <div className="h-4 w-40 bg-muted-background rounded mt-2 animate-pulse"></div>
                    <div className="h-4 w-24 bg-muted-background rounded mt-2 animate-pulse"></div>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <div className="h-8 w-8 bg-muted-background rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-muted-background rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
