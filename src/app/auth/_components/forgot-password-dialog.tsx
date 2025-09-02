
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
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetCode, resetPasswordWithCode } from "@/lib/actions";

const identifierSchema = z.object({
  identifier: z.string().min(1, { message: "Please enter your email or phone number." }),
});

const resetSchema = z.object({
  code: z.string().min(6, { message: "Verification code must be 6 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type Step = "enter-identifier" | "enter-code" | "success";

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("enter-identifier");
  const [userEmail, setUserEmail] = useState(""); // We still need the email to finalize the reset
  const { toast } = useToast();

  const identifierForm = useForm<z.infer<typeof identifierSchema>>({
    resolver: zodResolver(identifierSchema),
    defaultValues: { identifier: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  const handleIdentifierSubmit = async (values: z.infer<typeof identifierSchema>) => {
    setLoading(true);
    const result = await sendPasswordResetCode(values.identifier);

    if (result.success && result.email) {
      toast({
        title: "Code Sent",
        description: "A verification code has been sent to your registered mobile number."
      });
      setUserEmail(result.email);
      setStep("enter-code");
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
    setStep("enter-identifier");
    identifierForm.reset();
    resetForm.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="link" className="p-0 h-auto text-sm">
          Forgot Password?
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === "enter-identifier" && (
          <>
            <DialogHeader>
              <DialogTitle>Reset Your Password</DialogTitle>
              <DialogDescription>
                Enter your email address or phone number and we'll send a verification code to your associated mobile number.
              </DialogDescription>
            </DialogHeader>
            <Form {...identifierForm}>
              <form onSubmit={identifierForm.handleSubmit(handleIdentifierSubmit)} className="space-y-4">
                <FormField
                  control={identifierForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com or +96812345678" {...field} />
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
                Check your mobile phone for the code and enter it below along with a new password.
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
  );
}
