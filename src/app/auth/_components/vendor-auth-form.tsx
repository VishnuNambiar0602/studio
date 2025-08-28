
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/settings-context";
import { registerUser } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const phoneSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  shopAddress: z.string().min(5, { message: "Please enter a valid shop address." }),
  zipCode: z.string().min(3, { message: "Please enter a valid postal code." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export function VendorAuthForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [showOtpAlert, setShowOtpAlert] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [vendorData, setVendorData] = useState<z.infer<typeof phoneSchema> | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { loginUser: setLoggedInUserContext, language } = useSettings();
  const t = getDictionary(language);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "", name: "", shopAddress: "", zipCode: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
    setLoading(true);
    // In a real app, you would call your backend to send an OTP here.
    // For now, we simulate it.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(otp);
    setVendorData(values);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setShowOtpAlert(true);
    setStep('otp');
    setLoading(false);
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    if (values.otp !== simulatedOtp) {
      toast({ variant: "destructive", title: "Invalid OTP", description: "The OTP you entered is incorrect. Please try again." });
      setLoading(false);
      return;
    }

    if (!vendorData) {
        toast({ variant: "destructive", title: "Error", description: "Something went wrong, please start over." });
        setStep('phone');
        setLoading(false);
        return;
    }

    try {
        const result = await registerUser({
            name: vendorData.name,
            email: vendorData.email || `${vendorData.phone}@gulfcarx.local`, // Use phone as email if not provided
            role: 'vendor',
            phone: vendorData.phone,
            accountType: 'business',
            shopAddress: vendorData.shopAddress,
            zipCode: vendorData.zipCode,
        });

        if (!result.success || !result.user) {
            toast({
                variant: "destructive",
                title: t.auth.registrationFailed,
                description: result.message,
            });
            setLoading(false);
            setStep('phone');
            return;
        }

        setLoggedInUserContext(result.user);

        toast({
            title: t.auth.accountCreated,
            description: `Your vendor account has been successfully created.`,
        });
        
        phoneForm.reset();
        otpForm.reset();
        router.push('/vendor/dashboard');

    } catch (error) {
        toast({
            variant: "destructive",
            title: t.auth.anErrorOccurred,
            description: t.auth.somethingWentWrong,
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      {step === 'phone' && (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
             <FormField
              control={phoneForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.auth.companyName}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.auth.companyNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Login Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+968 1234 5678" {...field} />
                  </FormControl>
                  <FormDescription>This will be your login identifier. An OTP will be sent here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={phoneForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={phoneForm.control}
                name="shopAddress"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.auth.shopAddress}</FormLabel>
                        <FormControl>
                            <Input placeholder={t.auth.shopAddressPlaceholder} {...field} />
                        </FormControl>
                        <FormDescription>We recommend using Google Maps for accurate address suggestions.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={phoneForm.control}
                name="zipCode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.auth.zipCode}</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 113" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
            </Button>
          </form>
        </Form>
      )}

      {step === 'otp' && (
        <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                 <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter 6-Digit OTP</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormDescription>An OTP was sent to {vendorData?.phone}.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Create Account"}
                </Button>
                <Button variant="link" onClick={() => setStep('phone')} className="w-full">Back</Button>
            </form>
        </Form>
      )}

      <AlertDialog open={showOtpAlert} onOpenChange={setShowOtpAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>OTP Sent (Simulation)</AlertDialogTitle>
            <AlertDialogDescription>
                In a real application, this OTP would be sent via SMS. For now, use this code:
                 <div className="text-center font-mono text-2xl tracking-widest py-4 bg-muted rounded-md my-4">
                  {simulatedOtp}
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowOtpAlert(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
