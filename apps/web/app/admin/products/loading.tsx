"use client";

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <div className="h-10 w-32 bg-muted-foreground/20 animate-pulse rounded-lg"></div>
        </div>

        {/* Filters and Search Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="h-10 bg-muted-foreground/20 animate-pulse rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-36 bg-muted-foreground/20 animate-pulse rounded-lg"></div>
            <div className="h-10 w-36 bg-muted-foreground/20 animate-pulse rounded-lg"></div>
          </div>
        </div>

        {/* Products Table Skeleton */}
        <div className="bg-late-background rounded-lg border border-muted-foreground overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted-foreground bg-muted-background/50">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-muted-foreground">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-muted-foreground/20 animate-pulse"></div>
                        <div>
                          <div className="h-5 w-28 bg-muted-foreground/20 animate-pulse rounded mb-2"></div>
                          <div className="h-4 w-20 bg-muted-foreground/20 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-muted-foreground/20 animate-pulse rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-10 bg-muted-foreground/20 animate-pulse rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="h-8 w-8 bg-muted-foreground/20 animate-pulse rounded"></div>
                        <div className="h-8 w-8 bg-muted-foreground/20 animate-pulse rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
