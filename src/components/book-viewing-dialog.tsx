
"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import type { Part } from "@/lib/types";
import { submitBooking } from "@/lib/actions";
import { Loader2 } from "lucide-react";

interface BookViewingDialogProps {
  part: Part;
  children: ReactNode;
}

export function BookViewingDialog({ part, children }: BookViewingDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!date) {
      toast({
        variant: "destructive",
        title: "No Date Selected",
        description: "Please select a date for the viewing.",
      });
      return;
    }

    setLoading(true);
    const result = await submitBooking(part.id, part.name, date, part.price);

    if (result.success) {
      toast({
        title: "Booking Successful!",
        description: `Your viewing for ${part.name} on ${date.toLocaleDateString()} has been requested. The vendor will be notified.`,
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was a problem submitting your request. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Viewing for: {part.name}</DialogTitle>
          <DialogDescription>
            Select a date to inspect the part. The vendor at{" "}
            <span className="font-semibold">{part.vendorAddress}</span> will be
            notified of your request.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
            className="rounded-md border"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || part.quantity === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
