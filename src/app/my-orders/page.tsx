
import { Header } from "@/components/header";
import { OrderHistory } from "@/components/order-history";
import { Suspense } from "react";

export default function MyOrdersPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="py-16 lg:py-24">
                    <div className="container">
                        <h1 className="text-3xl font-bold font-headline mb-8">My Orders</h1>
                        <Suspense fallback={<div>Loading orders...</div>}>
                            <OrderHistory />
                        </Suspense>
                    </div>
                </section>
            </main>
        </div>
    );
}
