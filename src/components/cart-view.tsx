// Edited

"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export function CartView() {
  const { cart, removeFromCart, updateCartItemQuantity, total } = useCart();
  const router = useRouter();

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
                    <Image src={item.imageUrls[0]} alt={item.name} width={100} height={100} className="rounded-md object-cover" />
                    <div className="ml-4 flex-grow">
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                             <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartItemQuantity(item.id, item.purchaseQuantity - 1)}
                                disabled={item.purchaseQuantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                className="h-8 w-16 text-center"
                                value={item.purchaseQuantity}
                                onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                min={1}
                                max={item.quantity}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartItemQuantity(item.id, item.purchaseQuantity + 1)}
                                disabled={item.purchaseQuantity >= item.quantity}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                     <div className="flex flex-col items-end justify-between h-full ml-4">
                        <p className="text-lg font-bold text-primary">${(item.price * item.purchaseQuantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Remove item</span>
                        </Button>
                    </div>
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
                    <Button className="w-full" size="lg" onClick={() => router.push('/checkout')}>Proceed to Checkout</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
