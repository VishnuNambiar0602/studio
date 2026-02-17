// Edited

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
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

interface BookViewingDialogProps {
  part: Part;
  children: ReactNode;
}

export function BookViewingDialog({ part, children }: BookViewingDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useSettings();
  const t = getDictionary(language);

  const handleSubmit = async () => {
    if (!date) {
      toast({
        variant: "destructive",
        title: t.dialogs.noDateSelected,
        description: t.dialogs.selectDate,
      });
      return;
    }

    setLoading(true);
    // Pass primitive values instead of the whole object to the server action
    const result = await submitBooking(part.id, part.name, date, part.price, part.vendorAddress);

    if (result.success) {
      toast({
        title: t.dialogs.bookingSuccessful,
        description: `Your viewing for ${part.name} on ${date.toLocaleDateString()} has been requested. The vendor will be notified.`,
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: t.dialogs.bookingFailed,
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
          <DialogTitle>{t.dialogs.bookViewing} {part.name}</DialogTitle>
          <DialogDescription>
            {t.dialogs.selectDate}
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
            {t.dialogs.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || part.quantity === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.dialogs.confirmBooking}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
