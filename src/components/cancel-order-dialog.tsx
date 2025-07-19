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

interface CancelOrderDialogProps {
  orderId: string;
  disabled: boolean;
  onOrderCancelled: (orderId: string) => void;
}

export function CancelOrderDialog({ orderId, disabled, onOrderCancelled }: CancelOrderDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result.success) {
        toast({
          title: 'Order Cancelled',
          description: `Order #${orderId.split('-')[1]} has been successfully cancelled.`,
        });
        onOrderCancelled(orderId);
      } else {
        toast({
          variant: 'destructive',
          title: 'Cancellation Failed',
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
          {isPending ? 'Cancelling...' : 'Cancel Order'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will be refunded according to our cancellation policy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Order</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isPending}>
            Continue Cancellation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
