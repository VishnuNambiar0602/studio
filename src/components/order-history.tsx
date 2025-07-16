import { getCustomerOrders } from "@/lib/actions";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";

export async function OrderHistory() {
  // In a real app, you'd pass the actual logged-in user's ID
  const MOCK_USER_ID = "user-123";
  const orders = await getCustomerOrders(MOCK_USER_ID);

  const statusBadgeVariants = cva("capitalize", {
    variants: {
      status: {
        Placed: "bg-blue-100 text-blue-800",
        Processing: "bg-yellow-100 text-yellow-800",
        Shipped: "bg-purple-100 text-purple-800",
        Delivered: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
      },
    },
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No Orders Yet</h2>
        <p className="text-muted-foreground mt-2">
          You haven't placed any orders. Start shopping to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order #{order.id.split("-")[1]}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.orderDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className={statusBadgeVariants({ status: order.status })}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.vendorAddress}
                    </p>
                  </div>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end font-bold text-lg">
            <div>
              <span>Total:</span>
              <span className="ml-2">${order.total.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
