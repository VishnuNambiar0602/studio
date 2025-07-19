
"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import type { Part } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
    part: Part;
}

export function AddToCartButton({ part }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const isInStock = part.quantity > 0;

    const handleAddToCart = () => {
        addToCart(part, quantity); 
        toast({
            title: "Added to Cart!",
            description: `${quantity} x ${part.name} has been added to your cart.`
        });
    };

    if (!isInStock) {
        return <Button size="lg" disabled className="w-full">Out of Stock</Button>;
    }
    
    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="quantity" className="font-medium">Quantity</Label>
                    <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                </div>
                <Slider
                    id="quantity"
                    min={1}
                    max={part.quantity}
                    step={1}
                    value={[quantity]}
                    onValueChange={(value) => setQuantity(value[0])}
                    disabled={!isInStock}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>{part.quantity} available</span>
                </div>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="w-full">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
        </div>
    );
}
