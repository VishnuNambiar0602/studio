
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import type { Part } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, EyeOff, MapPin, Pencil } from "lucide-react";
import * as actions from "@/lib/actions";
import { useTransition, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { EditPartForm } from "./edit-part-form";
import { useRouter } from "next/navigation";
import { useParts } from "@/context/part-context";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";


interface VendorProductCardProps {
  part: Part;
}

export function VendorProductCard({ part }: VendorProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const { updatePartInContext } = useParts();
  const { language } = useSettings();
  const t = getDictionary(language);


  const handleToggleVisibility = () => {
    startTransition(async () => {
        const updatedPart = { ...part, isVisibleForSale: !part.isVisibleForSale };
        await actions.updatePart(part.id, updatedPart);
        updatePartInContext(updatedPart);
    });
  };

  const handleUpdate = () => {
      setIsEditDialogOpen(false);
  }

  const isInStock = part.quantity > 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          {part.imageUrls && part.imageUrls.length > 0 ? (
            <Image src={part.imageUrls[0]} alt={part.name} fill className="object-cover rounded-t-lg" data-ai-hint="car parts" />
          ) : (
            <div className="bg-muted h-full w-full flex items-center justify-center">
                <span className="text-sm text-muted-foreground">{t.productCard.noImage}</span>
            </div>
          )}
          {!part.isVisibleForSale && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white font-bold text-lg">{t.vendor.salePaused}</p>
            </div>
          )}
        </div>
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="pr-2 text-lg">{part.name}</CardTitle>
             <Badge variant={isInStock ? "secondary" : "destructive"} className="shrink-0 mt-1">
              {isInStock ? `${part.quantity} ${t.vendor.inStock}` : t.productCard.outOfStock}
            </Badge>
          </div>
          <CardDescription className="pt-2 text-sm line-clamp-2">{part.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 p-6 pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{part.vendorAddress}</span>
        </div>
        <div className="text-3xl font-bold text-primary">{part.price.toFixed(2)} OMR</div>
      </CardContent>
      <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-2">
        <Button 
            variant={part.isVisibleForSale ? "outline" : "secondary"} 
            className="w-full"
            onClick={handleToggleVisibility}
            disabled={!isInStock || isPending}
        >
          {part.isVisibleForSale ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {isPending ? t.common.loading : part.isVisibleForSale ? t.vendor.hold : t.vendor.resume}
        </Button>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Pencil className="mr-2 h-4 w-4" />
              {t.vendor.edit}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{t.vendor.editPart}</DialogTitle>
                <DialogDescription>
                    {t.vendor.updateDetails}
                </DialogDescription>
            </DialogHeader>
            <EditPartForm part={part} onUpdate={handleUpdate} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
