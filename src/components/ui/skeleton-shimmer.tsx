import { cn } from "@/lib/utils";

interface SkeletonShimmerProps {
  className?: string;
}

export function SkeletonShimmer({ className }: SkeletonShimmerProps) {
  return <div className={cn("skeleton-shimmer", className)} />;
}

export function HeroSkeleton() {
  return (
    <div className="frame-container frame-container-dark noise-overlay min-h-[85vh] p-6 sm:p-10 md:p-16 relative">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">
        {/* Image skeleton */}
        <div className="flex-1 flex items-center justify-center">
          <SkeletonShimmer className="w-full max-w-md aspect-[3/4] rounded-2xl" />
        </div>
        
        {/* Content skeleton */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <SkeletonShimmer className="h-4 w-24" />
          <SkeletonShimmer className="h-16 w-full max-w-lg" />
          <SkeletonShimmer className="h-12 w-3/4" />
          <SkeletonShimmer className="h-20 w-full max-w-md" />
          
          <div className="flex gap-4 mt-4">
            <SkeletonShimmer className="h-8 w-32" />
            <SkeletonShimmer className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BiographySkeleton() {
  return (
    <div className="frame-container frame-container-light noise-overlay p-6 sm:p-10 md:p-16">
      <SkeletonShimmer className="h-4 w-20 mb-8" />
      
      <div className="flex items-start gap-4 mb-8">
        <SkeletonShimmer className="h-8 w-8 rounded-full" />
        <SkeletonShimmer className="h-24 w-full max-w-3xl" />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-12">
        <div className="flex items-center gap-4">
          <SkeletonShimmer className="h-14 w-14 rounded-full" />
          <div>
            <SkeletonShimmer className="h-5 w-32 mb-2" />
            <SkeletonShimmer className="h-4 w-48" />
          </div>
        </div>
        
        <div className="flex-1 max-w-xl">
          <SkeletonShimmer className="h-16 w-full" />
        </div>
        
        <div className="flex gap-2">
          <SkeletonShimmer className="h-10 w-10 rounded-full" />
          <SkeletonShimmer className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MarketsSkeleton() {
  return (
    <div className="frame-container frame-container-cream noise-overlay p-6 sm:p-10 md:p-16">
      <div className="text-center mb-12">
        <SkeletonShimmer className="h-12 w-3/4 max-w-lg mx-auto mb-4" />
        <SkeletonShimmer className="h-6 w-full max-w-2xl mx-auto" />
      </div>
      
      {/* Stats */}
      <div className="flex justify-center gap-8 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="text-center">
              <SkeletonShimmer className="h-12 w-20 mb-2" />
              <SkeletonShimmer className="h-4 w-16" />
            </div>
            {i < 3 && <SkeletonShimmer className="divider-diagonal" />}
          </div>
        ))}
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonShimmer key={i} className="h-10 w-32 rounded-full" />
        ))}
      </div>
      
      {/* Content */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <SkeletonShimmer className="aspect-square rounded-full max-w-md mx-auto" />
        <div>
          <SkeletonShimmer className="h-10 w-3/4 mb-4" />
          <SkeletonShimmer className="h-24 w-full mb-6" />
          <SkeletonShimmer className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="frame-container frame-container-light p-6 sm:p-10 md:p-16">
      <div className="flex justify-between items-center mb-12">
        <SkeletonShimmer className="h-10 w-48" />
        <SkeletonShimmer className="h-10 w-10 rounded-full" />
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden">
            <SkeletonShimmer className="aspect-[4/3] w-full" />
            <div className="p-4 bg-card">
              <SkeletonShimmer className="h-4 w-20 mb-3" />
              <SkeletonShimmer className="h-6 w-full mb-2" />
              <SkeletonShimmer className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonShimmer className="h-8 w-48" />
        <SkeletonShimmer className="h-10 w-32 rounded-lg" />
      </div>
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-muted p-4 flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonShimmer key={i} className="h-4 flex-1" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="p-4 flex gap-4 border-t">
            {[1, 2, 3, 4].map((col) => (
              <SkeletonShimmer key={col} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
