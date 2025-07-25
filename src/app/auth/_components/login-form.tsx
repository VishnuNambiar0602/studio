// Edited
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/settings-context";
import { loginUser } from "@/lib/actions";
import { ForgotPasswordDialog } from "./forgot-password-dialog";

const formSchema = z.object({
  identifier: z.string().min(1, { message: "Please enter your email or usernametag." }),
  password: z.string().min(1, { message: "Please enter your password." }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { loginUser: setLoggedInUserContext } = useSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    // Quick check for admin credentials on the main login form
    if (values.identifier === 'admin' && values.password === 'admin') {
        router.push('/admin');
        setLoading(false);
        return;
    }

    try {
      const result = await loginUser({
        identifier: values.identifier,
        password: values.password
      });

      if (!result.success || !result.user) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message,
        });
        setLoading(false);
        return;
      }

      setLoggedInUserContext(result.user);

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${result.user.name}!`,
      });
      
      form.reset();

      // Correctly redirect based on user role
      if (result.user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Usernametag</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com or YourUsernametag" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
          <div className="flex items-center justify-end">
            <ForgotPasswordDialog />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </form>
      </Form>
    </>
  );
}
