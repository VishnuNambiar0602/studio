
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetCode, resetPasswordWithCode } from "@/lib/actions";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

const resetSchema = z.object({
  code: z.string().min(6, { message: "Verification code must be 6 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type Step = "enter-email" | "enter-code" | "success";

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("enter-email");
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [simulatedCode, setSimulatedCode] = useState("");
  const [showCodeAlert, setShowCodeAlert] = useState(false);
  const { toast } = useToast();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setLoading(true);
    const result = await sendPasswordResetCode(values.email);

    if (result.success && result.code && result.username) {
      setUserEmail(values.email);
      setSimulatedCode(result.code);
      setUsername(result.username);
      setShowCodeAlert(true); // Trigger the alert to show the code
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
    setLoading(false);
  };

  const handleResetSubmit = async (values: z.infer<typeof resetSchema>) => {
    setLoading(true);
    const result = await resetPasswordWithCode({
      email: userEmail,
      code: values.code,
      newPassword: values.newPassword,
    });

    if (result.success) {
      toast({
        title: "Success!",
        description: "Your password has been reset. You can now log in.",
      });
      setStep("success");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
    setLoading(false);
  };
  
  const resetFlow = () => {
    setStep("enter-email");
    emailForm.reset();
    resetForm.reset();
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
           <Button variant="link" className="p-0 h-auto text-sm">
            Forgot Password?
          </Button>
        </DialogTrigger>
        <DialogContent>
          {step === "enter-email" && (
            <>
              <DialogHeader>
                <DialogTitle>Reset Your Password</DialogTitle>
                <DialogDescription>
                  Enter your email address and we'll send you a verification code.
                </DialogDescription>
              </DialogHeader>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Code
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}

          {step === "enter-code" && (
            <>
              <DialogHeader>
                <DialogTitle>Enter Verification Code</DialogTitle>
                <DialogDescription>
                  Check the pop-up for your code and enter it below along with a new password.
                </DialogDescription>
              </DialogHeader>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Reset Password
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}

           {step === "success" && (
            <>
              <DialogHeader>
                <DialogTitle>Password Reset Successfully</DialogTitle>
                <DialogDescription>
                  You can now use your new password to log in to your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button onClick={resetFlow}>Close</Button>
              </DialogFooter>
            </>
           )}
        </DialogContent>
      </Dialog>
      
      {/* This AlertDialog simulates the email */}
      <AlertDialog open={showCodeAlert} onOpenChange={setShowCodeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Account Recovery (Simulation)</AlertDialogTitle>
            <AlertDialogDescription>
              In a real application, this would be sent to your email.
              <p className="mt-4">Your usernametag is: <span className="font-bold">{username}</span></p>
              <p>Please use the code below to proceed:</p>
              <div className="text-center font-mono text-2xl tracking-widest py-4 bg-muted rounded-md my-4">
                {simulatedCode}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowCodeAlert(false);
              setStep("enter-code");
            }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
