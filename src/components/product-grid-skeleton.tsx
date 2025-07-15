import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="p-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-1/2 mt-1" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-6 pt-0">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full col-span-2" />
      </CardFooter>
    </Card>
  );
}

export function ProductGridSkeleton() {
    return (
        <section className="py-12 lg:py-20">
          <div className="container">
            <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </div>
          </div>
        </section>
      );
}
