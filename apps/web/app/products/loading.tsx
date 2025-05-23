import { ProductSkeletonLoader } from "@/components";

const Loading = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title Skeleton */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl text-center font-bold text-secondary-foreground mb-8">
            Our Products
          </h1>
        </div>

        {/* Sticky Filter Bar Skeleton */}
        <div className="sticky mb-8 top-20 z-10 bg-muted-background/30 backdrop-blur-lg w-fit rounded-2xl px-4 py-2 h-fit flex items-center">
          <div className="h-10 w-32 bg-muted-background rounded-lg animate-pulse"></div>
        </div>

        {/* Filters and Search Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <div className="h-10 w-full bg-muted-background rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-40 bg-muted-background rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <ProductSkeletonLoader count={12} />
      </div>
    </div>
  );
};

export default Loading;
