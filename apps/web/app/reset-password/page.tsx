import { ResetPassword } from "@/components";
import { Suspense } from "react";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto bg-card rounded-lg p-8 shadow-md">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-secondary-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}

const page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPassword />
    </Suspense>
  );
};

export default page;
