
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/settings-context";
import { updateUserProfile } from "@/lib/actions";
import { CountryCodeSelect } from "@/components/country-code-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Please enter a valid email address."),
  countryCode: z.string(),
  phone: z.string().min(7, "Please enter a valid phone number."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileDetailsForm() {
  const { loggedInUser, loginUser } = useSettings();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const extractCountryCodeAndPhone = (fullPhoneNumber: string | undefined | null) => {
    if (!fullPhoneNumber) return { countryCode: "+968", phone: "" };
    
    // Common country codes to check against
    const codes = ["+968", "+971", "+966", "+974", "+965", "+973", "+91", "+1", "+44"];
    
    for (const code of codes) {
        if (fullPhoneNumber.startsWith(code)) {
            return {
                countryCode: code,
                phone: fullPhoneNumber.substring(code.length),
            };
        }
    }
    // Default fallback if no known code is matched
    return { countryCode: "+968", phone: fullPhoneNumber };
  };

  const { countryCode, phone } = extractCountryCodeAndPhone(loggedInUser?.phone);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: loggedInUser?.name || "",
      email: loggedInUser?.email || "",
      countryCode: countryCode,
      phone: phone,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!loggedInUser) return;
    setLoading(true);

    try {
        const fullPhoneNumber = `${data.countryCode}${data.phone.replace(/^0+/, '')}`;

      const result = await updateUserProfile(loggedInUser.id, {
        name: data.name,
        email: data.email,
        phone: fullPhoneNumber,
      });

      if (result.success && result.user) {
        loginUser(result.user); // Update the global context with new user info
        toast({
          title: "Profile Updated",
          description: "Your information has been successfully saved.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.message,
        });
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

  if (!loggedInUser) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>
          Update your name, email, and phone number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                    <Input type="email" placeholder="you@example.com" {...field} />
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
            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
