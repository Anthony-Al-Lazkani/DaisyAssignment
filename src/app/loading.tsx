import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border-2 border-border overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
