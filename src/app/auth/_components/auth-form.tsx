"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
});

interface AuthFormProps {
    userType: 'customer' | 'vendor';
}

export function AuthForm({ userType }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(`Simulating ${userType} sign up with:`, values);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
        title: "Account Created!",
        description: `Your ${userType} account has been successfully created.`,
    });
    
    setLoading(false);
    form.reset();

    if (userType === 'vendor') {
        router.push('/vendor/dashboard');
    } else {
        router.push('/');
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
              <FormLabel>{userType === 'vendor' ? 'Company Name' : 'Full Name'}</FormLabel>
              <FormControl>
                <Input placeholder={userType === 'vendor' ? 'Your Company LLC' : 'John Doe'} {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
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
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="#" className="underline font-medium text-primary">
                Log in
            </a>
        </p>
      </form>
    </Form>
  );
}
