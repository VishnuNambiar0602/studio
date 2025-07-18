
"use client";

import { useState, useEffect } from "react";
import { getCustomerOrders } from "@/lib/actions";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PackageCheck, HelpCircle, FileText, ShoppingCart, User } from "lucide-react";
import { cva } from "class-variance-authority";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { useSettings } from "@/context/settings-context";
import Link from "next/link";

const statusBadgeVariants = cva("capitalize font-semibold", {
  variants: {
    status: {
      Placed: "bg-blue-100 text-blue-800",
      Processing: "bg-yellow-100 text-yellow-800",
      'Ready for Pickup': "bg-purple-100 text-purple-800",
      'Picked Up': "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    },
  },
});

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { loggedInUser } = useSettings();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!loggedInUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getCustomerOrders(loggedInUser.id);
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [loggedInUser]);
  
  const handleOrderCancelled = (orderId: string) => {
    setOrders(prevOrders => 
        prevOrders.map(order => 
            order.id === orderId ? { ...order, status: 'Cancelled', cancelable: false } : order
        )
    );
  };
  
  const getStatusDescription = (order: Order) => {
      switch (order.status) {
          case 'Placed':
              return 'Your order has been placed successfully.';
          case 'Processing':
              return 'Your parts are being prepared and sent to the vendor.';
          case 'Ready for Pickup':
              return `Ready for pickup at ${order.items[0]?.vendorAddress}.`;
          case 'Picked Up':
              return `Picked up on ${new Date(order.completionDate || order.orderDate).toLocaleDateString()}.`;
          case 'Cancelled':
              return 'This order has been cancelled.';
          default:
              return 'Track your package for more details.';
      }
  }

  if (loading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <Card className="animate-pulse"><CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader><CardContent><div className="h-24 bg-muted rounded"></div></CardContent></Card>
                <Card className="animate-pulse"><CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader><CardContent><div className="h-24 bg-muted rounded"></div></CardContent></Card>
            </div>
            <div className="lg:col-span-1"><Card className="animate-pulse h-48"><CardContent><div className="h-full bg-muted rounded"></div></CardContent></Card></div>
        </div>
    );
  }

  if (!loggedInUser) {
      return (
        <div className="text-center py-16 border rounded-lg bg-card">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Please Log In</h2>
            <p className="text-muted-foreground mt-2 mb-6">
                You need to be logged in to view your order history.
            </p>
            <Button asChild>
                <Link href="/auth">Login or Sign Up</Link>
            </Button>
      </div>
      )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-card">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">No Orders Yet</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          You haven't placed any orders. Start shopping to see them here!
        </p>
        <Button asChild>
            <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
            {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 px-6">
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">ORDER PLACED</p>
                                <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                             <div>
                                <p className="text-xs text-muted-foreground">TOTAL</p>
                                <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                            </div>
                            <div className="w-full sm:w-auto">
                               <p className="text-xs text-muted-foreground">ORDER # {order.id.split("-")[1]}</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                           <Badge className={statusBadgeVariants({ status: order.status })}>{order.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">
                           {getStatusDescription(order)}
                        </h3>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <Image 
                                    src={item.imageUrls[0]} 
                                    alt={item.name} 
                                    width={100} height={100} 
                                    className="rounded-md object-cover border"
                                    data-ai-hint="car part"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-primary">{item.name}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                    <p className="text-sm mt-1">Pickup from: {item.vendorAddress}</p>
                                    <Button variant="secondary" size="sm" className="mt-2" asChild>
                                      <Link href={`/part/${item.id}`}>Buy it again</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    { (order.cancelable || order.status !== 'Cancelled') &&
                    <CardFooter className="bg-muted/50 px-6 py-4 border-t flex-wrap gap-2 justify-end">
                        {order.status !== 'Cancelled' && (
                          <Button variant="outline" asChild>
                            <Link href={`/track/${order.id}`}>
                              <PackageCheck className="mr-2 h-4 w-4" />Track Package
                            </Link>
                          </Button>
                        )}
                        <CancelOrderDialog 
                            orderId={order.id} 
                            onOrderCancelled={handleOrderCancelled}
                            disabled={!order.cancelable}
                        />
                    </CardFooter>
                    }
                </Card>
            ))}
        </div>

        <div className="lg:col-span-1 space-y-4 sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild><Link href="/support"><HelpCircle className="mr-2 h-4 w-4"/>Contact Support</Link></Button>
                    <Button variant="outline" className="w-full justify-start"><FileText className="mr-2 h-4 w-4"/>View Invoices</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
