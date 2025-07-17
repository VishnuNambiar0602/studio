
"use client";

import { useState, useTransition } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import { useRouter } from "next/navigation";


export function AccountManagement() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { loggedInUser, logoutUser } = useSettings();
  const router = useRouter();

  // Only render this component for customers and vendors
  if (!loggedInUser || loggedInUser.role === 'admin') {
    return null;
  }

  const handleDeleteAccount = () => {
    if (!loggedInUser) return;

    startTransition(async () => {
        // In a real app, this would call a server action:
        // const result = await deleteUser(loggedInUser.id);
        
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
          title: "Account Deleted",
          description: "Your account and all associated data have been permanently removed.",
        });
        
        logoutUser();
        router.push('/');
    });
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>
          These actions are permanent and cannot be undone. Please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-destructive/50">
          <div>
            <h3 className="font-semibold text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all of your data.
            </p>
          </div>
           <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? "Deleting..." : "Yes, delete my account"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
           </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
