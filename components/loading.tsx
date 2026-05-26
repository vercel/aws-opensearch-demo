import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search recipes..."
        className="w-full"
        disabled
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-20 dark:bg-gray-700" />
          <Skeleton className="h-6 w-full dark:bg-gray-700" />
          <Skeleton className="h-6 w-full dark:bg-gray-700" />
          <Skeleton className="h-6 w-full dark:bg-gray-700" />
        </div>
        <div className="md:col-span-3 space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
