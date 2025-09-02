
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/settings-context";
import { registerUser } from "@/lib/actions";
import { getDictionary } from "@/lib/i18n";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CountryCodeSelect } from "@/components/country-code-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  countryCode: z.string(),
  phone: z.string().min(7, { message: "Please enter a valid phone number." }),
  accountType: z.enum(["individual", "business"], { required_error: "Please select an account type." }),
  shopAddress: z.string().optional(),
  zipCode: z.string().optional(),
});

interface AuthFormProps {
    userType: 'customer';
}

export function AuthForm({ userType }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { loginUser: setLoggedInUserContext, language } = useSettings();
  const t = getDictionary(language);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      countryCode: "+968",
      phone: "",
      shopAddress: "",
      zipCode: "",
    },
  });

  const accountType = form.watch("accountType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
        const fullPhoneNumber = `${values.countryCode}${values.phone.replace(/^0+/, '')}`;

        const result = await registerUser({
            name: values.name,
            email: values.email,
            password: values.password,
            role: userType,
            phone: fullPhoneNumber,
            accountType: values.accountType,
            shopAddress: values.shopAddress,
            zipCode: values.zipCode,
        });

        if (!result.success || !result.user) {
            toast({
                variant: "destructive",
                title: t.auth.registrationFailed,
                description: result.message,
            });
            setLoading(false);
            return;
        }
        
        setShowWelcomeAlert(true);
        // Defer redirection to allow user to see welcome message.
        setTimeout(() => {
            setLoggedInUserContext(result.user);
            router.push('/');
        }, 3000);


    } catch (error) {
        toast({
            variant: "destructive",
            title: t.auth.anErrorOccurred,
            description: t.auth.somethingWentWrong,
        });
        setLoading(false);
    }
  }

  if (showWelcomeAlert) {
    return (
        <Alert>
            <AlertTitle className="text-xl font-bold">Welcome to GulfCarX!</AlertTitle>
            <AlertDescription className="mt-2">
                Your account has been created successfully. A confirmation message has been sent to your mobile number. You will be redirected shortly.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Are you signing up as an individual or a business?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="individual" />
                    </FormControl>
                    <FormLabel className="font-normal">Individual</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="business" />
                    </FormControl>
                    <FormLabel className="font-normal">Business</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{accountType === 'business' ? t.auth.companyName : t.auth.fullName}</FormLabel>
              <FormControl>
                <Input placeholder={accountType === 'business' ? t.auth.companyNamePlaceholder : t.auth.fullNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.email}</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <div className="flex gap-2">
                <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                        <CountryCodeSelect field={field} />
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                         <FormControl>
                            <Input type="tel" placeholder="123 456 789" {...field} />
                        </FormControl>
                    )}
                />
            </div>
            <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
        </FormItem>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.password}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.auth.createAccount}
        </Button>
      </form>
    </Form>
  );
}
