// Edited

import { getPart } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "./_components/add-to-cart-button";
import { BookViewingDialog } from "@/components/book-viewing-dialog";
import { Button } from "@/components/ui/button";

export default async function PartDetailPage({ params: { id } }: { params: { id: string } }) {
  const part = await getPart(id);

  if (!part) {
    notFound();
  }

  const isInStock = part.quantity > 0;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image Carousel */}
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {part.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative">
                        <Image
                          src={url}
                          alt={`${part.name} image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          data-ai-hint="car part"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Part Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{part.name}</h1>
                  <Badge variant={isInStock ? "secondary" : "destructive"} className="shrink-0">
                    {isInStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{part.description}</p>
              </div>
              
              <Separator />

              <div className="text-muted-foreground">
                    <div className="flex items-center text-lg">
                        <MapPin className="mr-3 h-5 w-5 shrink-0" />
                        <span className="truncate font-semibold">{part.vendorAddress}</span>
                    </div>
              </div>

               <div className="text-5xl font-bold text-primary">${part.price.toFixed(2)}</div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <BookViewingDialog part={part}>
                    <Button variant="secondary" size="lg" className="w-full" disabled={!isInStock}>
                      <CalendarPlus className="mr-2 h-5 w-5" /> Book a Viewing
                    </Button>
                </BookViewingDialog>
                <AddToCartButton part={part} />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
