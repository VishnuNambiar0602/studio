// Edited

"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cancelOrder } from '@/lib/actions';
import { Loader2, XCircle } from 'lucide-react';
import { useSettings } from '@/context/settings-context';
import { getDictionary } from '@/lib/i18n';

interface CancelOrderDialogProps {
  orderId: string;
  disabled: boolean;
  onOrderCancelled: (orderId: string) => void;
}

export function CancelOrderDialog({ orderId, disabled, onOrderCancelled }: CancelOrderDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language } = useSettings();
  const t = getDictionary(language);

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result.success) {
        toast({
          title: t.dialogs.orderCancelled,
          description: `Order #${orderId.split('-')[1]} has been successfully cancelled.`,
        });
        onOrderCancelled(orderId);
      } else {
        toast({
          variant: 'destructive',
          title: t.dialogs.cancellationFailed,
          description: result.message,
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={disabled || isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          {isPending ? t.dialogs.cancelling : t.dialogs.cancelOrder}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.dialogs.cancelOrderQuestion}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.dialogs.cancelOrderWarning}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.dialogs.keepOrder}</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isPending}>
            {t.dialogs.continueCancellation}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
