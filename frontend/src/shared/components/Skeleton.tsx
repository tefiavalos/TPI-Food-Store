export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-stone-200 ${className}`} />
)

export const SkeletonGrilla = ({ cantidad = 8 }: { cantidad?: number }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: cantidad }, (_, i) => (
      <div key={i} className="rounded-xl border border-stone-200 bg-white p-4">
        <Skeleton className="mb-4 h-40 w-full" />
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <Skeleton className="h-9 w-full" />
      </div>
    ))}
  </div>
)

export const SkeletonFilas = ({ cantidad = 5 }: { cantidad?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: cantidad }, (_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
)
