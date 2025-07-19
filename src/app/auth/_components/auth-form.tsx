
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  username: z.string().min(3, { message: "Usernametag must be at least 3 characters." }),
  shopAddress: z.string().optional(),
  zipCode: z.string().optional(),
});

interface AuthFormProps {
    userType: 'customer' | 'vendor';
}

export function AuthForm({ userType }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { loginUser: setLoggedInUserContext, language } = useSettings();
  const t = getDictionary(language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      shopAddress: "",
      zipCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
        const result = await registerUser({
            name: values.name,
            email: values.email,
            password: values.password,
            username: values.username,
            role: userType,
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

        setLoggedInUserContext(result.user);

        toast({
            title: t.auth.accountCreated,
            description: `${t.auth.your} ${userType} ${t.auth.accountHasBeenCreated} ${result.user?.username}.`,
        });
        
        form.reset();

        if (userType === 'vendor') {
            router.push('/vendor/dashboard');
        } else {
            router.push('/');
        }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{userType === 'vendor' ? t.auth.companyName : t.auth.fullName}</FormLabel>
              <FormControl>
                <Input placeholder={userType === 'vendor' ? t.auth.companyNamePlaceholder : t.auth.fullNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.auth.usernametag}</FormLabel>
              <FormControl>
                <Input placeholder={t.auth.usernametagPlaceholder} {...field} />
              </FormControl>
               <FormDescription>
                {t.auth.usernametagDescription}
              </FormDescription>
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
         {userType === 'vendor' && (
            <>
                <FormField
                    control={form.control}
                    name="shopAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.auth.shopAddress}</FormLabel>
                            <FormControl>
                                <Input placeholder={t.auth.shopAddressPlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
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
            </>
        )}
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
