
import { getOrderById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Loader, Package, Store, Check } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

const timelineSteps: { status: OrderStatus; title: string; description: string; icon: React.ElementType }[] = [
    { status: 'Placed', title: 'Order Placed', description: 'We have received your order and are preparing it.', icon: CheckCircle },
    { status: 'Processing', title: 'Processing at Hub', description: 'Your parts are being processed and dispatched to the vendor.', icon: Loader },
    { status: 'Ready for Pickup', title: 'Ready for Pickup', description: 'Your order has arrived at the vendor store.', icon: Store },
    { status: 'Picked Up', title: 'Order Picked Up', description: 'You have collected your order. Thank you!', icon: Package },
];

const statusOrder: OrderStatus[] = ['Placed', 'Processing', 'Ready for Pickup', 'Picked Up'];

export default async function TrackOrderPage({ params }: { params: { orderId: string } }) {
    const order = await getOrderById(params.orderId);

    if (!order) {
        notFound();
    }
    
    const currentStatusIndex = statusOrder.indexOf(order.status);

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 lg:py-24">
                <div className="container max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Track Your Order</CardTitle>
                            <CardDescription>Order # {order.id.split('-')[1]} | Placed on {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {timelineSteps.map((step, index) => {
                                    const isActive = index <= currentStatusIndex;
                                    const isCompleted = index < currentStatusIndex || order.status === 'Picked Up';
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.status} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center border-2",
                                                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground/30 text-muted-foreground"
                                                )}>
                                                    {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                                                </div>
                                                {index < timelineSteps.length - 1 && (
                                                    <div className={cn(
                                                        "w-0.5 h-16 mt-2",
                                                        isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="pt-1.5">
                                                <h3 className={cn(
                                                    "font-semibold text-lg",
                                                    !isActive && "text-muted-foreground"
                                                )}>
                                                    {step.title}
                                                </h3>
                                                <p className={cn(
                                                    "text-sm",
                                                    isActive ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
