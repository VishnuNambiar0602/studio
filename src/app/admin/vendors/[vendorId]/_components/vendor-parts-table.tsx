
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { EditPartForm } from "@/components/edit-part-form";
import type { Part } from "@/lib/types";
import { useRouter } from "next/navigation";

interface VendorPartsTableProps {
  parts: (Part & { unitsSold: number; revenue: number; })[];
}

export function VendorPartsTable({ parts }: VendorPartsTableProps) {
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleEditClick = (part: Part) => {
    setSelectedPart(part);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdate = () => {
    setIsEditDialogOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Name</TableHead>
              <TableHead>Price (OMR)</TableHead>
              <TableHead>Qty Left</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Revenue (OMR)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map(part => (
              <TableRow key={part.id}>
                <TableCell className="font-medium break-words max-w-xs">{part.name}</TableCell>
                <TableCell>{part.price.toFixed(2)}</TableCell>
                <TableCell>{part.quantity}</TableCell>
                <TableCell>{part.unitsSold}</TableCell>
                <TableCell>{part.revenue.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={part.isVisibleForSale ? 'secondary' : 'outline'}>
                    {part.isVisibleForSale ? 'For Sale' : 'On Hold'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(part)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" />
                      Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedPart && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit Part</DialogTitle>
                <DialogDescription>
                    Update the details for this part. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <EditPartForm part={selectedPart} onUpdate={handleUpdate} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
