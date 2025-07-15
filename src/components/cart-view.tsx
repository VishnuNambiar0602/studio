"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export function CartView() {
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-2">
            <h1 className="text-3xl font-bold font-headline mb-6">Your Cart</h1>
            <div className="space-y-4">
            {cart.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                    <Image src={item.imageUrl} alt={item.name} width={100} height={100} className="rounded-md object-cover" />
                    <div className="ml-4 flex-grow">
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-lg font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove item</span>
                    </Button>
                </Card>
            ))}
            </div>
        </div>
        <div className="md:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your order before proceeding.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg">Proceed to Checkout</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
