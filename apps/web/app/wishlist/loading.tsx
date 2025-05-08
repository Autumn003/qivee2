"use client";

export const WishlistItemSkeleton = () => {
  return (
    <div className="rounded-lg border border-muted-foreground p-6 animate-pulse">
      <div className="flex items-start space-x-6">
        <div className="md:h-32 md:w-32 h-20 w-20 flex-shrink-0 bg-muted-background rounded-md"></div>
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-muted-background rounded w-3/4 mb-2"></div>
          <div className="mt-2 flex items-start space-x-4">
            <div className="h-6 bg-muted-background rounded w-16"></div>
            <div className="h-6 bg-muted-background rounded w-20"></div>
          </div>
          <div className="flex justify-between flex-col md:flex-row md:items-center items-start">
            <div className="mt-2 h-4 bg-muted-background rounded w-32"></div>
            <div className="flex items-center self-end space-x-4 mt-2">
              <div className="h-8 w-8 bg-muted-background rounded-full"></div>
              <div className="h-8 w-8 bg-muted-background rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="h-8 bg-muted-background rounded w-48 mb-2"></div>
            <div className="mt-2 h-4 bg-muted-background rounded w-36"></div>
          </div>

          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <div className="h-10 bg-muted-background rounded w-full"></div>
          </div>
        </div>

        {/* Filter skeleton */}
        <div className="flex items-center space-x-2 my-4">
          <div className="h-4 w-4 bg-muted-background rounded"></div>
          <div className="h-4 bg-muted-background rounded w-32"></div>
        </div>

        {/* Wishlist items skeletons */}
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <WishlistItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
