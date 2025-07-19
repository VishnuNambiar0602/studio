// Edited

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useCart } from "@/context/cart-context";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { useSettings } from "@/context/settings-context";
import { useState } from "react";
import { Loader2, CreditCard, Landmark, CircleDollarSign, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { placeOrder } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  paymentMethod: z.enum(["card", "cod", "upi", "netbanking"], {
    required_error: "You need to select a payment method.",
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
}).refine((data) => {
    if (data.paymentMethod === "card") {
        return (
            !!data.cardNumber?.match(/^\d{16}$/) &&
            !!data.expiryDate?.match(/^(0[1-9]|1[0-2])\/\d{2}$/) &&
            !!data.cvc?.match(/^\d{3,4}$/)
        );
    }
    return true;
}, {
    message: "Card details are incomplete or invalid.",
    path: ["cardNumber"], // You can specify a path to show the error, e.g., on the first card field
});


export function CheckoutForm() {
    const { cart, total, clearCart } = useCart();
    const { loggedInUser } = useSettings();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: loggedInUser?.name || "",
            email: loggedInUser?.email || "",
            address: "",
            city: "",
            postalCode: "",
            paymentMethod: "card",
            cardNumber: "",
            expiryDate: "",
            cvc: "",
        },
    });

    const paymentMethod = form.watch("paymentMethod");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        const result = await placeOrder({
            userId: loggedInUser?.id || 'guest-user',
            items: cart,
            total: total,
            shippingDetails: values
        });

        if (result.success) {
            toast({
                title: "Order Placed!",
                description: `Your order #${result.orderId?.split('-')[1]} has been successfully placed.`,
            });
            clearCart();
            router.push('/my-orders');
        } else {
            toast({
                variant: 'destructive',
                title: 'Order Failed',
                description: result.message
            });
        }

        setLoading(false);
    }
    
    if (cart.length === 0 && !loading) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
                <p className="text-muted-foreground mt-2">Add items to your cart to proceed with checkout.</p>
                <Button onClick={() => router.push('/')} className="mt-6">Continue Shopping</Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="address" render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="city" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="postalCode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>Choose how you would like to pay.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                            >
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                                    </FormControl>
                                                    <Label htmlFor="card" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                        <CreditCard className="mb-3 h-6 w-6" />
                                                        Card Payment
                                                    </Label>
                                                </FormItem>
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                                                    </FormControl>
                                                    <Label htmlFor="cod" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                        <CircleDollarSign className="mb-3 h-6 w-6" />
                                                        Cash on Delivery
                                                    </Label>
                                                </FormItem>
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                                                    </FormControl>
                                                    <Label htmlFor="upi" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                        <Smartphone className="mb-3 h-6 w-6" />
                                                        UPI / Online Payment
                                                    </Label>
                                                </FormItem>
                                                 <FormItem>
                                                    <FormControl>
                                                        <RadioGroupItem value="netbanking" id="netbanking" className="peer sr-only" />
                                                    </FormControl>
                                                    <Label htmlFor="netbanking" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                        <Landmark className="mb-3 h-6 w-6" />
                                                        Net Banking
                                                    </Label>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {paymentMethod === 'card' && (
                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                            <FormItem className="md:col-span-4">
                                                <FormLabel>Card Number</FormLabel>
                                                <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                            <FormItem className="md:col-span-3">
                                                <FormLabel>Expiry Date</FormLabel>
                                                <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="cvc" render={({ field }) => (
                                            <FormItem className="md:col-span-1">
                                                <FormLabel>CVC</FormLabel>
                                                <FormControl><Input placeholder="123" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                )}
                                {paymentMethod === 'cod' && (
                                    <div className="pt-6 text-center text-sm text-muted-foreground">
                                        You will pay in cash upon receiving your items.
                                    </div>
                                )}
                                {paymentMethod === 'upi' && (
                                    <div className="pt-6 text-center text-sm text-muted-foreground">
                                        You will be redirected to the UPI payment gateway after placing the order. (Simulation)
                                    </div>
                                )}
                                {paymentMethod === 'netbanking' && (
                                    <div className="pt-6 text-center text-sm text-muted-foreground">
                                        You will be redirected to your bank's portal after placing the order. (Simulation)
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Button type="submit" size="lg" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Place Order
                        </Button>
                    </form>
                </Form>
            </div>

            <div className="lg:col-span-1">
                 <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>{cart.length} item(s)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ScrollArea className="h-64 pr-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 mb-4">
                                    <Image src={item.imageUrls[0]} alt={item.name} width={64} height={64} className="rounded-md object-cover border" />
                                    <div className="flex-grow">
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-muted-foreground text-sm">Qty: {item.purchaseQuantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">${(item.price * item.purchaseQuantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </ScrollArea>
                        <Separator />
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium">Free</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
